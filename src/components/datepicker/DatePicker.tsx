import { useRef } from 'react';
import classNames from 'classnames';

import Calendar from '#/components/icons/Calendar.tsx';
import { toDateInputValue, fromDateInputValue } from '#/utils/time.ts';

import styles from './DatePicker.module.css';

interface DatePickerProps {
  className?: string;
  label: string;
  date?: number | null;
  onChange: (date: Date) => void;
}

const DatePicker = ({ className = '', date = null, onChange, label }: DatePickerProps) => {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      className={classNames(styles.container, className)}
      style={{ color: date ? undefined : 'var(--text-color-light)' }}
    >
      <Calendar size={24} />
      <input
        ref={input}
        type="date"
        className={styles.input}
        name={label}
        title={label}
        aria-label={label}
        disabled={!date}
        value={date ? toDateInputValue(date) : ''}
        onChange={({ target }) => target.value && onChange(fromDateInputValue(target.value))}
      />
    </div>
  );
};

export default DatePicker;
