import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const ProgressBar = ({ progress, max, inverted, onlyDelta, unit = '' }) => {
  const percentage = (progress / max).toFixed(2);
  const isOvertime = percentage > 1.00;
  const width = !isOvertime ? `${percentage * 100}%` : `${(1 / percentage) * 100}%`;
  const restWidth = !isOvertime ? `${(1 - percentage) * 100}%` : `${(1 - (1 / percentage)) * 100}%`;
  const delta = Math.abs((max - progress).toFixed(1));
  const classes = classNames('progress-bar', {
    'progress-bar--inverted': inverted,
    'progress-bar--only-delta': onlyDelta
  });

  return (
    <div className={classes}>
      <div
        style={{ flexBasis: width }}
        className="progress-bar__progress"
      />
      <div
        style={{ flexBasis: restWidth }}
        className={classNames('progress-bar__rest', { 'progress-bar__overtime': isOvertime })}
      />
      <div className="progress-bar__text">
        <span className="progress-bar__text__progress">{ `${progress.toFixed(1)} / ${max}` }</span>
        {!!delta && !onlyDelta && ' | '}
        {!!delta &&
          <span className="progress-bar__text__delta">{ `${delta}${unit}` }</span>
        }
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  inverted: PropTypes.bool,
  onlyDelta: PropTypes.bool,
  unit: PropTypes.string,
  max: PropTypes.number.isRequired
};

export default ProgressBar;
