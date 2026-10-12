import { useRef } from 'react';
import classNames from 'classnames';

import Calendar from '#/components/icons/Calendar.tsx';
import { toDateInputValue, fromDateInputValue } from '#/utils/time.ts';

import styles from './DatePicker.module.css';

interface DatePickerProps {
  className?: string;
  buttonTitle?: string;
  date?: number | null;
  onChange: (date: Date) => void;
}

const DatePicker = ({
  className = '',
  date = null,
  onChange,
  buttonTitle = '',
}: DatePickerProps) => {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className={classNames(styles.container, className)}>
      <button
        type="button"
        className={styles.button}
        aria-hidden
        tabIndex={-1}
        disabled={!date}
        onClick={() => input.current?.showPicker?.()}
      >
        <Calendar size={24} />
      </button>
      <input
        ref={input}
        type="date"
        className={styles.input}
        title={buttonTitle}
        aria-label={buttonTitle}
        disabled={!date}
        value={date ? toDateInputValue(date) : ''}
        onChange={({ target }) => target.value && onChange(fromDateInputValue(target.value))}
      />
    </div>
  );
};

export default DatePicker;
