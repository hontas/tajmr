import React from 'react';
import classNames from 'classnames';
import PropTypes, * as customPropTypes from '../../constants/propTypes';

import useNow from '../../hooks/useNow';
import ProgressBar from '../ui-elements/progressBar.jsx';
import WeekStatsItem from './weekStatsItem.jsx';
import Button from '../button/button.jsx';
import {
  getHours,
  getDate,
  getWeekday,
  getWeekNumber,
  createWorkWeek,
  oneWeek,
} from '../../utils/time';

import styles from './weekStats.module.css';

class WeekStats extends React.Component {
  render() {
    const { intervals, timestamp, userSettings, now } = this.props;
    // get startTime from first entry in intervals with default value
    const intervalSum = intervals
      .map(({ startTime, endTime }) => (endTime || now) - startTime)
      .reduce((res, curr) => res + curr, 0);

    return (
      <div className={styles.container}>
        <h3 className={styles.title}>
          <Button className={styles.button} onClick={this.lastWeek} data-testid="prev-week-btn">
            ◀︎
          </Button>
          {intervals.length ? ` v.${getWeekNumber(timestamp)} ` : ` v.${getWeekNumber(now)} `}
          <Button className={styles.button} onClick={this.nextWeek} data-testid="next-week-btn">
            ▶︎
          </Button>
        </h3>
        <div className={classNames(styles.bars)}>
          {mashUpWeekAndIntervals(intervals, timestamp, now).map((day) => (
            <WeekStatsItem key={day.weekday} {...day} />
          ))}
        </div>
        <ProgressBar progress={getHours(intervalSum)} max={userSettings.hoursInWeek} />
      </div>
    );
  }

  lastWeek = () => {
    const { fetchIntervalsInWeek, timestamp } = this.props;
    fetchIntervalsInWeek(timestamp - oneWeek);
  };

  nextWeek = () => {
    const { fetchIntervalsInWeek, timestamp } = this.props;
    fetchIntervalsInWeek(timestamp + oneWeek);
  };
}

WeekStats.propTypes = {
  fetchIntervalsInWeek: PropTypes.func.isRequired,
  intervals: customPropTypes.intervals.isRequired,
  userSettings: customPropTypes.userSettings.isRequired,
  timestamp: PropTypes.number.isRequired,
  now: PropTypes.number.isRequired,
};

export const WeekStatsTimeWrapper = (props) => <WeekStats {...props} now={useNow()} />;
export default WeekStats;

function groupByWeekDay(intervals, now) {
  return intervals.reduce((hashMap, { startTime, endTime, notWork, note }) => {
    const date = new Date(startTime);
    const dateString = getDate(date);
    const weekDay = getWeekday(date);
    const timespan = (endTime || now) - startTime;
    const current = hashMap[dateString] || {
      total: 0,
      weekDay,
      intervals: [],
    };

    return {
      ...hashMap,
      [dateString]: {
        ...current,
        notWork: notWork || current.notWork,
        total: current.total + timespan,
        intervals: [...current.intervals, { notWork, timespan, note }],
      },
    };
  }, {});
}

function mashUpWeekAndIntervals(intervals, timestamp, now) {
  const intervalHash = groupByWeekDay(intervals, now);

  return createWorkWeek(timestamp)
    .map((day) => ({
      ...day,
      total: 0,
      ...intervalHash[day.date],
    }))
    .filter((item) => {
      if (item.isWeekEnd && item.total === 0) return false;
      return true;
    });
}
