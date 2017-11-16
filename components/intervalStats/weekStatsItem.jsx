import React from 'react';
import PropTypes from 'prop-types';

import { getHours, getTimeString } from '../../utils/time';

const getBarHeight = (total) => getHours(total) * 10;
const getStyle = (barHeight) => ({
  height: `${barHeight}px`,
  lineHeight: `${barHeight}px`
});

const WeekDayItem = ({ weekday, total, date, intervals = [] }) => {
  const barHeight = getHours(total) * 10; // 10 hours = 100px;
  const style = {
    height: `${barHeight}px`,
    lineHeight: `${barHeight}px`
  };
  const baseClassName = 'week-stats-item';
  const barClassName = `${baseClassName}__bar`;
  const normalWork = intervals
    .filter(({ notWork }) => !notWork)
    .reduce((res, { timespan }) => res + timespan, 0);
  const otherThanWork = intervals
    .filter(({ notWork }) => notWork)
    .reduce((res, { timespan }) => res + timespan, 0);

  return (
    <div className={baseClassName}>
      <div className={barClassName} style={style}>
        {!!normalWork &&
          <div style={getStyle(getBarHeight(normalWork))}>
            { getTimeString(normalWork, { isDuration: true }) }
          </div>
        }
        {!!otherThanWork &&
          <div className="not-work" style={getStyle(getBarHeight(otherThanWork))}>
            { getTimeString(otherThanWork, { isDuration: true }) }
          </div>
        }
      </div>
      <p className="week-date">
        { weekday } <br />
        { date }
      </p>
    </div>
  );
};

WeekDayItem.defaultProps = {
  total: 0,
  notWork: false
};

WeekDayItem.propTypes = {
  weekday: PropTypes.string.isRequired,
  notWork: PropTypes.bool,
  total: PropTypes.number,
  date: PropTypes.string.isRequired,
  intervals: PropTypes.arrayOf(PropTypes.object)
};

export default WeekDayItem;
