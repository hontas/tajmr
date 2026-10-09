import fakeTimers from '@sinonjs/fake-timers';

import {
  isSameWeek,
  getWeekday,
  getWeekNumber,
  getDayRange,
  getWeek,
  getMonth,
  createWorkWeek,
  isCurrentWeek,
  getWorkDaysInMonth,
  startOfDay,
  endOfDay,
  getDurationString,
  getDateTimeString,
  getTimeString,
  addMonths,
} from './time';

describe('time', () => {
  describe('#isCurrentWeek', () => {
    let date;

    beforeEach(() => {
      date = new Date('2016-04-04T07:00:00');
    });

    test('should throw when not called with Date instances', () => {
      const invoke = (withDate) => isSameWeek(withDate);
      expect(invoke).toThrowError('Must supply valid dates');
      expect(invoke.bind(null, new Date())).toThrowError('Must supply valid dates');
    });

    test('should return false for dates from other weeks', () => {
      expect(isSameWeek(date, new Date('2016-04-03T07:00:00'))).toBe(false);
      expect(isSameWeek(date, new Date('2016-03-04T07:00:00'))).toBe(false);
      expect(isSameWeek(date, new Date('2016-04-114T07:00:00'))).toBe(false);
    });

    test('should return true for all days in current week', () => {
      expect(isSameWeek(date, new Date('2016-04-04T07:00:00'))).toBe(true);
      expect(isSameWeek(date, new Date('2016-04-05T07:00:00'))).toBe(true);
      expect(isSameWeek(date, new Date('2016-04-06T07:00:00'))).toBe(true);
      expect(isSameWeek(date, new Date('2016-04-07T07:00:00'))).toBe(true);
      expect(isSameWeek(date, new Date('2016-04-08T07:00:00'))).toBe(true);
      expect(isSameWeek(date, new Date('2016-04-09T07:00:00'))).toBe(true);
      expect(isSameWeek(date, new Date('2016-04-10T07:00:00'))).toBe(true);
    });

    test('should handle weeks over months', () => {
      expect(isSameWeek(new Date('2016-04-03T07:00:00'), new Date('2016-03-28T07:00:00'))).toBe(
        true,
      );
    });
  });

  describe('#getWeekDay', () => {
    test('should return localised weekday', () => {
      expect(getWeekday(new Date('2016-04-04T07:00:00'))).toBe('mån');
    });
  });

  describe('#getWeekNumber', () => {
    test('should return a number', () => {
      expect(typeof getWeekNumber(new Date())).toBe('number');
    });

    test('should return current week number', () => {
      const date1 = new Date(2017, 8, 17);
      const date2 = new Date(2017, 8, 18);
      expect(getWeekNumber(date1)).toBe(37);
      expect(getWeekNumber(date2)).toBe(38);
    });
  });

  describe('#isCurrentWeek', () => {
    let clock;

    beforeAll(() => {
      clock = fakeTimers.install({ now: new Date(2017, 8, 15) });
    });

    afterAll(() => {
      clock.uninstall();
    });

    test('should return true for same week', () => {
      const monday = new Date(new Date(2017, 8, 11));
      const tuesday = new Date(new Date(2017, 8, 12));
      const wednesday = new Date(new Date(2017, 8, 13));
      const thursday = new Date(new Date(2017, 8, 14));
      const friday = new Date(new Date(2017, 8, 15));
      const saturday = new Date(new Date(2017, 8, 16));
      const sunday = new Date(new Date(2017, 8, 17));

      expect(isCurrentWeek(monday)).toBe(true);
      expect(isCurrentWeek(tuesday)).toBe(true);
      expect(isCurrentWeek(wednesday)).toBe(true);
      expect(isCurrentWeek(thursday)).toBe(true);
      expect(isCurrentWeek(friday)).toBe(true);
      expect(isCurrentWeek(saturday)).toBe(true);
      expect(isCurrentWeek(sunday)).toBe(true);
    });

    test('should return false for other week', () => {
      const monday = new Date(new Date(2017, 8, 18));
      const sunday = new Date(new Date(2017, 8, 10));

      expect(isCurrentWeek(monday)).toBe(false);
      expect(isCurrentWeek(sunday)).toBe(false);
    });

    test('should work for edge cases', () => {
      clock.setSystemTime(1505710969272); // monday 11 september
      const date1 = new Date(1505113211392); // monday 18 september
      expect(isCurrentWeek(date1)).toBe(false);
    });
  });

  describe('#startOfDay', () => {
    it('should return a date', () => {
      expect(startOfDay()).toBeInstanceOf(Date);
    });

    it('should have hours, minutes, seconds and milliseconds set to 0', () => {
      const date = startOfDay(new Date(2018, 2, 14, 13, 45, 30, 500));
      expect(date.getFullYear()).toBe(2018);
      expect(date.getMonth()).toBe(2); // 0-based
      expect(date.getDate()).toBe(14);
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
      expect(date.getMilliseconds()).toBe(0);
    });
  });

  describe('#endOfDay', () => {
    it('should return a date', () => {
      expect(endOfDay()).toBeInstanceOf(Date);
    });

    it('should be the last millisecond of the day', () => {
      const date = endOfDay(new Date(2018, 2, 14, 13, 45, 30, 500));
      expect(date.getFullYear()).toBe(2018);
      expect(date.getMonth()).toBe(2); // 0-based
      expect(date.getDate()).toBe(14);
      expect(date.getHours()).toBe(23);
      expect(date.getMinutes()).toBe(59);
      expect(date.getSeconds()).toBe(59);
      expect(date.getMilliseconds()).toBe(999);
    });
  });

  describe('#getDayRange', () => {
    const startDate = new Date(2018, 2, 18, 12);

    test('should return an object', () => {
      expect(typeof getDayRange()).toBe('object');
    });

    test('should return two timestamps', () => {
      expect(getDayRange()).toEqual({
        startTime: expect.any(Number),
        endTime: expect.any(Number),
      });
    });

    test('should return startTime and endTime for that day', () => {
      expect(getDayRange(+startDate)).toEqual({
        startTime: +new Date(2018, 2, 18, 0, 0, 0, 0),
        endTime: +new Date(2018, 2, 18, 23, 59, 59, 999),
      });
    });
  });

  describe('#getWeek', () => {
    const startDate = new Date('Sep 25, 2017'); // monday morning
    const endDate = new Date('Oct 2, 2017 00:00'); // next monday morning
    const middleOfWeek = new Date('Sep 27, 2017 14:53'); // wednesday afternoon
    const endOfWeek = new Date('Oct 1, 2017 11:30'); // sunday morning

    test('should return an object', () => {
      expect(typeof getWeek(0)).toBe('object');
    });

    test('should return two timestamps', () => {
      expect(getWeek(0)).toEqual({
        startTime: expect.any(Number),
        endTime: expect.any(Number),
      });
    });

    test('should return startTime and endTime for that week', () => {
      expect(getWeek(+startDate)).toEqual({
        startTime: +startDate,
        endTime: +endDate,
      });
    });

    test('should calculate week from timestamp within week', () => {
      expect(getWeek(+middleOfWeek)).toEqual({
        startTime: +startDate,
        endTime: +endDate,
      });
    });

    test('should calculate week from timestamp within weekend', () => {
      expect(getWeek(+endOfWeek)).toEqual({
        startTime: +startDate,
        endTime: +endDate,
      });
    });
  });

  describe('#getMonth', () => {
    const startDate = new Date('Sep 1, 2017');
    const endDate = new Date(2017, 8, 30, 23, 59, 59, 999);
    const middleOfMonth = new Date('Sep 27, 2017 14:53');
    const endOfMonth = new Date('Sep 30, 2017 11:30');

    test('should return an object', () => {
      expect(typeof getMonth(0)).toBe('object');
    });

    test('should return two timestamps', () => {
      expect(getMonth(0)).toEqual({
        startTime: expect.any(Number),
        endTime: expect.any(Number),
      });
    });

    test('should return startTime and endTime for that month', () => {
      expect(getMonth(+startDate)).toEqual({
        startTime: +startDate,
        endTime: +endDate,
      });
    });

    test('should calculate month from timestamp within', () => {
      expect(getMonth(+middleOfMonth)).toEqual({
        startTime: +startDate,
        endTime: +endDate,
      });
    });

    test('should calculate month from timestamp within', () => {
      expect(getMonth(+endOfMonth)).toEqual({
        startTime: +startDate,
        endTime: +endDate,
      });
    });
  });

  describe('#getWorkDaysInMonth', () => {
    test('should calculate all working days in a month', () => {
      const september = getMonth(+new Date('Sep 5, 2017'));
      const october = getMonth(+new Date('Oct 1, 2017'));
      const november = getMonth(+new Date('Nov 1, 2017'));
      const december = getMonth(+new Date('Dec 1, 2017'));

      expect(getWorkDaysInMonth(september)).toBe(21);
      expect(getWorkDaysInMonth(october)).toBe(22);
      expect(getWorkDaysInMonth(november)).toBe(22);
      expect(getWorkDaysInMonth(december)).toBe(21);
    });
  });

  describe('#createWorkWeek', () => {
    test('should create an array representing a week', () => {
      const v44 = +new Date('Nov 2, 2017');
      const workWeek = createWorkWeek(v44);
      expect(Array.isArray(workWeek)).toBe(true);
      expect(workWeek).toHaveLength(7);
      expect(workWeek).toEqual([
        { isWeekEnd: false, date: '30/10', weekday: 'måndag' },
        { isWeekEnd: false, date: '31/10', weekday: 'tisdag' },
        { isWeekEnd: false, date: '1/11', weekday: 'onsdag' },
        { isWeekEnd: false, date: '2/11', weekday: 'torsdag' },
        { isWeekEnd: false, date: '3/11', weekday: 'fredag' },
        { isWeekEnd: true, date: '4/11', weekday: 'lördag' },
        { isWeekEnd: true, date: '5/11', weekday: 'söndag' },
      ]);
    });
  });

  describe('durations', () => {
    const minute = 60 * 1000;
    const hour = 60 * minute;

    test('are formatted as HH:mm from the elapsed time, whatever the timezone', () => {
      expect(getDurationString(0)).toBe('00:00');
      expect(getDurationString(90 * minute)).toBe('01:30');
      expect(getDurationString(3 * hour)).toBe('03:00');
      expect(getDurationString(8 * hour + 5 * minute)).toBe('08:05');
    });

    test('ignore seconds', () => {
      expect(getDurationString(59 * 1000)).toBe('00:00');
      expect(getDurationString(minute + 59 * 1000)).toBe('00:01');
    });

    test('can be longer than a day', () => {
      expect(getDurationString(25 * hour)).toBe('25:00');
      expect(getDurationString(100 * hour + 7 * minute)).toBe('100:07');
    });

    test('are never negative (clock skew)', () => {
      expect(getDurationString(-5 * minute)).toBe('00:00');
    });
  });

  describe('#getTimeString', () => {
    test('is the local clock time as HH:mm', () => {
      expect(getTimeString(new Date(2021, 3, 7, 9, 5).getTime())).toBe('09:05');
      expect(getTimeString(new Date(2021, 3, 7, 23, 59).getTime())).toBe('23:59');
    });
  });

  describe('#getDateTimeString', () => {
    test('formats an instant in the local timezone, not the one it was created in', () => {
      const instant = new Date('2026-10-08T13:29:00.000Z');
      const hh = String(instant.getHours()).padStart(2, '0');
      const mm = String(instant.getMinutes()).padStart(2, '0');

      expect(getDateTimeString(instant.toISOString())).toBe(
        `${instant.getDate()} okt. 2026 ${hh}:${mm}`,
      );
    });

    test('is empty for a missing or invalid value', () => {
      expect(getDateTimeString(undefined)).toBe('');
      expect(getDateTimeString('not a date')).toBe('');
    });
  });

  // loop over a whole year so the DST rules of any timezone are exercised
  describe('day, week and month boundaries', () => {
    const local = (y, m, d, h = 0, min = 0, s = 0, ms = 0) => new Date(y, m, d, h, min, s, ms);
    const mondays2026 = Array.from({ length: 53 }, (_, i) => local(2025, 11, 29 + i * 7));

    test('startOfDay / endOfDay are the first and last millisecond of every day', () => {
      for (let i = 0; i < 365; i += 1) {
        const noon = local(2026, 0, 1 + i, 12, 34, 56, 789);
        expect(+startOfDay(noon)).toBe(+local(2026, 0, 1 + i));
        expect(+endOfDay(noon)).toBe(+local(2026, 0, 1 + i, 23, 59, 59, 999));
      }
    });

    test('a week runs from local Monday 00:00 to the next local Monday 00:00', () => {
      mondays2026.forEach((monday, i) => {
        const nextMonday = mondays2026[i + 1] || local(2027, 0, 4);
        [
          monday,
          local(2025, 11, 29 + i * 7, 15, 20, 10, 5),
          local(2025, 11, 29 + i * 7 + 6, 23, 59, 59, 999),
        ].forEach((timestamp) => {
          expect(getWeek(+timestamp)).toEqual({
            startTime: +monday,
            endTime: +nextMonday,
          });
        });
      });
    });

    test('a month runs from local midnight on the 1st to the last millisecond of its last day', () => {
      for (let month = 0; month < 12; month += 1) {
        const lastDay = local(2026, month + 1, 0).getDate();
        const expected = {
          startTime: +local(2026, month, 1),
          endTime: +local(2026, month, lastDay, 23, 59, 59, 999),
        };
        // every day of the month, including the 29th-31st (the next month can be shorter)
        for (let day = 1; day <= lastDay; day += 1) {
          expect(getMonth(+local(2026, month, day, 13, 30))).toEqual(expected);
        }
      }
    });

    test('a work week lists the right dates, also in weeks with a DST change', () => {
      mondays2026.forEach((monday) => {
        const dates = createWorkWeek(
          +local(monday.getFullYear(), monday.getMonth(), monday.getDate() + 2, 12),
        ).map((day) => day.date);
        const expected = Array.from({ length: 7 }, (_, delta) => {
          const day = local(monday.getFullYear(), monday.getMonth(), monday.getDate() + delta);
          return `${day.getDate()}/${day.getMonth() + 1}`;
        });
        expect(dates).toEqual(expected);
      });
    });
  });

  describe('#addMonths', () => {
    test('moves by whole months and keeps the day and time', () => {
      const result = addMonths(new Date(2026, 9, 8, 13, 45), 1);
      expect(+result).toBe(+new Date(2026, 10, 8, 13, 45));
      expect(+addMonths(new Date(2026, 9, 8, 13, 45), -1)).toBe(+new Date(2026, 8, 8, 13, 45));
    });

    test('crosses year boundaries', () => {
      expect(+addMonths(new Date(2026, 11, 15), 1)).toBe(+new Date(2027, 0, 15));
      expect(+addMonths(new Date(2026, 0, 15), -1)).toBe(+new Date(2025, 11, 15));
    });

    test('lands in the right month when the day does not exist there (clamps to its last day)', () => {
      expect(+addMonths(new Date(2026, 9, 31), 1)).toBe(+new Date(2026, 10, 30)); // Oct 31 -> Nov 30
      expect(+addMonths(new Date(2026, 2, 31), -1)).toBe(+new Date(2026, 1, 28)); // Mar 31 -> Feb 28
      expect(+addMonths(new Date(2028, 0, 30), 1)).toBe(+new Date(2028, 1, 29)); // leap year
    });

    test('moves exactly one month from any day of the year', () => {
      for (let i = 0; i < 365; i += 1) {
        const date = new Date(2026, 0, 1 + i, 12);
        [1, -1].forEach((step) => {
          const result = addMonths(date, step);
          const expectedMonth = (date.getMonth() + step + 12) % 12;
          expect(result.getMonth()).toBe(expectedMonth);
        });
      }
    });
  });
});
