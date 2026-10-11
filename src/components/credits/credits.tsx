import classNames from 'classnames';

import GitHub from '#/components/icons/GitHub.tsx';

import styles from './credits.module.css';

const Credits = ({ className }: { className?: string }) => (
  <div className={classNames(styles.credits, className)}>
    <span>
      {'Gjord med '}
      <span className={styles.emoji}>❤</span>
      {' av '}
      <a className="animated" href="https://github.com/hontas">
        hontas
      </a>
    </span>
    <a className={styles.repo} href="https://github.com/hontas/tajmr.git" aria-label="GitHub">
      <GitHub />
      <span className={styles.repoLabel}>GitHub</span>
    </a>
  </div>
);

export default Credits;
