import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Button = (props) => {
  const { className, text } = props;
  const classes = classNames('pure-button button', className);

  return (
    <button { ...props } className={ classes }>{ text }</button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default Button;
