import React from 'react';
import PropTypes from 'prop-types';

import * as customPropTypes from '../../constants/propTypes';
import ProgressBar from './progressBar.jsx';
import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
import getDisplayName from '../hoc/getDisplayName';
import { getHours } from '../../utils/time';

const ProgressBarTimeWrapper = ({ intervals, max }) => {
  // re-rendered every 30 seconds by RenderEvery; replaced by a hook in #76
  // oxlint-disable-next-line react/purity
  const now = Date.now();
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

export default RenderEvery(thirtySeconds)(ProgressBarTimeWrapper);
