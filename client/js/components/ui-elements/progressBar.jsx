import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const ProgressBar = ({ progress, max }) => {
  const percentage = progress / max;
  const isOvertime = percentage > 1;
  const width = !isOvertime ? `${percentage * 100}%` : `${1 / percentage * 100}%`

  return (
    <div className="progress-bar">
      <div className="progress-bar__progress" style={{ flexBasis: width }}/>
      <div className={ classNames("progress-bar__rest", { "progress-bar__overtime": isOvertime }) } />
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired
};

export default ProgressBar;
