// Tests default to Swedish time so results are the same on every machine. Set TZ to run the suite in
// another timezone (`npm run test:timezones` does): the code must not depend on the timezone.
module.exports = async () => {
  process.env.TZ = process.env.TZ || 'Europe/Stockholm';
};
