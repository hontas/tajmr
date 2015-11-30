import React, { PropTypes } from 'react';

const Button = ({ onClick, text }) => {
  return (
    <button className="button" onClick={ onClick }>{ text }</button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default Button;
