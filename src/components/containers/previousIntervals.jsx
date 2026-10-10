import React, { useState } from 'react';
import * as Sentry from '@sentry/react';

import IntervalList from '#/components/intervalList/intervalList.jsx';
import Button from '#/components/button/button.jsx';
import { attemptUpdate, attemptRemove } from '#/store/intervals.js';
import { useDispatch, useSelector } from '#/store/useStore.jsx';
import { getWeek, getMonth, startOfDay } from '#/utils/time.js';
import { isComplete } from '#/utils/intervals.ts';
import { ErrorBoundaryFallback } from '#/components/ErrorBoundaryFallback.jsx';

import styles from './previousIntervals.module.css';

const limits = {
  ZERO: 0,
  WEEK: 1,
  MONTH: 2,
  ALL: 3,
};

const PreviousIntervals = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.intervals.items);
  const userSettings = useSelector((state) => state.userSettings);
  const [limit, setLimit] = useState(limits.ZERO);

  if (!limit && userSettings.displayPreviousIntervals) {
    setLimit(limits.WEEK);
  }

  if (!userSettings.displayPreviousIntervals) return null;

  const completeIntervals = items.filter(isComplete).filter(endedBeforeToday);
  let intervals;
  switch (limit) {
    case limits.ALL:
      intervals = completeIntervals;
      break;
    case limits.MONTH:
      intervals = completeIntervals.filter(isSameMonth);
      break;
    default:
      intervals = completeIntervals.filter(isSameWeek);
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tidigare</h3>
      <Sentry.ErrorBoundary fallback={ErrorBoundaryFallback}>
        <>
          <IntervalList
            intervals={intervals}
            onDelete={(id) => dispatch(attemptRemove(id))}
            onUpdate={(interval) => dispatch(attemptUpdate(interval))}
          />
          {limit < limits.ALL && (
            <Button
              className={styles.showMore}
              onClick={() => setLimit((current) => current + 1)}
              theme="primary"
            >
              Visa fler
            </Button>
          )}
        </>
      </Sentry.ErrorBoundary>
    </div>
  );
};

const now = Date.now();
const today = startOfDay(now);
function endedBeforeToday({ endTime }) {
  return endTime < today;
}

const week = getWeek(now);
function isSameWeek({ startTime }) {
  return startTime > week.startTime && startTime < week.endTime;
}

const month = getMonth(now);
function isSameMonth({ startTime }) {
  return startTime > month.startTime && startTime < month.endTime;
}

export default PreviousIntervals;
