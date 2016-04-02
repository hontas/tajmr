import React from 'react';
import * as propTypes from '../../constants/propTypes';

const WeekStats = ({ intervals }) => {
  return (
    <div>
      <h3>{ 'Veckostatistik' }</h3>
      <p>{ 'Antal intervall: ' + intervals.length }</p>
    </div>
  );
};

WeekStats.propTypes = {
  intervals: propTypes.intervals.isRequired
};

export default WeekStats;
