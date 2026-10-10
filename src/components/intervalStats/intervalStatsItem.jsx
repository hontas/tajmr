import React from 'react';
import PropTypes from 'prop-types';

import styles from './intervalStatsItem.module.css';

const IntervalStatsItem = ({ day, time }) => (
  <div className={styles.container}>
    <h4>{day}</h4>
    <p>{time}</p>
  </div>
);

IntervalStatsItem.propTypes = {
  day: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default IntervalStatsItem;
