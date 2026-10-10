import React from 'react';

import ProgressBar from '#/components/ui-elements/progressBar.tsx';
import { oneHour, getMonth, getWorkDaysInMonth } from '#/utils/time.ts';
import type { NewInterval } from '#/utils/interValidator.ts';
import { getIntervalSum } from '#/utils/intervals.ts';

import styles from './monthStats.module.css';

interface MonthStatsProps {
  hoursPerWeek?: number;
  monthIntervals: NewInterval[];
  timestamp: number;
}

const MonthStats = ({ hoursPerWeek = 40, monthIntervals, timestamp }: MonthStatsProps) => {
  const month = getMonth(timestamp);
  const workedHoursInMonth = getIntervalSum(monthIntervals) / oneHour;
  const totalWorkHoursInMonth = (hoursPerWeek / 5) * getWorkDaysInMonth(month);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Månad</h3>
      <ProgressBar progress={workedHoursInMonth} max={totalWorkHoursInMonth} />
    </div>
  );
};

export default MonthStats;
