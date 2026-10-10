import React from 'react';
import PropTypes from 'prop-types';

import * as customPropTypes from '#/constants/propTypes.js';
import ProgressBar from './progressBar.jsx';
import useNow from '#/hooks/useNow.js';
import getDisplayName from '#/components/hoc/getDisplayName.js';
import { getHours } from '#/utils/time.js';

const ProgressBarTimeWrapper = ({ intervals, max }) => {
  const now = useNow();
  const intervalSum = intervals
    .map(({ startTime, endTime }) => (endTime || now) - startTime)
    .reduce((res, curr) => res + curr, 0);

  return <ProgressBar progress={getHours(intervalSum)} max={max} />;
};

ProgressBarTimeWrapper.propTypes = {
  intervals: customPropTypes.intervals.isRequired,
  max: PropTypes.number.isRequired,
};

ProgressBarTimeWrapper.displayName = getDisplayName(ProgressBar);

export default ProgressBarTimeWrapper;
