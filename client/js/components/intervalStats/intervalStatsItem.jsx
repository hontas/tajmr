import React, { PropTypes } from 'react';

const IntervalStatsItem = ({ day, time }) => {
  return (
    <div className="interval-stats-item">
      <h4>{ day }</h4>
      <p>{ time }</p>
    </div>
  );
};

IntervalStatsItem.propTypes = {
  day: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
};

export default IntervalStatsItem;
