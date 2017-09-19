import React from 'react';
import * as propTypes from '../../constants/propTypes';

import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
import ProgressBar from '../ui-elements/progressBar.jsx';
import WeekStatsItem from './weekStatsItem.jsx';
import {
  getHours,
  getDay,
  getDate,
  getWeekday,
  getWeek
} from '../../utils/time';

const WeekStats = ({ intervals, userSettings }) => {
  const now = Date.now();
  const intervalSum = intervals
    .map(({ startTime, endTime }) => (endTime || now) - startTime)
    .reduce((res, curr) => res + curr, 0);

  return (
    <div className="week-stats">
      <h3 className="week-stats__title">
        {
          intervals.length ?
            ` v.${getWeek(intervals[0].startTime)}` :
            ` v.${getWeek(Date.now())}`
        }
      </h3>
      <div className="week-stats__bars flex-container flex--align-end">
        {
          mashUpWeekAndIntervals(intervals)
            .map((day) => <WeekStatsItem key={day.weekday} { ...day } />)
        }
      </div>
      <ProgressBar progress={getHours(intervalSum)} max={ userSettings.hoursInWeek } />
    </div>
  );
};

WeekStats.propTypes = {
  intervals: propTypes.intervals.isRequired,
  userSettings: propTypes.userSettings.isRequired
};

export const WeekStatsTimeWrapper = RenderEvery(thirtySeconds)(WeekStats);
export default WeekStats;

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
  return intervals.reduce((hashMap, { startTime, endTime, notWork }) => {
    const date = new Date(startTime);
    const dateString = getDate(date);
    const weekDay = getWeekday(date);

    if (!hashMap[dateString]) {
      hashMap[dateString] = { total: 0, weekDay };
    }
    if (notWork) {
      hashMap[dateString].notWork = true;
    }
    hashMap[dateString].total += ((endTime || Date.now()) - startTime);

    return hashMap;
  }, {});
}

function mashUpWeekAndIntervals(intervals) {
  const intervalHash = groupByWeekDay(intervals);
  return createWeek().map((day) => ({
    ...day,
    total: 0,
    ...intervalHash[day.date]
  }));
}

function sumTime(res, curr) {
  return res + (curr.endTime - curr.startTime);
}
