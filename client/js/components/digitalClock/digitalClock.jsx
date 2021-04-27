import React from 'react';
import PropTypes from 'prop-types';

import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
import { getTimePartsFromElapsedTime, getTimeString } from '../../utils/time';
import notify from '../../utils/notification';

import styles from './digitalClock.module.css';

const DigitalClock = ({ from, elapsed }) => {
  const time = from ? Date.now() - from + elapsed : elapsed;
  const { hours, minutes } = getTimePartsFromElapsedTime(time);
  const timestring = getTimeString(time, { isDuration: true });

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
