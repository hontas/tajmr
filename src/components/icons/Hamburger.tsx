import classNames from 'classnames';

import styles from './Hamburger.module.css';

const Hamburger = ({ className }: { className?: string }) => (
  <div className={classNames(styles.hamburger, className)} />
);

export default Hamburger;
