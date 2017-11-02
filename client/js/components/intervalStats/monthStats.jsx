import React from 'react';
import PropTypes from 'prop-types';
import * as customPropTypes from '../../constants/propTypes';
import ProgressBar from '../ui-elements/progressBar.jsx';
import {
  oneHour,
  getMonth,
  getWorkDaysinMonth
} from '../../utils/time';
import { getIntervalSum } from '../../utils/intervals';

const MonthStats = ({ hoursPerWeek, monthIntervals, timestamp }) => {
  const month = getMonth(timestamp);
  const monthSoFar = { startTime: month.startTime, endTime: Date.now() };
  const workedHoursInMonth = getIntervalSum(monthIntervals) / oneHour;
  const totalWorkHoursInMonth = (hoursPerWeek / 5) * getWorkDaysinMonth(month);
  const totalWorkHoursSoFar = (hoursPerWeek / 5) * getWorkDaysinMonth(monthSoFar);

  return (
    <div className="month-stats">
      <h3 className="mont-stats__heading">Månad</h3>
      <ProgressBar progress={workedHoursInMonth} max={totalWorkHoursInMonth} />
      <h3 className="mont-stats__heading">Flex</h3>
      <ProgressBar progress={workedHoursInMonth} max={totalWorkHoursSoFar} unit="h" inverted onlyDelta />
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
