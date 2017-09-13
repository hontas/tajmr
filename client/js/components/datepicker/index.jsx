import React from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import classNames from 'classnames';

// 📅
import Calendar from '../icons/Calendar.jsx';

const DatePicker = ({ className, date, onDayClick }) => (
  <div className={ classNames('date-picker', className, { 'date-picker--disabled': !date }) }>
    <div className="date-picker__icon">
      <Calendar />
    </div>
    { date &&
      <DayPicker
        canChangeMonth={ false }
        className="date-picker__calendar"
        enableOutsideDays
        firstDayOfWeek={ 1 }
        selectedDays={ new Date(date) }
        onDayClick={onDayClick} />
    }
  </div>
);

DatePicker.propTypes = {
  className: PropTypes.string,
  date: PropTypes.number,
  onDayClick: PropTypes.func.isRequired
};

export default DatePicker;
