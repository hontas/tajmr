import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FadingCircle } from 'better-react-spinkit';

const Button = ({ className, text, isLoading, ...rest }) => {
  const classes = classNames('pure-button button', className);

  return (
    <button { ...rest } className={ classes }>
      { text }

      { isLoading &&
        <FadingCircle className="spin-kit-spinner" color="currentColor" size={ 15 } />
      }
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default Button;
