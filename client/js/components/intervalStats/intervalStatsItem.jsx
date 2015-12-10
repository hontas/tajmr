import React from 'react';

export default ({ day, time }) => {
  return (
    <div className="interval-stats-item">
      <h4>{ day }</h4>
      <p>{ time }</p>
    </div>
  );
};
