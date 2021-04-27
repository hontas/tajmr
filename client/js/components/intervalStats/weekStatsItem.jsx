import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getHours, getTimeString } from '../../utils/time';

import styles from './weekStatsItem.module.css';

const getDuration = (timestamp) => getTimeString(timestamp, { isDuration: true });

const WeekDayItem = ({ weekday, total, date, intervals = [] }) => {
  const barHeight = getHours(total) * 10; // 10 hours = 100px;
  const style = {
    height: `${barHeight}px`,
  };
  const totalTime = intervals.reduce((res, { timespan }) => res + timespan, 0);

  return (
    <div className={styles.container}>
      <div className={styles.bar} style={style} tabIndex="-1" data-testid="week-stats-item">
        {intervals.map(({ timespan, note, notWork }) => (
          <div className={classNames(styles.item, { [styles.notWork]: notWork })} key={timespan}>
            <p className={styles.info}>{`${getDuration(timespan)} ${note}`}</p>
          </div>
        ))}
        {totalTime > 0 && (
          <p className={styles.total} style={{ lineHeight: `${barHeight}px` }}>
            {getDuration(totalTime)}
          </p>
        )}
      </div>
      <p>
        <span>{weekday}</span>
        <br />
        <span>{date}</span>
      </p>
    </div>
  );
};

WeekDayItem.defaultProps = {
  total: 0,
};

WeekDayItem.propTypes = {
  weekday: PropTypes.string.isRequired,
  total: PropTypes.number,
  date: PropTypes.string.isRequired,
  intervals: PropTypes.arrayOf(PropTypes.object),
};

export default WeekDayItem;
