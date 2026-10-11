import { useState } from 'react';
import classNames from 'classnames';

import DatePicker from '#/components/datepicker/DatePicker.tsx';
import { getTimeString } from '#/utils/time.ts';

import styles from './intervalListInput.module.css';

interface IntervalListInputProps {
  className?: string;
  'data-testid'?: string;
  label: string;
  timestamp?: number;
  onUpdate: (timestamp: number) => void;
}

const IntervalListInput = ({
  className,
  'data-testid': testId,
  label,
  timestamp,
  onUpdate,
}: IntervalListInputProps) => {
  const [value, setValue] = useState(timestamp ? getTimeString(timestamp) : '');

  const pushTime = () => {
    if (!timestamp || !value || value === getTimeString(timestamp)) return;
    const [hours, minutes] = value.split(':').map(Number);
    const date = new Date(timestamp);
    date.setHours(hours ?? 0, minutes ?? 0);
    onUpdate(date.getTime());
  };

  const pushDate = (nextDate: Date) => {
    if (!timestamp) return;
    const date = new Date(timestamp);
    date.setFullYear(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
    onUpdate(date.getTime());
  };

  return (
    <div className={classNames(styles.container, className)}>
      <DatePicker
        buttonTitle={`${label}datum`}
        className={styles.date}
        date={timestamp}
        onChange={pushDate}
      />
      {timestamp ? (
        <input
          type="time"
          data-testid={testId}
          aria-label={`${label}tid`}
          className={styles.input}
          onBlur={pushTime}
          onChange={({ target }) => setValue(target.value)}
          value={value}
        />
      ) : (
        <input
          type="text"
          data-testid={testId}
          aria-label={`${label}tid`}
          className={styles.input}
          disabled
          value="pågår"
          readOnly
        />
      )}
    </div>
  );
};

export default IntervalListInput;
