import type { CompleteInterval } from '#/types.ts';
import type { NewInterval } from '#/utils/interValidator.ts';

const getTimeInterval = ({ startTime, endTime }: CompleteInterval) => endTime - startTime;

export const isComplete = (interval: NewInterval): interval is CompleteInterval =>
  Boolean(interval.endTime);

export const isActive = (interval: NewInterval) => !isComplete(interval);

const sum = (res: number, curr: number) => res + curr;

export const getIntervalSum = (intervals: NewInterval[]) =>
  intervals.filter(isComplete).map(getTimeInterval).reduce(sum, 0);
