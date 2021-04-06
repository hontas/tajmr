import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as SpinKit from '../spinkit/spinkit.jsx';

const Button = ({
  className,
  text,
  isLoading,
  disabled,
  children,
  type = 'button',
  theme = 'default',
  ...rest
}) => {
  const classes = classNames('pure-button button', `button--${theme}`, className);

  return (
    <button {...rest} className={classes} type={type} disabled={disabled}>
      {text}
      {children}
      {isLoading && <SpinKit.Bounce size="15px" />}
    </button>
  );
};

Button.defaultProps = {
  text: null,
  children: null,
  isLoading: false,
};

Button.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit']),
  theme: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger', 'success', 'link']),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

export default Button;
