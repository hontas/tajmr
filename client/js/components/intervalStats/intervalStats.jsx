import React, { PropTypes } from 'react';
import { getTimePartsFromElapsedTime, zeroPad } from '../../utils/time';

const weekDays = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
const today = new Date();
today.setDate(today.getDate() - 7);
const aWeekBack = today.valueOf();
const byOneWeekBack = (interval) => interval.startTime > aWeekBack;
const getDayInterval = (interval) => ({
  date: new Date(interval.startTime),
  weekDay: weekDays[new Date(interval.startTime).getDay()],
  interval: (interval.endTime || Date.now()) - interval.startTime
});
const collectByDate = (res, curr) => {
  const key = curr.date.toLocaleDateString();
  if (res[key]) {
    res[key].interval += curr.interval;
  } else {
    res[key] = curr;
  }

  return res;
};

const IntervalStats = ({ intervals }) => {
  const dateMap = intervals
    .filter(byOneWeekBack)
    .map(getDayInterval)
    .reduce(collectByDate, {});

  const intervalsDayList = Object.keys(dateMap)
    .map((date) => {
      const { hours, minutes } = getTimePartsFromElapsedTime(dateMap[date].interval);
      const timestring = `${zeroPad(hours)}:${zeroPad(minutes)}`;
      return <li key={ date }>{ dateMap[date].weekDay }{ ' - ' }{ timestring }</li>;
    });

  return (
    <ul>
      { intervalsDayList }
    </ul>
  );
};

IntervalStats.propTypes = {
  intervals: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default IntervalStats;
