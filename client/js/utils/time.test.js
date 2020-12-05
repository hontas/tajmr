import lolex from 'lolex';

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
  endOfDay
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
      expect(isSameWeek(new Date('2016-04-03T07:00:00'), new Date('2016-03-28T07:00:00'))).toBe(true);
    });
  });

  describe('#getWeekDay', () => {
    test('should return localised weekday', () => { // as not supported by node? :(
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
      clock = lolex.install({ now: new Date(2017, 8, 15) });
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

    it('should have hours, minutes, seconds set to 0', () => {
      const date = startOfDay('2018-03-14');
      expect(date.getFullYear()).toBe(2018);
      expect(date.getMonth()).toBe(2); // 0-based
      expect(date.getDate()).toBe(14);
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
    });
  });

  describe('#endOfDay', () => {
    it('should return a date', () => {
      expect(endOfDay()).toBeInstanceOf(Date);
    });

    it('should have hours, minutes, seconds set to 0', () => {
      const date = endOfDay('2018-03-14');
      expect(date.getFullYear()).toBe(2018);
      expect(date.getMonth()).toBe(2); // 0-based
      expect(date.getDate()).toBe(14);
      expect(date.getHours()).toBe(23);
      expect(date.getMinutes()).toBe(59);
      expect(date.getSeconds()).toBe(59);
    });
  });

  describe('#getDayRange', () => {
    const dateString = '2018-03-18';
    const startDate = new Date(dateString);

    test('should return an object', () => {
      expect(typeof getDayRange()).toBe('object');
    });

    test('should return two timestamps', () => {
      expect(getDayRange()).toEqual({
        startTime: expect.any(Number),
        endTime: expect.any(Number)
      });
    });

    test('should return startTime and endTime for that day', () => {
      expect(getDayRange(+startDate)).toEqual({
        startTime: +startOfDay(dateString),
        endTime: +endOfDay(dateString)
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
        endTime: expect.any(Number)
      });
    });

    test('should return startTime and endTime for that week', () => {
      expect(getWeek(+startDate)).toEqual({
        startTime: +startDate,
        endTime: +endDate
      });
    });

    test('should calculate week from timestamp within week', () => {
      expect(getWeek(+middleOfWeek)).toEqual({
        startTime: +startDate,
        endTime: +endDate
      });
    });

    test('should calculate week from timestamp within weekend', () => {
      expect(getWeek(+endOfWeek)).toEqual({
        startTime: +startDate,
        endTime: +endDate
      });
    });
  });

  describe('#getMonth', () => {
    const startDate = new Date('Sep 1, 2017');
    const endDate = new Date('Sep 30, 2017 23:59');
    const middleOfMonth = new Date('Sep 27, 2017 14:53');
    const endOfMonth = new Date('Sep 30, 2017 11:30');

    test('should return an object', () => {
      expect(typeof getMonth(0)).toBe('object');
    });

    test('should return two timestamps', () => {
      expect(getMonth(0)).toEqual({
        startTime: expect.any(Number),
        endTime: expect.any(Number)
      });
    });

    test('should return startTime and endTime for that month', () => {
      expect(getMonth(+startDate)).toEqual({
        startTime: +startDate,
        endTime: +endDate
      });
    });

    test('should calculate month from timestamp within', () => {
      expect(getMonth(+middleOfMonth)).toEqual({
        startTime: +startDate,
        endTime: +endDate
      });
    });

    test('should calculate month from timestamp within', () => {
      expect(getMonth(+endOfMonth)).toEqual({
        startTime: +startDate,
        endTime: +endDate
      });
    });
  });

  describe('#getWorkDaysInMonth', () => {
    test('should calculate all working days in a month', () => {
      const september = getMonth(+(new Date('Sep 5, 2017')));
      const october = getMonth(+(new Date('Oct 1, 2017')));
      const november = getMonth(+(new Date('Nov 1, 2017')));
      const december = getMonth(+(new Date('Dec 1, 2017')));

      expect(getWorkDaysInMonth(september)).toBe(21);
      expect(getWorkDaysInMonth(october)).toBe(22);
      expect(getWorkDaysInMonth(november)).toBe(22);
      expect(getWorkDaysInMonth(december)).toBe(21);
    });
  });

  describe('#createWorkWeek', () => {
    test('should create an array representing a week', () => {
      const v44 = +(new Date('Nov 2, 2017'));
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
        { isWeekEnd: true, date: '5/11', weekday: 'söndag' }
      ]);
    });
  });
});
