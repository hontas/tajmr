import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getHours, getTimeString } from '../../utils/time';

import styles from './weekStatsItem.module.css';

const getDuration = (timestamp) => getTimeString(timestamp, { isDuration: true });

const WeekDayItem = ({ weekday, total, date, intervals = [] }) => {
  // 10 hours = 100px; minimum 20px
  const barHeight = total > 0 ? Math.max(getHours(total) * 10, 20) : 0;
  const style = {
    height: `${barHeight}px`,
  };

  return (
    <div className={styles.container}>
      <div className={styles.bar} style={style} tabIndex="-1" data-testid="week-stats-item">
        {intervals.map(({ timespan, note, notWork }) => {
          const flexBasis = Math.round((timespan / total) * barHeight * 2) / 2;

          return (
            <div
              className={classNames(styles.item, { [styles.notWork]: notWork })}
              style={{ flexBasis: `${flexBasis}px` }}
              key={timespan}
            >
              <p className={styles.info}>{`${getDuration(timespan)} ${note}`}</p>
            </div>
          );
        })}
        {total > 0 && (
          <p className={styles.total} style={{ lineHeight: `${barHeight}px` }}>
            {getDuration(total)}
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
