import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import lolex from 'lolex';

import {
  isSameWeek,
  getWeekday,
  getWeekNumber,
  getWeek,
  getMonth,
  createWorkWeek,
  isCurrentWeek,
  getWorkDaysinMonth
} from '../../../client/js/utils/time';

chai.use(dirtyChai);

describe('time', () => {
  describe('#isCurrentWeek', () => {
    let date;

    beforeEach(() => {
      date = new Date('2016-04-04T07:00:00');
    });

    it('should throw when not called with Date instances', () => {
      const invoke = (withDate) => isSameWeek(withDate);
      expect(invoke).to.throw('Must supply valid dates');
      expect(invoke.bind(null, new Date())).to.throw('Must supply valid dates');
    });

    it('should return false for dates from other weeks', () => {
      expect(isSameWeek(date, new Date('2016-04-03T07:00:00')), 'sunday before').to.be.false();
      expect(isSameWeek(date, new Date('2016-03-04T07:00:00')), 'other month').to.be.false();
      expect(isSameWeek(date, new Date('2016-04-114T07:00:00')), 'monday after').to.be.false();
    });

    it('should return true for all days in current week', () => {
      expect(isSameWeek(date, new Date('2016-04-04T07:00:00')), 'monday').to.be.true();
      expect(isSameWeek(date, new Date('2016-04-05T07:00:00')), 'tueday').to.be.true();
      expect(isSameWeek(date, new Date('2016-04-06T07:00:00')), 'wednesday').to.be.true();
      expect(isSameWeek(date, new Date('2016-04-07T07:00:00')), 'thursday').to.be.true();
      expect(isSameWeek(date, new Date('2016-04-08T07:00:00')), 'friday').to.be.true();
      expect(isSameWeek(date, new Date('2016-04-09T07:00:00')), 'saturday').to.be.true();
      expect(isSameWeek(date, new Date('2016-04-10T07:00:00')), 'sunday').to.be.true();
    });

    it('should handle weeks over months', () => {
      expect(isSameWeek(new Date('2016-04-03T07:00:00'), new Date('2016-03-28T07:00:00'))).to.be.true();
    });
  });

  describe('#getWeekDay', () => {
    it('should return localised weekday', () => { // as not supported by node? :(
      expect(getWeekday(new Date('2016-04-04T07:00:00'))).to.equal('Mon');
    });
  });

  describe('#getWeekNumber', () => {
    it('should return a number', () => {
      expect(getWeekNumber(new Date())).to.be.a('number');
    });

    it('should return current week number', () => {
      const date1 = new Date(2017, 8, 17);
      const date2 = new Date(2017, 8, 18);
      expect(getWeekNumber(date1)).to.equal(37);
      expect(getWeekNumber(date2)).to.equal(38);
    });
  });

  describe('#isCurrentWeek', () => {
    let clock;

    before(() => {
      clock = lolex.install({ now: new Date(2017, 8, 15) });
    });

    after(() => {
      clock.uninstall();
    });

    it('should return true for same week', () => {
      const monday = new Date(new Date(2017, 8, 11));
      const tuesday = new Date(new Date(2017, 8, 12));
      const wednesday = new Date(new Date(2017, 8, 13));
      const thursday = new Date(new Date(2017, 8, 14));
      const friday = new Date(new Date(2017, 8, 15));
      const saturday = new Date(new Date(2017, 8, 16));
      const sunday = new Date(new Date(2017, 8, 17));

      expect(isCurrentWeek(monday), 'mon').to.be.true();
      expect(isCurrentWeek(tuesday), 'tis').to.be.true();
      expect(isCurrentWeek(wednesday), 'ons').to.be.true();
      expect(isCurrentWeek(thursday), 'tor').to.be.true();
      expect(isCurrentWeek(friday), 'fre').to.be.true();
      expect(isCurrentWeek(saturday), 'lör').to.be.true();
      expect(isCurrentWeek(sunday), 'sön').to.be.true();
    });

    it('should return false for other week', () => {
      const monday = new Date(new Date(2017, 8, 18));
      const sunday = new Date(new Date(2017, 8, 10));

      expect(isCurrentWeek(monday), 'mon').to.be.false();
      expect(isCurrentWeek(sunday), 'sön').to.be.false();
    });

    it('should work for edge cases', () => {
      clock.setSystemTime(1505710969272); // monday 11 september
      const date1 = new Date(1505113211392); // monday 18 september
      expect(isCurrentWeek(date1), 'mon').to.be.false();
    });
  });

  describe('#getWeek', () => {
    const startDate = new Date('Sep 25, 2017'); // monday morning
    const endDate = new Date('Sep 30, 2017'); // saturday morning
    const middleOfWeek = new Date('Sep 27, 2017 14:53'); // wednesday afternoon
    const endOfWeek = new Date('Oct 1, 2017 11:30'); // sunday morning

    it('should return an object', () => {
      expect(getWeek(0)).to.be.an('object');
    });

    it('should return two timestamps', () => {
      expect(getWeek(0)).to.have.keys('startTime', 'endTime');
    });

    it('should return startTime and endTime for that week', () => {
      expect(getWeek(+startDate)).to.have.eql({
        startTime: +startDate,
        endTime: +endDate
      });
    });

    it('should calculate week from timestamp within week', () => {
      expect(getWeek(+middleOfWeek)).to.have.eql({
        startTime: +startDate,
        endTime: +endDate
      });
    });

    it('should calculate week from timestamp within weekend', () => {
      expect(getWeek(+endOfWeek)).to.have.eql({
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

    it('should return an object', () => {
      expect(getMonth(0)).to.be.an('object');
    });

    it('should return two timestamps', () => {
      expect(getMonth(0)).to.have.keys('startTime', 'endTime');
    });

    it('should return startTime and endTime for that month', () => {
      expect(getMonth(+startDate)).to.have.eql({
        startTime: +startDate,
        endTime: +endDate
      });
    });

    it('should calculate month from timestamp within', () => {
      expect(getMonth(+middleOfMonth)).to.have.eql({
        startTime: +startDate,
        endTime: +endDate
      });
    });

    it('should calculate month from timestamp within', () => {
      expect(getMonth(+endOfMonth)).to.have.eql({
        startTime: +startDate,
        endTime: +endDate
      });
    });
  });

  describe('#getWorkDaysinMonth', () => {
    it('should calculate all working days in a month', () => {
      const september = getMonth(+(new Date('Sep 5, 2017')));
      const october = getMonth(+(new Date('Oct 1, 2017')));
      const november = getMonth(+(new Date('Nov 1, 2017')));
      const december = getMonth(+(new Date('Dec 1, 2017')));

      expect(getWorkDaysinMonth(september), 'september').to.equal(21);
      expect(getWorkDaysinMonth(october), 'october').to.equal(22);
      expect(getWorkDaysinMonth(november), 'november').to.equal(22);
      expect(getWorkDaysinMonth(december), 'december').to.equal(21);
    });
  });

  describe('#createWorkWeek', () => {
    it('should create an array representing a week', () => {
      const v44 = +(new Date('Nov 2, 2017'));
      const workWeek = createWorkWeek(v44);
      expect(workWeek).to.be.an('array').with.length(5);
      expect(workWeek).to.eql([
        { date: '10-30', weekday: 'måndag' },
        { date: '10-31', weekday: 'tisdag' },
        { date: '11-01', weekday: 'onsdag' },
        { date: '11-02', weekday: 'torsdag' },
        { date: '11-03', weekday: 'fredag' }
      ]);
    });
  });
});
