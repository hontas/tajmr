import React from 'react';
import classNames from 'classnames';

import { maxOneDecimal } from '#/utils/number.ts';

import styles from './progressBar.module.css';

interface ProgressBarProps {
  progress: number;
  max: number;
}

const ProgressBar = ({ progress, max }: ProgressBarProps) => {
  const percentage = Number((progress / max).toFixed(2));
  const isOvertime = percentage > 1.0;
  const width = !isOvertime ? `${percentage * 100}%` : `${(1 / percentage) * 100}%`;
  const restWidth = !isOvertime ? `${(1 - percentage) * 100}%` : `${(1 - 1 / percentage) * 100}%`;
  const progressText = [progress, max].map(maxOneDecimal).join(' / ');

  return (
    <div className={styles.container}>
      <div style={{ flexBasis: width }} className={styles.progress} />
      <div
        style={{ flexBasis: restWidth }}
        className={classNames(styles.rest, { [styles.overtime]: isOvertime })}
      />
      <div className={styles.text}>
        <span className={styles.progressText}>{progressText}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
