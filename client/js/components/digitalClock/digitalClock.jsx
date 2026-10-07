import React from 'react';
import PropTypes from 'prop-types';

import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
import { getTimePartsFromElapsedTime, getTimeString } from '../../utils/time';
import notify from '../../utils/notification';

import styles from './digitalClock.module.css';

const DigitalClock = ({ from, elapsed, notificationsEnabled }) => {
  const time = from ? Date.now() - from + elapsed : elapsed;
  const { hours, minutes } = getTimePartsFromElapsedTime(time);
  const timestring = getTimeString(time, { isDuration: true });
  const isFullHour = Boolean(from && hours && minutes === 0);

  // The clock re-renders every 30s, so key on the hour to notify once per full hour
  React.useEffect(() => {
    if (isFullHour && notificationsEnabled) {
      notify(`Nu har du jobbat i ${hours} timmar.`);
    }
  }, [isFullHour, hours, notificationsEnabled]);

  return (
    <div className={styles.container}>
      <time className={styles.time}>{timestring}</time>
    </div>
  );
};

DigitalClock.propTypes = {
  elapsed: PropTypes.number.isRequired,
  from: PropTypes.number.isRequired,
  notificationsEnabled: PropTypes.bool,
};

DigitalClock.defaultProps = {
  notificationsEnabled: false,
};

export default RenderEvery(thirtySeconds)(DigitalClock);
