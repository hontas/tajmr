import React from 'react';
import { useSelector } from '#/store/useStore.tsx';

import type { Interval } from '#/utils/interValidator.ts';
import IntervalStatsItem from './intervalStatsItem.tsx';
import { getTimePartsFromElapsedTime, getWeekday, zeroPad } from '#/utils/time.ts';

interface IntervalAndDate {
  date: Date;
  weekDay: string;
  interval: number;
}

function getIntervalAndDate(interval: Interval): IntervalAndDate {
  const date = new Date(interval.startTime);
  return {
    date,
    weekDay: getWeekday(date),
    interval: (interval.endTime || Date.now()) - interval.startTime,
  };
}

function groupByDate(res: Record<string, IntervalAndDate>, curr: IntervalAndDate) {
  const key = curr.date.toLocaleDateString();
  if (res[key]) {
    res[key].interval += curr.interval;
  } else {
    res[key] = curr;
  }

  return res;
}

const IntervalStats = () => {
  const intervals = useSelector((state) => state.intervals.items);
  const dateMap = intervals.map(getIntervalAndDate).slice(0, 5).reduce(groupByDate, {});

  const intervalsDayList = Object.keys(dateMap).map((date) => {
    const { hours, minutes } = getTimePartsFromElapsedTime(dateMap[date].interval);
    const timestring = `${zeroPad(hours)}:${zeroPad(minutes)}`;
    return <IntervalStatsItem day={dateMap[date].weekDay} key={date} time={timestring} />;
  });

  return <div className="interval-stats">{intervalsDayList}</div>;
};

export default IntervalStats;
