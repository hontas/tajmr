import type { Interval } from '#/utils/interValidator.ts';
import IntervalListItem, { type EditableInterval } from './intervalListItem.tsx';

import styles from './intervalList.module.css';

function sortBy(array: Interval[], prop: 'startTime') {
  return array.slice().sort((a, b) => b[prop] - a[prop]);
}

const emptyNotes: string[] = [];

interface IntervalListProps {
  label: string;
  intervals: Interval[];
  onDelete: (id: string | undefined) => void;
  onUpdate: (interval: EditableInterval) => void;
  notes?: string[];
}

const IntervalList = ({
  intervals,
  onDelete,
  onUpdate,
  notes = emptyNotes,
  label,
}: IntervalListProps) => (
  <ul aria-label={label} className={styles.container}>
    {sortBy(intervals, 'startTime').map((interval) => (
      <IntervalListItem
        key={interval.id}
        interval={interval}
        onDelete={onDelete}
        onUpdate={onUpdate}
        notes={notes}
      />
    ))}
  </ul>
);

export default IntervalList;
