import React, { PropTypes } from 'react';
import IntervalStatsItem from './intervalStatsItem.jsx';
import {
  getTimePartsFromElapsedTime,
  subtractDays,
  getWeekday,
  startOfDay,
  zeroPad
} from '../../utils/time';

const today = startOfDay(new Date());
const oneWeekBack = subtractDays(today, 7);

function byOneWeekBack(interval) {
  return interval.startTime > oneWeekBack;
}

function getIntervalAndDate(interval) {
  const date = new Date(interval.startTime);
  return {
    date,
    weekDay: getWeekday(date),
    interval: (interval.endTime || Date.now()) - interval.startTime
  };
}

function groupByDate(res, curr) {
  const key = curr.date.toLocaleDateString();
  if (res[key]) {
    res[key].interval += curr.interval;
  } else {
    res[key] = curr;
  }

  return res;
}

const IntervalStats = ({ intervals }) => {
  const dateMap = intervals
    .filter(byOneWeekBack)
    .map(getIntervalAndDate)
    .reduce(groupByDate, {});

  const intervalsDayList = Object.keys(dateMap)
    .map((date) => {
      const { hours, minutes } = getTimePartsFromElapsedTime(dateMap[date].interval);
      const timestring = `${zeroPad(hours)}:${zeroPad(minutes)}`;
      return (<IntervalStatsItem
          day={ dateMap[date].weekDay }
          key={ date }
          time={ timestring } />);
    });

  return (
    <div className="interval-stats">
      { intervalsDayList }
    </div>
  );
};

IntervalStats.propTypes = {
  intervals: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default IntervalStats;
