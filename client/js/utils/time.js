export const weekDays = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
export const oneHour = 1000 * 60 * 60;
export const oneDay = oneHour * 24;
export const oneWeek = oneDay * 7;

const local = 'sv-SE';
const intl = {
  durationOffset: oneHour, // because date 0 = 01:00:00 1970
  time: new Intl.DateTimeFormat(local, { hour: 'numeric', minute: 'numeric' }),
  weekDay: new Intl.DateTimeFormat(local, { weekday: 'long' }),
  date: new Intl.DateTimeFormat(local, { month: 'numeric', day: 'numeric' })
};

export function getTimeString(date, options = {}) {
  const { isDuration } = options;
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
  return timestamp / oneHour;
}

export function getWeek(timestamp) {
  const weekStart = new Date(timestamp);
  const dayOffset = weekStart.getDay() || 7;
  weekStart.setDate((weekStart.getDate() - dayOffset) + 1); // because sunday is 0 which sucks
  weekStart.setHours(0);
  weekStart.setMinutes(0);
  const weekEnd = +weekStart + (oneDay * 5); // skip weekend
  return {
    startTime: +weekStart,
    endTime: weekEnd
  };
}

export function createWorkWeek(timestamp = Date.now()) {
  const d = new Date(timestamp);
  const firstDate = d.getDate();
  const firstDay = d.getDay();
  d.setDate(firstDay ? firstDate - (firstDay - 1) : firstDate - 6);
  const monday = d.getTime();

  return weekDays
    .slice(1, 6)
    .map((weekday, delta) => ({
      weekday,
      date: getDate(new Date(monday + (oneDay * delta)))
    }));
}

export function getMonth(timestamp) {
  const monthStart = new Date(timestamp);
  monthStart.setDate(1);
  monthStart.setHours(0);
  monthStart.setMinutes(0);
  const monthEnd = new Date(timestamp);
  monthEnd.setHours(23);
  monthEnd.setMinutes(59);
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  monthEnd.setDate(0);
  return {
    startTime: +monthStart,
    endTime: +monthEnd
  };
}

export function getWorkDaysinMonth({ startTime, endTime }) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const startDay = startDate.getDay();
  const endDay = endDate.getDay();

  if (startDay === 0) { startDate.setDate(startDate.getDate() + 1); }
  if (startDay === 6) { startDate.setDate(startDate.getDate() + 2); }

  if (endDay === 0) { endDate.setDate(endDate.getDate() - 2); }
  if (endDay === 6) { endDate.setDate(endDate.getDate() - 1); }

  const totalDays = endDate.getDate() - (startDate.getDate() - 1);
  const holidays = Math.floor((totalDays + startDate.getDay()) / 7) * 2;
  return totalDays - holidays;
}

export function getWeekNumber(timestamp) {
  const date = new Date(timestamp);
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate((d.getUTCDate() + 4) - (d.getUTCDay() || 7));
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
