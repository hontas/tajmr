import React from 'react';

import type { Interval } from '#/utils/interValidator.ts';
import IntervalListItem, { type EditableInterval } from './intervalListItem.tsx';

import styles from './intervalList.module.css';

function sortBy(array: Interval[], prop: 'startTime') {
  return array.slice().sort((a, b) => b[prop] - a[prop]);
}

const emptyNotes: string[] = [];

interface IntervalListProps extends React.ComponentProps<'ul'> {
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
  ...props
}: IntervalListProps) => (
  <ul {...props} className={styles.container}>
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
