import React from 'react';
import PropTypes from 'prop-types';
import * as customPropTypes from '../../constants/propTypes';
import {
  oneHour,
  getMonth,
  getWorkDaysinMonth
} from '../../utils/time';
import { getIntervalSum } from '../../utils/intervals';

const MonthStats = ({ hoursPerWeek, monthIntervals, timestamp }) => {
  const month = getMonth(timestamp);
  const workedHoursInMonth = (getIntervalSum(monthIntervals) / oneHour).toFixed(2);
  const workDaysInMonth = (hoursPerWeek / 5) * getWorkDaysinMonth(month);
  const workDaysSoFar = (hoursPerWeek / 5) * getWorkDaysinMonth({ startTime: month.startTime, endTime: Date.now() });

  return (
    <div className="month-stats">
      <p>Worked hours in month: { workedHoursInMonth }</p>
      <p>Total hours in month: { workDaysInMonth }</p>
      <p>Total hours so far: { workDaysSoFar } Delta: { workedHoursInMonth - workDaysSoFar }</p>
    </div>
  );
};

MonthStats.defaultProps = {
  hoursPerWeek: 40
};

MonthStats.propTypes = {
  monthIntervals: customPropTypes.intervals.isRequired,
  hoursPerWeek: PropTypes.number,
  timestamp: PropTypes.number.isRequired
};

export default MonthStats;
