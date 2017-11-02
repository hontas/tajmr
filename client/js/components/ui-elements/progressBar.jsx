import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const ProgressBar = ({ progress, max }) => {
  const percentage = (progress / max).toFixed(2);
  const isOvertime = percentage > 1.00;
  const width = !isOvertime ? `${percentage * 100}%` : `${(1 / percentage) * 100}%`;
  const restWidth = !isOvertime ? `${(1 - percentage) * 100}%` : `${(1 - (1 / percentage)) * 100}%`;

  return (
    <div className="progress-bar">
      <div
        style={{ flexBasis: width }}
        className="progress-bar__progress"
      />
      <div
        style={{ flexBasis: restWidth }}
        className={classNames('progress-bar__rest', { 'progress-bar__overtime': isOvertime })}
      />
      <div className="progress-bar__text">
        { `${progress.toFixed(1)} / ${max} | ` }
        { `${(max - progress).toFixed(1)}` }
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired
};

export default ProgressBar;
