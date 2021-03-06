import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as SpinKit from '../spinkit/spinkit.jsx';

import styles from './button.module.css';

const Button = React.forwardRef(
  (
    {
      className,
      text,
      isLoading,
      disabled,
      children,
      type = 'button',
      theme = 'default',
      block,
      ...rest
    },
    ref
  ) => {
    const classes = classNames(
      'pure-button',
      styles.button,
      styles[theme],
      { [styles.block]: block },
      className
    );

    return (
      <button ref={ref} {...rest} className={classes} type={type} disabled={disabled}>
        {text}
        {children}
        {isLoading && <SpinKit.Bounce size="15px" />}
      </button>
    );
  }
);

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
  block: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit']),
  theme: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger', 'success', 'link']),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

export default Button;
