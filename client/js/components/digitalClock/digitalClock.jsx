import React from 'react';
import PropTypes from 'prop-types';

import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
import { getTimePartsFromElapsedTime, getDurationString } from '../../utils/time';
import notify from '../../utils/notification';

import styles from './digitalClock.module.css';

const DigitalClock = ({ from, elapsed }) => {
  // re-rendered every 30 seconds by RenderEvery; replaced by a hook in #76
  // oxlint-disable-next-line react/purity
  const time = from ? Date.now() - from + elapsed : elapsed;
  const { hours, minutes } = getTimePartsFromElapsedTime(time);
  const timestring = getDurationString(time);

  if (from && hours && minutes === 0) {
    notify(`Nu har du jobbat i ${hours} timmar.`);
  }

  return (
    <div className={styles.container}>
      <time className={styles.time}>{timestring}</time>
    </div>
  );
};

DigitalClock.propTypes = {
  elapsed: PropTypes.number.isRequired,
  from: PropTypes.number.isRequired,
};

export default RenderEvery(thirtySeconds)(DigitalClock);
