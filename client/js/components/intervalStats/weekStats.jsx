import React from 'react';
import * as propTypes from '../../constants/propTypes';
import { getWeekday, weekDays, getTimePartsFromElapsedTime, zeroPad } from '../../utils/time';

function groupByWeekDay(map, interval) {
  const date = new Date(interval.startTime);
  const weekDay = getWeekday(date);
  if (!map[weekDay]) {
    map[weekDay] = { total: 0, date: `${date.getDate()}/${date.getMonth() + 1}` };
  }
  map[weekDay].total += (interval.endTime - interval.startTime);
  return map;
}

const WeekStats = ({ intervals }) => {
  const grouped = intervals
    .reduce(groupByWeekDay, {});

  return (
    <div className="week-stats">
      <h3>{ 'Veckostatistik' }</h3>
      <div className="flex-container">
        { weekDays.slice(1, 6).map((day) => {
            const oneDay = grouped[day] || { total: 0 };
            const { hours, minutes } = getTimePartsFromElapsedTime(oneDay.total);
            const totalTime = (hours + (minutes / 60)) * 10; // 10 hours = 100px;
            const style = {
              background: 'rgba(255, 255, 255, .5)',
              height: `${totalTime}px`,
              lineHeight: `${totalTime}px`
            };
            return (
              <div className="flex-item center" key={ day } style={ { alignSelf: 'flex-end' } }>
                { !!oneDay.total && <div style={ style }>{ `${hours}:${zeroPad(minutes)}` }</div> }
                <p>{ `${day} ${oneDay.date || ''}` }</p>
              </div>
            );
           }) }
      </div>
    </div>
  );
};

WeekStats.propTypes = {
  intervals: propTypes.intervals.isRequired
};

export default WeekStats;
