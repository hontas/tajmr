import React from 'react';
import { connect } from 'react-redux';

import * as propTypes from '../../constants/propTypes';
import IntervalStatsItem from './intervalStatsItem.jsx';
import {
  getTimePartsFromElapsedTime,
  getWeekday,
  zeroPad
} from '../../utils/time';

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
    .map(getIntervalAndDate)
    .slice(0, 5)
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
  intervals: propTypes.intervals.isRequired
};

function mapStateToProps({ intervals }) {
  return {
    intervals: Object.keys(intervals.items).map((key) => intervals.items[key])
  };
}

export default connect(mapStateToProps)(IntervalStats);
