export const weekDays = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];

const oneDay = 1000 * 60 * 60 * 24;
const oneWeek = 1000 * 60 * 60 * 24 * 7;

const local = 'sv-SE';
const intl = {
  durationOffset: 1000 * 60 * 60, // because date 0 = 01:00:00 1970
  time: new Intl.DateTimeFormat(local, { hour: 'numeric', minute: 'numeric' }),
  weekDay: new Intl.DateTimeFormat(local, { weekday: 'long' }),
  date: new Intl.DateTimeFormat(local, { month: 'numeric', day: 'numeric' })
};

export function getTimeString(date, { isDuration } = {}) {
  const timestamp = isDuration ? date - intl.durationOffset : date;
  return intl.time.format(timestamp);
}

export function getWeekday(date) {
  return intl.weekDay.format(date);
}

export function getDate(date) {
  return intl.date.format(date);
}

export function getHours(timestamp) {
  return timestamp / 1000 / 60 / 60;
}

export function getWeek(timestamp) {
  const date = new Date(timestamp);
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil((((d - yearStart) / oneDay) + 1) / 7);
}

export function zeroPad(num) {
  return num < 10 ? `0${num}` : num;
}

export function getTimePartsFromElapsedTime(timestamp) {
  const hours = Math.floor(timestamp / 1000 / 3600);
  const minutes = Math.floor(timestamp / 1000 / 60) % 60;
  const seconds = Math.floor(timestamp / 1000) % 60;

  return { hours, minutes, seconds };
}

export function getTimePartsFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = zeroPad(date.getHours());
  const minutes = zeroPad(date.getMinutes());
  const seconds = zeroPad(date.getSeconds());

  return { hours, minutes, seconds };
}

export function startOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  return newDate;
}

export function subtractDays(date, days = 0) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}

const sameYear = (a, b) => a.getFullYear() === b.getFullYear();
const sameMonth = (a, b) => a.getMonth() === b.getMonth();
const sameDay = (a, b) => a.getDate() === b.getDate();

export function isToday(date) {
  const today = new Date();
  return sameYear(today, date) && sameMonth(today, date) && sameDay(today, date);
}

export function isSameWeek(date1, date2) {
  if (!(date1 instanceof Date && date2 instanceof Date)) throw Error('Must supply valid dates');

  const timestampDiff = Math.abs(date1 - date2);

  if (timestampDiff < oneWeek) {
    // less than 7 days apart
    const dates = [new Date(date1), new Date(date2)]
      .map((d) => ({ day: d.getDay(), date: d.getDate(), timestamp: d.getTime() }))
      .sort((a, b) => a.timestamp - b.timestamp);

    if (!dates[0].day && dates[1].day) {
      return false;
    }
    if (dates[0].day && !dates[1].day) {
      // date[1] is next sunday
      return true;
    }
    if (dates[0].day === dates[1].day) {
      return dates[0].date === dates[1].date;
    }

    return dates[0].day <= dates[1].day;
  }
  return false;
}

export function isCurrentWeek(date) {
  return isSameWeek(date, new Date());
}
