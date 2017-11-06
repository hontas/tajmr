import React from 'react';
import PropTypes from 'prop-types';

import { getHours, getTimeString } from '../../utils/time';

const getBarHeight = (total) => getHours(total) * 10;
const getStyle = (barHeight) => ({
  height: `${barHeight}px`,
  lineHeight: `${barHeight}px`
});

const WeekDayItem = ({ weekday, total, date, intervals }) => {
  const barHeight = getHours(total) * 10; // 10 hours = 100px;
  const style = {
    height: `${barHeight}px`,
    lineHeight: `${barHeight}px`
  };
  const baseClassName = 'week-stats-item';
  const barClassName = `${baseClassName}__bar`;

  return (
    <div className={baseClassName}>
      <div className={barClassName} style={style}>
        {intervals && intervals.map(({ notWork, timespan }) =>
          <div className={notWork && 'not-work'} style={getStyle(getBarHeight(timespan))} />)
        }
        { !!total &&
          <div className={`${baseClassName}__total`}>
            { getTimeString(total, { isDuration: true }) }
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
