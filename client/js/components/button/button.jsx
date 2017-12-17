import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FadingCircle } from 'better-react-spinkit';

const Button = ({ className, text, isLoading, children, type = 'default', ...rest }) => {
  const classes = classNames('pure-button button', `button--${type}`, className);

  return (
    <button {...rest} className={classes}>
      { text }
      { children }

      { isLoading &&
        <FadingCircle className="spin-kit-spinner" color="currentColor" size={15} />
      }
    </button>
  );
};

Button.defaultProps = {
  text: null,
  children: null,
  isLoading: false
};

Button.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  type: PropTypes.oneOf(['default', 'primary']),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
};

export default Button;
