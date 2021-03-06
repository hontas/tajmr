import React from 'react';
import PropTypes from 'prop-types';

import * as customPropTypes from '../../constants/propTypes';
import ProgressBar from '../ui-elements/progressBar.jsx';
import { oneHour, getMonth, getWorkDaysInMonth } from '../../utils/time';
import { getIntervalSum } from '../../utils/intervals';

import styles from './monthStats.module.css';

const MonthStats = ({ hoursPerWeek, monthIntervals, timestamp }) => {
  const month = getMonth(timestamp);
  const workedHoursInMonth = getIntervalSum(monthIntervals) / oneHour;
  const totalWorkHoursInMonth = (hoursPerWeek / 5) * getWorkDaysInMonth(month);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Månad</h3>
      <ProgressBar progress={workedHoursInMonth} max={totalWorkHoursInMonth} />
    </div>
  );
};

MonthStats.defaultProps = {
  hoursPerWeek: 40,
};

MonthStats.propTypes = {
  monthIntervals: customPropTypes.intervals.isRequired,
  hoursPerWeek: PropTypes.number,
  timestamp: PropTypes.number.isRequired,
};

export default MonthStats;
