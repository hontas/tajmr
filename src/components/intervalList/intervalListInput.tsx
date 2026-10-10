import { useState } from 'react';
import classNames from 'classnames';

import DatePicker from '#/components/datepicker/DatePicker.tsx';
import { getTimeString } from '#/utils/time.ts';

import styles from './intervalListInput.module.css';

const textFromTimestamp = (timestamp?: number) => (timestamp ? getTimeString(timestamp) : 'active');

interface IntervalListInputProps {
  className?: string;
  'data-testid'?: string;
  titlePrefix?: string;
  timestamp?: number;
  onUpdate: (timestamp: number) => void;
}

const IntervalListInput = ({
  className = '',
  'data-testid': testId,
  timestamp,
  titlePrefix,
  onUpdate,
}: IntervalListInputProps) => {
  const [value, setValue] = useState(textFromTimestamp(timestamp));
  const [isValid, setIsValid] = useState(true);
  const isActive = !timestamp;

  const validateAndPush = () => {
    if (!timestamp) return;
    const valueIsValid = validateTimeString(value);
    const hasChanged = value !== getTimeString(timestamp);

    if (!hasChanged) return;
    if (valueIsValid) {
      const [hours, minutes] = value.split(':');
      const date = new Date(timestamp);

      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      onUpdate(date.getTime());
    }
    setIsValid(valueIsValid);
  };

  const handleDateChange = (nextDate: Date) => {
    if (!timestamp) return;
    const currentDate = new Date(timestamp);
    currentDate.setFullYear(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());

    onUpdate(currentDate.getTime());
  };

  return (
    <div className={classNames(styles.container, className, { [styles.error]: !isValid })}>
      <input
        type="text"
        data-testid={testId}
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

function validateTimeString(time: string) {
  const [hours, minutes] = time.split(':').map((v) => parseInt(v, 10));
  return (
    hours !== undefined &&
    minutes !== undefined &&
    hours >= 0 &&
    hours < 24 &&
    minutes >= 0 &&
    minutes < 60 &&
    /^\d{2}:\d{2}$/.test(time)
  );
}

export default IntervalListInput;
