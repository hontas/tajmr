// The app formats durations assuming Swedish time (see `durationOffset` in utils/time.js),
// so tests must run in that timezone regardless of the machine they run on.
module.exports = async () => {
  process.env.TZ = 'Europe/Stockholm';
};
