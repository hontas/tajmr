import React, { PropTypes } from 'react';
import { getTimePartsFromElapsedTime } from '../utils/time';

const DigitalClock = ({ time }) => {
  const { hours, minutes, seconds } = getTimePartsFromElapsedTime(time);
  const timestring = `${hours}:${minutes}`;

  return (
    <div className="digital-clock">
      <time>{ timestring }</time>
    </div>
  );
};

DigitalClock.propTypes = {
  time: PropTypes.number.isRequired
};

export default DigitalClock;
