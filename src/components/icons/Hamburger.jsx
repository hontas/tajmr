import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Hamburger.module.css';

const Hamburger = ({ className, active }) => (
  <div className={classNames(styles.hamburger, { [styles.active]: active }, className)} />
);

Hamburger.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
};

export default Hamburger;
