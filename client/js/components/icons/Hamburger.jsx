import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Hamburger.css';

const Hamburger = ({ className, active }) => (
  <div className={classNames('hamburger', { 'hamburger--active': active }, className)} />
);

Hamburger.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
};

export default Hamburger;
