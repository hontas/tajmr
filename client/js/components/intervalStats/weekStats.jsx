import React from 'react';
import PropTypes, * as customPropTypes from '../../constants/propTypes';

import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
import ProgressBar from '../ui-elements/progressBar.jsx';
import WeekStatsItem from './weekStatsItem.jsx';
import Button from '../button/button.jsx';
import {
  getHours,
  getDay,
  getDate,
  getWeekday,
  getWeekNumber,
  oneWeek
} from '../../utils/time';

const WeekStats = ({ fetchIntervalsInWeek, intervals, timestamp, userSettings }) => {
  const now = Date.now();
  // get startTime from first entry in intervals with default value
  const intervalSum = intervals
    .map(({ startTime, endTime }) => (endTime || now) - startTime)
    .reduce((res, curr) => res + curr, 0);
  const lastWeek = () => fetchIntervalsInWeek(timestamp - oneWeek);
  const nextWeek = () => fetchIntervalsInWeek(timestamp + oneWeek);

  return (
    <div className="week-stats">
      <h3 className="week-stats__title">
        <Button onClick={lastWeek}>{'◀︎'}</Button>
        {
          intervals.length ?
            ` v.${getWeekNumber(timestamp)} ` :
            ` v.${getWeekNumber(now)} `
        }
        <Button onClick={nextWeek}>{'▶︎'}</Button>
      </h3>
      <div className="week-stats__bars flex-container flex--align-end">
        {
          mashUpWeekAndIntervals(intervals, timestamp)
            .map((day) => <WeekStatsItem key={day.weekday} { ...day } />)
        }
      </div>
      <ProgressBar progress={getHours(intervalSum)} max={ userSettings.hoursInWeek } />
    </div>
  );
};

WeekStats.propTypes = {
  fetchIntervalsInWeek: PropTypes.func.isRequired,
  intervals: customPropTypes.intervals.isRequired,
  userSettings: customPropTypes.userSettings.isRequired,
  timestamp: PropTypes.number.isRequired
};

export const WeekStatsTimeWrapper = RenderEvery(thirtySeconds)(WeekStats);
export default WeekStats;

function createWeek(timestamp = Date.now()) {
  const d = new Date(timestamp);
  if (!d.getDay()) {
    d.setDate(d.getDate() - 1);
  }
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

function mashUpWeekAndIntervals(intervals, timestamp) {
  const intervalHash = groupByWeekDay(intervals);
  return createWeek(timestamp).map((day) => ({
    ...day,
    total: 0,
    ...intervalHash[day.date]
  }));
}

function sumTime(res, curr) {
  return res + (curr.endTime - curr.startTime);
}
