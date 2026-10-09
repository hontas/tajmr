import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DatePicker from '../datepicker/DatePicker.jsx';
import { getTimeString } from '../../utils/time';

import styles from './intervalListInput.module.css';

const textFromTimestamp = (timestamp) => (timestamp ? getTimeString(timestamp) : 'active');

const IntervalListInput = ({
  className = '',
  dataTestId = '',
  timestamp,
  titlePrefix,
  onUpdate,
}) => {
  const [value, setValue] = useState(textFromTimestamp(timestamp));
  const [isValid, setIsValid] = useState(true);
  const [lastTimestamp, setLastTimestamp] = useState(timestamp);
  const isActive = !timestamp;

  if (timestamp !== lastTimestamp) {
    setLastTimestamp(timestamp);
    setValue(textFromTimestamp(timestamp));
    setIsValid(true);
  }

  const validateAndPush = () => {
    const valueIsValid = validateTimeString(value);
    const hasChanged = value !== getTimeString(timestamp);

    if (!hasChanged) return;
    if (valueIsValid) {
      const [hours, minutes] = value.split(':');
      const date = new Date(timestamp);

      date.setHours(hours);
      date.setMinutes(minutes);
      onUpdate({ target: { value: date.getTime() } });
    }
    setIsValid(valueIsValid);
  };

  const handleDateChange = (nextDate) => {
    const currentDate = new Date(timestamp);
    currentDate.setFullYear(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());

    onUpdate({ target: { value: currentDate.getTime() } });
  };

  return (
    <div className={classNames(styles.container, className, { [styles.error]: !isValid })}>
      <input
        type="text"
        data-testid={dataTestId}
        title={`${titlePrefix} time`}
        className={styles.input}
        disabled={isActive}
        onBlur={validateAndPush}
        onChange={({ target }) => setValue(target.value)}
        value={value}
      />
      <DatePicker
        buttonTitle={`${titlePrefix} date`}
        className={styles.date}
        date={timestamp}
        onChange={handleDateChange}
      />
    </div>
  );
};

function validateTimeString(time) {
  const [hours, minutes] = time.split(':').map((v) => parseInt(v, 10));
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && /^\d{2}:\d{2}$/.test(time);
}

IntervalListInput.propTypes = {
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  titlePrefix: PropTypes.string,
  timestamp: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
};

export default IntervalListInput;
