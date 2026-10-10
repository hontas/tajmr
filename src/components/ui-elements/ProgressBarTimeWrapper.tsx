import React from 'react';

import ProgressBar from './progressBar.tsx';
import useNow from '#/hooks/useNow.ts';
import getDisplayName from '#/components/hoc/getDisplayName.ts';
import type { NewInterval } from '#/utils/interValidator.ts';
import { getHours } from '#/utils/time.ts';

interface ProgressBarTimeWrapperProps {
  intervals: Pick<NewInterval, 'startTime' | 'endTime'>[];
  max: number;
}

const ProgressBarTimeWrapper = ({ intervals, max }: ProgressBarTimeWrapperProps) => {
  const now = useNow();
  const intervalSum = intervals
    .map(({ startTime, endTime }) => (endTime || now) - startTime)
    .reduce((res, curr) => res + curr, 0);

  return <ProgressBar progress={getHours(intervalSum)} max={max} />;
};

ProgressBarTimeWrapper.displayName = getDisplayName(ProgressBar);

export default ProgressBarTimeWrapper;
