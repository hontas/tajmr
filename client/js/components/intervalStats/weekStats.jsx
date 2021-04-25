import React from 'react';
import classNames from 'classnames';
import PropTypes, * as customPropTypes from '../../constants/propTypes';

import RenderEvery, { thirtySeconds } from '../hoc/RenderEvery.jsx';
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
    const { intervals, timestamp, userSettings } = this.props;
    const now = Date.now();
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
        <div className={classNames(styles.bars, 'flex-container flex--align-end')}>
          {mashUpWeekAndIntervals(intervals, timestamp).map((day) => (
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
};

export const WeekStatsTimeWrapper = RenderEvery(thirtySeconds)(WeekStats);
export default WeekStats;

function groupByWeekDay(intervals) {
  return intervals.reduce((hashMap, { startTime, endTime, notWork, note }) => {
    const date = new Date(startTime);
    const dateString = getDate(date);
    const weekDay = getWeekday(date);
    const timespan = (endTime || Date.now()) - startTime;
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

function mashUpWeekAndIntervals(intervals, timestamp) {
  const intervalHash = groupByWeekDay(intervals);

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
