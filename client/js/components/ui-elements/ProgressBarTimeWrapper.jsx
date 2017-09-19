import React from 'react';
import PropTypes from 'prop-types';

import ProgressBar from './progressBar.jsx';
import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
import { getDisplayname } from '../hoc/utils.js';
import { getHours } from '../../utils/time';

const ProgressBarTimeWrapper = ({ intervals, max }) => {
  const now = Date.now();
  const intervalSum = intervals
    .map(({ startTime, endTime }) => (endTime || now) - startTime)
    .reduce((res, curr) => res + curr, 0);

  ProgressBarTimeWrapper.propTypes = {
    intervals: PropTypes.array.isRequired,
    max: PropTypes.number.isRequired
  };

  ProgressBarTimeWrapper.displayName = getDisplayname(ProgressBar);

  return <ProgressBar progress={getHours(intervalSum)} max={max} />;
};

export default RenderEvery(thirtySeconds)(ProgressBarTimeWrapper);
