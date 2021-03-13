import * as React from 'react';
import PropTypes from 'prop-types';
import 'spinkit/spinkit.min.css';

export function Wave({ className = '', color = 'currentColor', size = '1em' }) {
  return (
    <div className={`sk-wave ${className}`} style={{ '--sk-color': color, '--sk-size': size }}>
      <div className="sk-wave-rect" />
      <div className="sk-wave-rect" />
      <div className="sk-wave-rect" />
      <div className="sk-wave-rect" />
      <div className="sk-wave-rect" />
    </div>
  );
}

export function FadingCircle({ className = '', color = 'currentColor', size = '1em' }) {
  return (
    <div
      className={`sk-circle-fade ${className}`}
      style={{ '--sk-color': color, '--sk-size': size }}
    >
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
      <div className="sk-circle-fade-dot" />
    </div>
  );
}

export function Bounce({ className = '', color = 'currentColor', size = '1em' }) {
  return (
    <div className={`sk-bounce ${className}`} style={{ '--sk-color': color, '--sk-size': size }}>
      <div className="sk-bounce-dot" />
      <div className="sk-bounce-dot" />
    </div>
  );
}

const SpinKitPropTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
};

Wave.propTypes = SpinKitPropTypes;
Bounce.propTypes = SpinKitPropTypes;
FadingCircle.propTypes = SpinKitPropTypes;
