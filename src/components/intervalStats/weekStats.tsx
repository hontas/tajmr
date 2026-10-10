import classNames from 'classnames';

import useNow from '#/hooks/useNow.ts';
import ProgressBar from '#/components/ui-elements/progressBar.tsx';
import WeekStatsItem, { type WeekDayInterval } from './weekStatsItem.tsx';
import Button from '#/components/button/button.tsx';
import type { NewInterval } from '#/utils/interValidator.ts';
import type { UserSettingsState } from '#/store/userSettings.ts';
import {
  getHours,
  getDate,
  getWeekday,
  getWeekNumber,
  createWorkWeek,
  oneWeek,
} from '#/utils/time.ts';

import styles from './weekStats.module.css';

interface WeekStatsProps {
  fetchIntervalsInWeek: (timestamp: number) => unknown;
  intervals: NewInterval[];
  userSettings: Pick<UserSettingsState, 'hoursInWeek'>;
  timestamp: number;
  now: number;
}

interface DayGroup {
  total: number;
  weekDay: string;
  notWork?: boolean;
  intervals: WeekDayInterval[];
}

const WeekStats = ({
  intervals,
  timestamp,
  userSettings,
  now,
  fetchIntervalsInWeek,
}: WeekStatsProps) => {
  const intervalSum = intervals
    .map(({ startTime, endTime }) => (endTime || now) - startTime)
    .reduce((res, curr) => res + curr, 0);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <Button
          className={styles.button}
          onClick={() => fetchIntervalsInWeek(timestamp - oneWeek)}
          data-testid="prev-week-btn"
        >
          ◀︎
        </Button>
        {intervals.length ? ` v.${getWeekNumber(timestamp)} ` : ` v.${getWeekNumber(now)} `}
        <Button
          className={styles.button}
          onClick={() => fetchIntervalsInWeek(timestamp + oneWeek)}
          data-testid="next-week-btn"
        >
          ▶︎
        </Button>
      </h3>
      <div className={classNames(styles.bars)}>
        {mashUpWeekAndIntervals(intervals, timestamp, now).map((day) => (
          <WeekStatsItem key={day.weekday} {...day} />
        ))}
      </div>
      <ProgressBar progress={getHours(intervalSum)} max={userSettings.hoursInWeek} />
    </div>
  );
};

export const WeekStatsTimeWrapper = (props: Omit<WeekStatsProps, 'now'>) => (
  <WeekStats {...props} now={useNow()} />
);
export default WeekStats;

function groupByWeekDay(intervals: NewInterval[], now: number) {
  return intervals.reduce<Partial<Record<string, DayGroup>>>(
    (hashMap, { startTime, endTime, notWork, note }) => {
      const date = new Date(startTime);
      const dateString = getDate(date);
      const weekDay = getWeekday(date);
      const timespan = (endTime || now) - startTime;
      const current = hashMap[dateString] || {
        total: 0,
        weekDay,
        intervals: [],
      };

      return {
        ...hashMap,
        [dateString]: {
          ...current,
          notWork: notWork || current.notWork,
          total: current.total + timespan,
          intervals: [...current.intervals, { notWork, timespan, note }],
        },
      };
    },
    {},
  );
}

function mashUpWeekAndIntervals(intervals: NewInterval[], timestamp: number, now: number) {
  const intervalHash = groupByWeekDay(intervals, now);

  return createWorkWeek(timestamp)
    .map((day) => ({
      ...day,
      total: 0,
      ...intervalHash[day.date],
    }))
    .filter((item) => {
      if (item.isWeekEnd && item.total === 0) return false;
      return true;
    });
}
