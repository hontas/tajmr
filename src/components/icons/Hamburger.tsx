import classNames from 'classnames';

import styles from './Hamburger.module.css';

interface HamburgerProps {
  className?: string;
  active?: boolean;
}

const Hamburger = ({ className, active }: HamburgerProps) => (
  <div className={classNames(styles.hamburger, { [styles.active]: active }, className)} />
);

export default Hamburger;
