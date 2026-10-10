import { isComplete, isActive, getIntervalSum } from './intervals.ts';

describe('intervals utils', () => {
  test('isComplete is truthy only when endTime is set', () => {
    expect(isComplete({ startTime: 1, endTime: 5 })).toBeTruthy();
    expect(isComplete({ startTime: 1 })).toBeFalsy();
    expect(isComplete({ startTime: 1, endTime: 0 })).toBeFalsy();
  });

  test('isActive is the inverse of isComplete', () => {
    expect(isActive({ startTime: 1 })).toBe(true);
    expect(isActive({ startTime: 1, endTime: 5 })).toBe(false);
  });

  describe('getIntervalSum', () => {
    test('is 0 for no intervals', () => {
      expect(getIntervalSum([])).toBe(0);
    });

    test('sums durations of completed intervals only', () => {
      const intervals = [
        { startTime: 100, endTime: 200 },
        { startTime: 300, endTime: 450 },
        { startTime: 500 },
      ];
      expect(getIntervalSum(intervals)).toBe(250);
    });
  });
});
