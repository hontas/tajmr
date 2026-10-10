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
}: DatePickerProps) => (
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

export default DatePicker;
