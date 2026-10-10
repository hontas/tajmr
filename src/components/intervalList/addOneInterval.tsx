import { useState, type SyntheticEvent } from 'react';
import IntervalListItem, { type EditableInterval } from './intervalListItem.tsx';
import type { NewInterval } from '#/utils/interValidator.ts';
import Save from '#/components/icons/Save.tsx';
import Button from '#/components/button/button.tsx';
import Error from '#/components/error/Error.tsx';

import styles from './addOneInterval.module.css';

const startHour = 9;

interface AddOneIntervalProps {
  onAdd: (interval: NewInterval) => Promise<unknown>;
  onCancel: () => void;
  fullDay: number;
  notes?: string[];
}

const AddOneInterval = ({ notes, onCancel, onAdd, fullDay }: AddOneIntervalProps) => {
  const hours = Math.trunc(fullDay);
  const minutes = Math.round(60 * (fullDay - hours));
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<EditableInterval>({
    startTime: getTimestampFromHMS(startHour),
    endTime: getTimestampFromHMS(startHour + hours, minutes),
    note: '',
  });

  const handleClickSubmit = (evt: SyntheticEvent) => {
    evt.preventDefault();
    onAdd(interval)
      .then(() => setError(null))
      .catch(setError);
  };

  const onUpdate = (updatedInterval: EditableInterval) => {
    setInterval(updatedInterval);
  };

  return (
    <>
      <form
        data-testid="add-previous-interval-form"
        className={styles.container}
        onSubmit={handleClickSubmit}
      >
        <IntervalListItem
          className={styles.intervalListItem}
          interval={interval}
          onUpdate={onUpdate}
          notes={notes}
        />
        <Button
          className={styles.saveBtn}
          data-testid="add-one-interval-save-btn"
          type="submit"
          theme="primary"
          onClick={handleClickSubmit}
        >
          <Save size={16} />
        </Button>
        <Button
          className={styles.cancelBtn}
          data-testid="add-one-interval-cancel-btn"
          theme="primary"
          onClick={onCancel}
        >
          ╳
        </Button>
      </form>
      {error && <Error error={error} />}
    </>
  );
};

function getTimestampFromHMS(hours: number, minutes = 0, seconds = 0) {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date.getTime();
}

export default AddOneInterval;
