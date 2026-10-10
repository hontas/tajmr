export const months = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'oktober',
  'november',
  'december',
];
const weekDays = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag', 'söndag'];
export const oneHour = 1000 * 60 * 60;
const oneDay = oneHour * 24;
export const oneWeek = oneDay * 7;

const local = 'sv-SE';
const intl = {
  time: new Intl.DateTimeFormat(local, { hour: '2-digit', minute: '2-digit' }),
  weekDay: new Intl.DateTimeFormat(local, { weekday: 'short' }),
  date: new Intl.DateTimeFormat(local, { month: 'numeric', day: 'numeric' }),
  dateTime: new Intl.DateTimeFormat(local, { dateStyle: 'medium', timeStyle: 'short' }),
};

export function getTimeString(timestamp: number) {
  return intl.time.format(timestamp);
}

export function getDurationString(elapsed: number) {
  const { hours, minutes } = getTimePartsFromElapsedTime(Math.max(0, elapsed));
  return `${zeroPad(hours)}:${zeroPad(minutes)}`;
}

export function getDateTimeString(value?: string | number | Date) {
  const date = new Date(value ?? NaN);
  return Number.isNaN(date.getTime()) ? '' : intl.dateTime.format(date);
}

export function getWeekday(date: Date | number) {
  return intl.weekDay.format(date);
}

export function getDate(date: Date | number) {
  return intl.date.format(date);
}

export function toDateInputValue(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`;
}

export function fromDateInputValue(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getHours(timestamp: number) {
  return timestamp / oneHour;
}

export function getDayRange(timestamp?: number | Date) {
  return {
    startTime: +startOfDay(timestamp),
    endTime: +endOfDay(timestamp),
  };
}

// a week with a DST change is not 7 * 24h long
export function getWeek(timestamp: number) {
  const weekStart = new Date(timestamp);
  weekStart.setHours(0, 0, 0, 0);
  const dayOffset = weekStart.getDay() || 7;
  weekStart.setDate(weekStart.getDate() - dayOffset + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return {
    startTime: +weekStart,
    endTime: +weekEnd,
  };
}

export function createWorkWeek(timestamp: number = Date.now()) {
  const monday = new Date(timestamp);
  const firstDate = monday.getDate();
  const firstDay = monday.getDay();
  monday.setDate(firstDay ? firstDate - (firstDay - 1) : firstDate - 6);

  return weekDays.slice(1, 8).map((weekday, delta) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + delta); // calendar days, not 24h steps
    return {
      isWeekEnd: delta > 4,
      weekday,
      date: getDate(day),
    };
  });
}

// the day clamps to the last day of the target month (31 Oct + 1 month = 30 Nov)
export function addMonths(date: Date | number, delta: number) {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + delta);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

export function getMonth(timestamp: number) {
  const date = new Date(timestamp);
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return {
    startTime: +monthStart,
    endTime: +monthEnd,
  };
}

export function getWorkDaysInMonth({ startTime, endTime }: { startTime: number; endTime: number }) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const startDay = startDate.getDay();
  const endDay = endDate.getDay();

  if (startDay === 0) {
    startDate.setDate(startDate.getDate() + 1);
  }
  if (startDay === 6) {
    startDate.setDate(startDate.getDate() + 2);
  }

  if (endDay === 0) {
    endDate.setDate(endDate.getDate() - 2);
  }
  if (endDay === 6) {
    endDate.setDate(endDate.getDate() - 1);
  }

  const totalDays = endDate.getDate() - (startDate.getDate() - 1);
  const holidays = Math.floor((totalDays + startDate.getDay()) / 7) * 2;
  return totalDays - holidays;
}

export function getWeekNumber(timestamp: number | Date) {
  const date = new Date(timestamp);
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / oneDay + 1) / 7);
}

export function zeroPad(num: number) {
  return num < 10 ? `0${num}` : num;
}

export function getTimePartsFromElapsedTime(timestamp: number) {
  const hours = Math.floor(timestamp / 1000 / 3600);
  const minutes = Math.floor(timestamp / 1000 / 60) % 60;
  const seconds = Math.floor(timestamp / 1000) % 60;

  return { hours, minutes, seconds };
}

export function startOfDay(date?: Date | number) {
  const newDate = new Date(date || Date.now());
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function endOfDay(date?: Date | number) {
  const newDate = new Date(date || Date.now());
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export function isSameWeek(date1: Date, date2: Date) {
  if (!(date1 instanceof Date && date2 instanceof Date)) throw Error('Must supply valid dates');

  const timestampDiff = Math.abs(date1.getTime() - date2.getTime());

  if (timestampDiff < oneWeek) {
    const dates = [new Date(date1), new Date(date2)]
      .map((d) => ({ day: d.getDay(), date: d.getDate(), timestamp: d.getTime() }))
      .sort((a, b) => a.timestamp - b.timestamp);

    if (!dates[0].day && dates[1].day) {
      return false;
    }
    if (dates[0].day && !dates[1].day) {
      return true;
    }
    if (dates[0].day === dates[1].day) {
      return dates[0].date === dates[1].date;
    }

    return dates[0].day <= dates[1].day;
  }
  return false;
}

export function isCurrentWeek(date: Date) {
  return isSameWeek(date, new Date());
}
