import type { CompleteInterval, Interval } from '#/types.ts';

const getTimeInterval = ({ startTime, endTime }: CompleteInterval) => endTime - startTime;

export const isComplete = (interval: Interval): interval is CompleteInterval =>
  Boolean(interval.endTime);

export const isActive = (interval: Interval) => !isComplete(interval);

const sum = (res: number, curr: number) => res + curr;

export const getIntervalSum = (intervals: Interval[]) =>
  intervals.filter(isComplete).map(getTimeInterval).reduce(sum, 0);
