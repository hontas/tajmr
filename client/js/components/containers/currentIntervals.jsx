import React, { useState } from 'react';
import * as Sentry from '@sentry/react';

import MonthReport from '../monthReport/MonthReport.jsx';
import DigitalClock from '../digitalClock/digitalClock.jsx';
import WorkButton from '../button/workButton.jsx';
import ProgressBarTimeWrapper from '../ui-elements/ProgressBarTimeWrapper.jsx';
import IntervalList from '../intervalList/intervalList.jsx';
import MonthStats from '../intervalStats/monthStats.jsx';
import Button from '../button/button.jsx';
import { WeekStatsTimeWrapper } from '../intervalStats/weekStats.jsx';
import { attemptUpdate, attemptRemove, updateTimestamp } from '../../redux/intervals';
import { useDispatch, useSelector } from '../../hooks/useStore';
import AddOneInterval from '../intervalList/addOneInterval.jsx';
import { getIntervalSum, isActive, isComplete } from '../../utils/intervals';
import { getWeek, getMonth, getDayRange } from '../../utils/time';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback.jsx';

import styles from './currentIntervals.module.css';

const todayRange = getDayRange(Date.now());
function isToday({ startTime, endTime }) {
  const startedToday = startTime > todayRange.startTime;
  const endedToday = endTime > todayRange.startTime && endTime < todayRange.endTime;
  return startedToday || endedToday;
}

const CurrentIntervals = () => {
  const dispatch = useDispatch();
  const intervals = useSelector((state) => state.intervals.items);
  const timestamp = useSelector((state) => state.intervals.timestamp);
  const isLoading = useSelector((state) => state.intervals.isFetching || state.intervals.isSaving);
  const userSettings = useSelector((state) => state.userSettings);
  const [displayAddForm, setDisplayAddForm] = useState(false);

  const notes = [
    ...new Set(
      intervals.map(({ note }) => (note ? note.toLowerCase() : note)).filter((note) => note),
    ),
  ];
  const todaysIntervals = intervals.filter(isToday).filter(isComplete);
  const activeInterval = intervals.find(isActive);

  const activeAndCurrentIntervals = activeInterval
    ? [].concat(activeInterval, todaysIntervals)
    : todaysIntervals;
  const hoursInWeek = userSettings.hoursInWeek || 40;
  const hoursInDay = hoursInWeek / 5;
  const intervalSum = getIntervalSum(todaysIntervals);
  const week = getWeek(timestamp);
  const month = getMonth(timestamp);
  const weekIntervals = intervals.filter(
    ({ startTime }) => startTime > week.startTime && startTime < week.endTime,
  );
  const monthIntervals = intervals.filter(
    ({ startTime }) => startTime > month.startTime && startTime < month.endTime,
  );

  const update = (interval) => dispatch(attemptUpdate(interval));

  const onClick = () => {
    if (activeInterval) {
      return update({ ...activeInterval, endTime: Date.now() });
    }

    return update({ startTime: Date.now() });
  };

  return (
    <div className={styles.container}>
      <Sentry.ErrorBoundary fallback={ErrorBoundaryFallback}>
        <>
          <DigitalClock
            elapsed={intervalSum}
            from={activeInterval ? activeInterval.startTime : 0}
          />
          <ProgressBarTimeWrapper intervals={activeAndCurrentIntervals} max={hoursInWeek / 5} />
          <div className={styles.actionButtons}>
            <WorkButton
              data-testid="work-button"
              activeInterval={!!activeInterval}
              onClick={onClick}
              isLoading={isLoading}
            />
            <Button
              className={styles.prevWorkBtn}
              data-testid="register-previous-work-button"
              theme="primary"
              onClick={() => setDisplayAddForm(true)}
            >
              Efterregga
            </Button>
          </div>
          {displayAddForm && (
            <AddOneInterval
              data-testid="add-previous-interval-form"
              onAdd={(interval) => update(interval).then(() => setDisplayAddForm(false))}
              onCancel={() => setDisplayAddForm(false)}
              fullDay={hoursInDay}
              notes={notes}
            />
          )}
          <IntervalList
            data-testid="current-intervals-list"
            intervals={activeAndCurrentIntervals}
            onDelete={(id) => dispatch(attemptRemove(id))}
            onUpdate={update}
            notes={notes}
          />
          <WeekStatsTimeWrapper
            fetchIntervalsInWeek={(nextTimestamp) => dispatch(updateTimestamp(nextTimestamp))}
            intervals={weekIntervals}
            timestamp={timestamp}
            userSettings={userSettings}
          />
          {intervals.length > 0 && (
            <MonthStats
              timestamp={timestamp}
              monthIntervals={monthIntervals}
              hoursPerWeek={userSettings.hoursInWeek}
            />
          )}
          {userSettings.displayMonthReport && <MonthReport intervals={intervals} />}
        </>
      </Sentry.ErrorBoundary>
    </div>
  );
};

export default CurrentIntervals;
