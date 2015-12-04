import React, { PropTypes } from 'react';

const Button = (props) => {
  const { className, text } = props;
  const classNames = className ? `${className} button` : 'button';

  return (
    <button { ...props } className={ classNames }>{ text }</button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default Button;
