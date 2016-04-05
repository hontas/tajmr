import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
chai.use(dirtyChai);

import { isSameWeek } from '../../../client/js/utils/time';

describe('time', () => {
  describe('#isCurrentWeek', () => {
    let date;

    beforeEach(() => {
      date = new Date('2016-04-04T07:00:00');
    });

    it('should throw when not called with Date instances', () => {
      const invoke = (date) => {
        return isSameWeek(date);
      };
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
});
