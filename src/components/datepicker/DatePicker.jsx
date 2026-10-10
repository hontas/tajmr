import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Calendar from '../icons/Calendar.jsx';
import { toDateInputValue, fromDateInputValue } from '../../utils/time';

import styles from './DatePicker.module.css';

const DatePicker = ({ className = '', date = null, onChange, buttonTitle = '' }) => (
  <div className={classNames(styles.container, className, { [styles.disabled]: !date })}>
    <Calendar />
    <input
      type="date"
      className={styles.input}
      title={buttonTitle}
      aria-label={buttonTitle}
      disabled={!date}
      value={date ? toDateInputValue(date) : ''}
      onClick={(evt) => evt.currentTarget.showPicker?.()}
      onChange={({ target }) => target.value && onChange(fromDateInputValue(target.value))}
    />
  </div>
);

DatePicker.propTypes = {
  className: PropTypes.string,
  buttonTitle: PropTypes.string,
  date: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default DatePicker;
