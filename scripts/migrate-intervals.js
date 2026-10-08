#!/usr/bin/env node
/* eslint-disable no-console */
/*
 * One-off migration (issue #14): copies the flat `intervals/{id}` records to `userIntervals/{uid}/{id}`.
 *
 *   - Dry run by default: reads, prints counts, writes nothing. Pass --write to write.
 *   - Idempotent: running it again overwrites the same paths with the same values.
 *   - Never modifies or deletes `intervals`.
 *   - Prints counts and ids only, never interval contents (notes).
 *
 * Setup (nothing is added to package.json; delete this script after the migration):
 *   npm install --no-save firebase-admin
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json   # delete the key afterwards
 *   export FIREBASE_DATABASE_URL=https://<your-database>.firebaseio.com
 *   node scripts/migrate-intervals.js            # dry run
 *   node scripts/migrate-intervals.js --write    # copy, then verify the counts
 */

// What the rules in database.rules.json accept for an interval under userIntervals/<uid>
const TYPES = {
  createdAt: 'number',
  updatedAt: 'number',
  startTime: 'number',
  endTime: 'number',
  notWork: 'boolean',
  note: 'string',
};
const REQUIRED = ['createdAt', 'startTime'];

function passesRules(interval) {
  const keys = Object.keys(interval);
  return (
    REQUIRED.every((key) => keys.includes(key)) &&
    // eslint-disable-next-line valid-typeof
    keys.every((key) => TYPES[key] && typeof interval[key] === TYPES[key])
  );
}

function planMigration(intervals) {
  const updates = {};
  const perUser = {};
  const skipped = [];
  const wontValidate = [];

  Object.entries(intervals || {}).forEach(([id, record]) => {
    if (!record || typeof record.user !== 'string' || !record.user) {
      skipped.push(id);
      return;
    }
    const { user, ...interval } = record;
    updates[`${user}/${id}`] = interval;
    perUser[user] = (perUser[user] || 0) + 1;
    if (!passesRules(interval)) wontValidate.push(id);
  });

  return { updates, perUser, skipped, wontValidate };
}

function countPerUser(userIntervals) {
  return Object.fromEntries(
    Object.entries(userIntervals || {}).map(([uid, intervals]) => [
      uid,
      Object.keys(intervals).length,
    ])
  );
}

async function main() {
  const write = process.argv.includes('--write');
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  if (!databaseURL || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('Set FIREBASE_DATABASE_URL and GOOGLE_APPLICATION_CREDENTIALS (see the header).');
    process.exit(1);
  }

  // eslint-disable-next-line global-require, import/no-extraneous-dependencies, import/no-unresolved
  const admin = require('firebase-admin');
  admin.initializeApp({ credential: admin.credential.applicationDefault(), databaseURL });
  const db = admin.database();

  const source = (await db.ref('intervals').once('value')).val();
  const { updates, perUser, skipped, wontValidate } = planMigration(source);
  const total = Object.keys(updates).length;

  console.log(`${write ? 'WRITE' : 'DRY RUN'}: ${Object.keys(source || {}).length} intervals read`);
  console.log(`  to copy: ${total}`);
  Object.entries(perUser).forEach(([uid, count]) => console.log(`    ${uid}: ${count}`));
  console.log(`  skipped (no user field): ${skipped.length} ${skipped.slice(0, 20).join(', ')}`);
  console.log(
    `  copied but the new rules would reject writes to them: ${wontValidate.length} ${wontValidate
      .slice(0, 20)
      .join(', ')}`
  );

  if (!write) {
    console.log('Nothing was written. Re-run with --write to copy.');
    return;
  }

  const paths = Object.keys(updates);
  for (let i = 0; i < paths.length; i += 500) {
    const chunk = Object.fromEntries(paths.slice(i, i + 500).map((path) => [path, updates[path]]));
    // eslint-disable-next-line no-await-in-loop
    await db.ref('userIntervals').update(chunk);
  }

  const copied = countPerUser((await db.ref('userIntervals').once('value')).val());
  const mismatches = Object.entries(perUser).filter(([uid, count]) => copied[uid] !== count);
  if (mismatches.length) {
    console.error('VERIFY FAILED, counts differ for:', mismatches.map(([uid]) => uid).join(', '));
    process.exit(1);
  }
  console.log(
    `VERIFIED: userIntervals holds at least the ${total} copied intervals for every user.`
  );
}

module.exports = { planMigration };

if (require.main === module) {
  main().then(
    () => process.exit(0),
    (error) => {
      console.error(error.message);
      process.exit(1);
    }
  );
}
