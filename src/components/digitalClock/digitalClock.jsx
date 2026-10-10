import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import useNow from '#/hooks/useNow.js';
import { getTimePartsFromElapsedTime, getDurationString } from '#/utils/time.js';
import notify from '#/utils/notification.js';

import styles from './digitalClock.module.css';

const DigitalClock = ({ from, elapsed }) => {
  const now = useNow();
  const time = from ? now - from + elapsed : elapsed;
  const { hours, minutes } = getTimePartsFromElapsedTime(time);
  const timestring = getDurationString(time);

  const shouldNotify = Boolean(from && hours && minutes === 0);

  useEffect(() => {
    if (shouldNotify) notify(`Nu har du jobbat i ${hours} timmar.`);
  }, [shouldNotify, hours]);

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

export default DigitalClock;
