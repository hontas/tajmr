import { useState } from 'react';
import classNames from 'classnames';

import DatePicker from '#/components/datepicker/DatePicker.tsx';
import { getTimeString, mergeDate, mergeTimeOfDay } from '#/utils/time.ts';

import styles from './intervalListInput.module.css';

interface IntervalListInputProps {
  className?: string;
  label: string;
  timestamp?: number;
  onUpdate: (timestamp: number) => void;
}

const IntervalListInput = ({ className, label, timestamp, onUpdate }: IntervalListInputProps) => {
  const [value, setValue] = useState(timestamp ? getTimeString(timestamp) : '');

  const pushTime = () => {
    const merged = mergeTimeOfDay(timestamp, value);
    if (merged !== undefined) onUpdate(merged);
  };

  const pushDate = (nextDate: Date) => {
    const merged = mergeDate(timestamp, nextDate);
    if (merged !== undefined) onUpdate(merged);
  };

  return (
    <div className={classNames(styles.container, className)}>
      <DatePicker
        label={`${label}datum`}
        className={styles.date}
        date={timestamp}
        onChange={pushDate}
      />
      <input
        type="time"
        aria-label={`${label}tid`}
        className={styles.input}
        disabled={!timestamp}
        onBlur={pushTime}
        onChange={({ target }) => setValue(target.value)}
        value={value}
      />
    </div>
  );
};

export default IntervalListInput;
