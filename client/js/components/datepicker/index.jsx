import React from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import classNames from 'classnames';

const DatePicker = ({ className, date }) => (
  <div className={ classNames('date-picker', className) }>
    <div className="date-picker__icon">📅</div>
    <DayPicker
      canChangeMonth={ false }
      className="date-picker__calendar"
      enableOutsideDays
      firstDayOfWeek={ 1 }
      selectedDays={ new Date(date) } />
  </div>
);

DatePicker.propTypes = {
  className: PropTypes.string,
  date: PropTypes.number.isRequired
};

export default DatePicker;
