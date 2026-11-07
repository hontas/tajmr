import { useState } from 'react';
import * as Sentry from '@sentry/react';

import IntervalList from '#/components/intervalList/intervalList.tsx';
import Button from '#/components/button/button.tsx';
import { attemptUpdate, attemptRemove } from '#/store/intervals.ts';
import { useDispatch, useSelector } from '#/store/useStore.tsx';
import useNow from '#/hooks/useNow.ts';
import { getWeek, getMonth, startOfDay } from '#/utils/time.ts';
import type { Interval } from '#/utils/interValidator.ts';
import { isComplete } from '#/utils/intervals.ts';
import { ErrorBoundaryFallback } from '#/components/ErrorBoundaryFallback.tsx';

import styles from './previousIntervals.module.css';

const limits = {
  ZERO: 0,
  WEEK: 1,
  MONTH: 2,
  ALL: 3,
};

const PreviousIntervals = () => {
  const dispatch = useDispatch();
  const now = useNow();
  const items = useSelector((state) => state.intervals.items);
  const userSettings = useSelector((state) => state.userSettings);
  const [limit, setLimit] = useState(limits.ZERO);

  if (!limit && userSettings.displayPreviousIntervals) {
    setLimit(limits.WEEK);
  }

  if (!userSettings.displayPreviousIntervals) return null;

  const today = +startOfDay(now);
  const week = getWeek(now);
  const month = getMonth(now);
  const completeIntervals = items
    .filter(isComplete)
    .filter(({ endTime }) => endTime !== undefined && endTime < today);
  const isSameWeek = ({ startTime }: Interval) =>
    startTime > week.startTime && startTime < week.endTime;
  const isSameMonth = ({ startTime }: Interval) =>
    startTime > month.startTime && startTime < month.endTime;
  let intervals: Interval[];
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
            label="Tidigare intervall"
            intervals={intervals}
            onDelete={(id) => {
              if (id) dispatch(attemptRemove(id));
            }}
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

export default PreviousIntervals;
