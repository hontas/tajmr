import React from 'react';
import PropTypes from 'prop-types';

import * as customPropTypes from '../../constants/propTypes';
import ProgressBar from './progressBar.jsx';
import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
import getDisplayName from '../hoc/getDisplayName';
import { getHours } from '../../utils/time';

const ProgressBarTimeWrapper = ({ intervals, max }) => {
  const now = Date.now();
  const intervalSum = intervals
    .map(({ startTime, endTime }) => (endTime || now) - startTime)
    .reduce((res, curr) => res + curr, 0);

  ProgressBarTimeWrapper.propTypes = {
    intervals: customPropTypes.intervals.isRequired,
    max: PropTypes.number.isRequired
  };

  ProgressBarTimeWrapper.displayName = getDisplayName(ProgressBar);

  return <ProgressBar progress={getHours(intervalSum)} max={max} />;
};

export default RenderEvery(thirtySeconds)(ProgressBarTimeWrapper);
