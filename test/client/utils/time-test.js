import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import lolex from 'lolex';

import {
  isSameWeek,
  getWeekday,
  getWeek,
  isCurrentWeek
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

  describe('#getWeek', () => {
    it('should return a number', () => {
      expect(getWeek(new Date())).to.be.a('number');
    });

    it('should return current week number', () => {
      const date1 = new Date(2017, 8, 17);
      const date2 = new Date(2017, 8, 18);
      expect(getWeek(date1)).to.equal(37);
      expect(getWeek(date2)).to.equal(38);
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
});
