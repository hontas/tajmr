import classNames from 'classnames';

import IntervalListInput from './intervalListInput.tsx';
import type { NewInterval } from '#/utils/interValidator.ts';
import Trashcan from '#/components/icons/Trashcan.tsx';
import Button from '#/components/button/button.tsx';
import AutoComplete from '#/components/autoComplete/AutoComplete.tsx';

import styles from './intervalListItem.module.css';

export type EditableInterval = NewInterval & { id?: string };

interface IntervalListItemProps {
  interval: EditableInterval;
  onDelete?: (id: string | undefined) => void;
  onUpdate: (interval: EditableInterval) => void;
  notes?: string[];
  className?: string;
}

const IntervalListItem = ({
  notes,
  onDelete,
  onUpdate,
  className,
  interval,
}: IntervalListItemProps) => {
  const { startTime, endTime, note, notWork } = interval;
  const updateTime = (prop: 'startTime' | 'endTime') => (value: number) =>
    onUpdate({ ...interval, [prop]: value });
  const updateNote = (value: string) => onUpdate({ ...interval, note: value });

  return (
    <li className={classNames(styles.container, className)}>
      <IntervalListInput
        key={startTime}
        label="Start"
        timestamp={startTime}
        onUpdate={updateTime('startTime')}
      />
      <IntervalListInput
        key={endTime ?? 'active'}
        label="Slut"
        timestamp={endTime}
        onUpdate={updateTime('endTime')}
      />

      <AutoComplete
        aria-label="Anteckning"
        className={styles.note}
        placeholder="Anteckning"
        onChange={updateNote}
        value={note}
        notes={notes}
      />

      <label className={styles.notWork}>
        <input
          type="checkbox"
          checked={notWork || false}
          onChange={({ target: { checked } }) => onUpdate({ ...interval, notWork: checked })}
        />
        <span className={styles.notWorkText}>Ej arbete</span>
      </label>

      {onDelete && (
        <Button
          className={styles.deleteBtn}
          theme="danger"
          aria-label="Ta bort intervallet"
          onClick={() => onDelete(interval.id)}
        >
          <Trashcan size={15} />
        </Button>
      )}
    </li>
  );
};

export default IntervalListItem;
