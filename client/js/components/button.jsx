import React, { PropTypes } from 'react';

const Button = (props) => {
  const { onClick, text, className } = props;
  const classNames = className ? `${className} button` : 'button';

  return (
    <button { ...props } className={ classNames }>{ text }</button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default Button;
