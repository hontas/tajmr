const { planMigration } = require('./migrate-intervals');

const interval = (extra = {}) => ({ createdAt: 1, startTime: 2, endTime: 3, ...extra });

describe('planMigration', () => {
  test('copies each interval to userIntervals/<user>/<id> without the user field', () => {
    const { updates } = planMigration({
      a: interval({ user: 'u1', note: 'work', notWork: false }),
      b: interval({ user: 'u2' }),
    });

    expect(updates).toEqual({
      'u1/a': { createdAt: 1, startTime: 2, endTime: 3, note: 'work', notWork: false },
      'u2/b': { createdAt: 1, startTime: 2, endTime: 3 },
    });
  });

  test('counts intervals per user', () => {
    const { perUser } = planMigration({
      a: interval({ user: 'u1' }),
      b: interval({ user: 'u1' }),
      c: interval({ user: 'u2' }),
    });

    expect(perUser).toEqual({ u1: 2, u2: 1 });
  });

  test('is idempotent: the same input gives the same paths and values', () => {
    const data = { a: interval({ user: 'u1' }), b: interval({ user: 'u2' }) };

    expect(planMigration(data)).toEqual(planMigration(data));
  });

  test('skips intervals without a usable user and reports their ids', () => {
    const { updates, skipped } = planMigration({
      ok: interval({ user: 'u1' }),
      noUser: interval(),
      emptyUser: interval({ user: '' }),
      numericUser: interval({ user: 5 }),
      broken: null,
    });

    expect(Object.keys(updates)).toEqual(['u1/ok']);
    expect(skipped).toEqual(['noUser', 'emptyUser', 'numericUser', 'broken']);
  });

  test('flags intervals the new rules would reject, but still copies them', () => {
    const { updates, wontValidate } = planMigration({
      good: interval({ user: 'u1' }),
      noCreatedAt: { user: 'u1', startTime: 2 },
      badType: interval({ user: 'u1', note: 7 }),
      extra: interval({ user: 'u1', surprise: true }),
    });

    expect(Object.keys(updates)).toHaveLength(4);
    expect(wontValidate).toEqual(['noCreatedAt', 'badType', 'extra']);
  });

  test('handles an empty or missing database', () => {
    expect(planMigration(null)).toEqual({
      updates: {},
      perUser: {},
      skipped: [],
      wontValidate: [],
    });
    expect(planMigration({}).updates).toEqual({});
  });

  test('never puts interval contents in the report fields', () => {
    const report = planMigration({ a: interval({ user: 'u1', note: 'secret note' }) });
    const summary = { ...report };
    delete summary.updates;

    expect(JSON.stringify(summary)).not.toContain('secret note');
  });
});
