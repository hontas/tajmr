export const weekDays = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];

export function zeroPad(num) {
  return num < 10 ? '0' + num : num;
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

export function getWeekday(date) {
  return weekDays[date.getDay()];
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

  const dates = [new Date(date1), new Date(date2)].sort((a, b) => a.getTime() - b.getTime());
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const timestampDiff = dates
    .map((d) => d.getTime())
    .reduce((sum, curr) => curr - sum);

  if (timestampDiff < oneWeek) {
    // less than 7 days apart
    if (!dates[0].getDay() && dates[1].getDay()) {
      return false;
    }
    if (dates[0].getDay() && !dates[1].getDay()) {
      // date[1] is next sunday
      return true;
    }
    return dates[0].getDay() <= dates[1].getDay();
  }
  return false;
}

export function isCurrentWeek(date) {
  return isSameWeek(date, new Date());
}
