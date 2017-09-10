import React from 'react';
import PropTypes from 'prop-types';

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
