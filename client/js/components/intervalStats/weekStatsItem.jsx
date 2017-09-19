import React from 'react';
import PropTypes from 'prop-types';

import { getHours, getTimeString } from '../../utils/time.js';

const WeekDayItem = ({ weekday, total, date, notWork }) => {
  const barHeight = getHours(total) * 10; // 10 hours = 100px;
  const style = {
    height: `${barHeight}px`,
    lineHeight: `${barHeight}px`
  };
  const baseClassName = 'week-stats-item';
  const barClassName = notWork ? `${baseClassName}__bar ${baseClassName}__bar--not-work` : `${baseClassName}__bar`;

  return (
    <div className={ baseClassName }>
      <div className={ barClassName } style={ style }>
        { !!total &&
          getTimeString(total, { isDuration: true })
        }
      </div>
      <p className="week-date">
        { weekday } <br/>
        { date }
      </p>
    </div>
  );
};

WeekDayItem.propTypes = {
  weekday: PropTypes.string,
  total: PropTypes.number,
  date: PropTypes.string
};

export default WeekDayItem;
