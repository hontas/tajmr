import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getHours, getTimeString } from '../../utils/time';

const getDuration = (timestamp) => getTimeString(timestamp, { isDuration: true });

const WeekDayItem = ({ weekday, total, date, intervals = [] }) => {
  const barHeight = getHours(total) * 10; // 10 hours = 100px;
  const style = {
    height: `${barHeight}px`
  };
  const baseClassName = 'week-stats-item';
  const barClassName = `${baseClassName}__bar`;
  const totalTime = intervals.reduce((res, { timespan }) => res + timespan, 0);

  return (
    <div className={baseClassName}>
      <div className={barClassName} style={style} tabIndex="-1">
        {intervals.map(({ timespan, note, notWork }) => (
          <div
            className={classNames(`${barClassName}__item`, { 'not-work': notWork })}
            key={timespan}
          >
            <p className={`${barClassName}__info`}>{`${getDuration(timespan)} ${note}`}</p>
          </div>
        ))}
        {totalTime > 0 && (
          <p className={`${barClassName}__total`} style={{ lineHeight: `${barHeight}px` }}>
            {getDuration(totalTime)}
          </p>
        )}
      </div>
      <p className="week-date">
        <span>{weekday}</span>
        <br />
        <span>{date}</span>
      </p>
    </div>
  );
};

WeekDayItem.defaultProps = {
  total: 0
};

WeekDayItem.propTypes = {
  weekday: PropTypes.string.isRequired,
  total: PropTypes.number,
  date: PropTypes.string.isRequired,
  intervals: PropTypes.arrayOf(PropTypes.object)
};

export default WeekDayItem;
