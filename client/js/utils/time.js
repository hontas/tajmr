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

export function isCurrentWeek(date) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  return sameDay(date, weekStart);
}
