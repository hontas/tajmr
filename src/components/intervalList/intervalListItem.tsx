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
    <li className={classNames(styles.container, className)} data-testid="interval-item">
      <IntervalListInput
        key={startTime}
        data-testid="interval-from-input"
        titlePrefix="from"
        timestamp={startTime}
        onUpdate={updateTime('startTime')}
      />

      <IntervalListInput
        key={endTime ?? 'active'}
        data-testid="interval-end-input"
        titlePrefix="end"
        timestamp={endTime}
        onUpdate={updateTime('endTime')}
      />

      <AutoComplete
        data-testid="interval-note-input"
        className={styles.note}
        placeholder="Anteckning"
        onChange={updateNote}
        value={note}
        notes={notes}
      />

      <input
        data-testid="interval-not-work-checkbox"
        className={styles.notWork}
        type="checkbox"
        title="not work"
        checked={notWork || false}
        onChange={({ target: { checked } }) => onUpdate({ ...interval, notWork: checked })}
      />

      {onDelete && (
        <Button
          className={styles.deleteBtn}
          theme="danger"
          title="remove"
          data-testid="remove-interval"
          onClick={() => onDelete(interval.id)}
        >
          <Trashcan size={15} />
        </Button>
      )}
    </li>
  );
};

export default IntervalListItem;
