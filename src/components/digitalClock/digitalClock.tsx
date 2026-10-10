import React, { useEffect } from 'react';

import useNow from '#/hooks/useNow.ts';
import { getTimePartsFromElapsedTime, getDurationString } from '#/utils/time.ts';
import notify from '#/utils/notification.ts';

import styles from './digitalClock.module.css';

interface DigitalClockProps {
  from: number;
  elapsed: number;
}

const DigitalClock = ({ from, elapsed }: DigitalClockProps) => {
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

export default DigitalClock;
