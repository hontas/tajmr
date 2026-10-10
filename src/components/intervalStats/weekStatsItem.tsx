import React from 'react';
import classNames from 'classnames';

import { getHours, getDurationString } from '#/utils/time.ts';

import styles from './weekStatsItem.module.css';

export interface WeekDayInterval {
  timespan: number;
  note?: string;
  notWork?: boolean;
}

interface WeekDayItemProps {
  weekday: string;
  total?: number;
  date: string;
  intervals?: WeekDayInterval[];
}

const emptyIntervals: WeekDayInterval[] = [];

const WeekDayItem = ({
  weekday,
  total = 0,
  date,
  intervals = emptyIntervals,
}: WeekDayItemProps) => {
  // 10 hours = 100px; minimum 20px
  const barHeight = total > 0 ? Math.max(getHours(total) * 10, 20) : 0;
  const style = {
    height: `${barHeight}px`,
  };

  return (
    <div className={styles.container}>
      <div className={styles.bar} style={style} tabIndex={-1} data-testid="week-stats-item">
        {intervals.map(({ timespan, note, notWork }) => {
          const flexBasis = Math.round((timespan / total) * barHeight * 2) / 2;

          return (
            <div
              className={classNames(styles.item, { [styles.notWork]: notWork })}
              style={{ flexBasis: `${flexBasis}px` }}
              key={timespan}
            >
              <p className={styles.info}>{`${getDurationString(timespan)} ${note}`}</p>
            </div>
          );
        })}
        {total > 0 && (
          <p className={styles.total} style={{ lineHeight: `${barHeight}px` }}>
            {getDurationString(total)}
          </p>
        )}
      </div>
      <p>
        <span>{weekday}</span>
        <br />
        <span>{date}</span>
      </p>
    </div>
  );
};

export default WeekDayItem;
