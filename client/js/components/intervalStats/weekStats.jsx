import React from 'react';
import * as propTypes from '../../constants/propTypes';

import ProgressBar from '../ui-elements/progressBar.jsx';
import WeekStatsItem from './weekStatsItem.jsx';
import {
  getTimePartsFromElapsedTime,
  zeroPad,
  getTimeString,
  getHours,
  getDay,
  getDate,
  getWeekday,
  weekDays
} from '../../utils/time';

function createWeek() {
  const d = new Date();
  return Array(7).fill(0)
    .map((_, day) => {
      d.setDate(d.getDate() - d.getDay() + day);
      return {
        weekday: getWeekday(d),
        date: getDate(d)
      };
    })
    .slice(1, 6);
}

function groupByWeekDay(intervals) {
  return intervals.reduce((hashMap, interval) => {
    const date = new Date(interval.startTime);
    const weekDay = getWeekday(date);

    if (!hashMap[weekDay]) {
      hashMap[weekDay] = { total: 0 };
    }
    hashMap[weekDay].total += (interval.endTime - interval.startTime);

    return hashMap;
  }, {});
}

function mashUpWeekAndIntervals(intervals) {
  const intervalHash = groupByWeekDay(intervals);
  return createWeek().map((day) => ({
    ...day,
    total: 0,
    ...intervalHash[day.weekday]
  }));
}

function sumTime(res, curr) {
  return res + (curr.endTime - curr.startTime);
}

const WeekStats = ({ intervals, userSettings }) => (
  <div className="week-stats">
    <h3>{ 'Veckostatistik' }</h3>
    <div className="flex-container flex--align-end">
      {
        mashUpWeekAndIntervals(intervals)
          .map((day) =>
            <WeekStatsItem key={day.weekday} { ...day } />)
      }
    </div>
    <ProgressBar progress={getHours(intervals.reduce(sumTime, 0))} max={ userSettings.hoursInWeek } />
  </div>
);

WeekStats.propTypes = {
  intervals: propTypes.intervals.isRequired,
  userSettings: propTypes.userSettings
};

export default WeekStats;
