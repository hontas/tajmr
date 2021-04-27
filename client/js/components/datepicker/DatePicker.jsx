import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import classNames from 'classnames';
import 'react-day-picker/lib/style.css';

// 📅
import Calendar from '../icons/Calendar.jsx';

import styles from './DatePicker.module.css';

const DatePicker = ({ className, date, onDayClick, buttonTitle }) => {
  const [showDateInput, setShowDateInput] = useState();
  const datePicker = useRef();
  const handleOutsideClick = useRef(null);
  const classes = classNames(styles.container, className, {
    [styles.disabled]: !date,
    [styles.showPicker]: showDateInput,
  });

  const toggleDateInput = (evt) => {
    evt.preventDefault();
    setShowDateInput(!showDateInput);

    if (!showDateInput && !handleOutsideClick.current) {
      const clickHandler = ({ target }) => {
        if (datePicker?.current.contains(target) === false) {
          setShowDateInput(false);
          document.removeEventListener('click', clickHandler);
        }
      };
      handleOutsideClick.current = clickHandler;
      document.addEventListener('click', clickHandler, false);
    } else {
      document.removeEventListener('click', handleOutsideClick.current);
      handleOutsideClick.current = null;
    }
  };

  return (
    <div className={classes} ref={datePicker}>
      <button
        type="button"
        className={styles.calendarBtn}
        title={buttonTitle}
        onClick={toggleDateInput}
      >
        <Calendar />
      </button>
      {date && showDateInput && (
        <DayPicker
          className={styles.calendar}
          initialMonth={new Date(date)}
          showOutsideDays
          firstDayOfWeek={1}
          selectedDays={new Date(date)}
          onDayClick={onDayClick}
        />
      )}
    </div>
  );
};

DatePicker.defaultProps = {
  className: '',
  buttonTitle: '',
  date: null,
};

DatePicker.propTypes = {
  className: PropTypes.string,
  buttonTitle: PropTypes.string,
  date: PropTypes.number,
  onDayClick: PropTypes.func.isRequired,
};

export default DatePicker;
