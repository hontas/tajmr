const getTimeInterval = ({ startTime, endTime }) => endTime - startTime;

export const isComplete = ({ endTime }) => endTime;

export const isActive = (interval) => !isComplete(interval);

const sum = (res, curr) => res + curr;

export const getIntervalSum = (intervals) => intervals
  .filter(isComplete)
  .map(getTimeInterval)
  .reduce(sum, 0);
