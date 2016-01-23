import React, { PropTypes } from 'react';
import pkg from '../../../../package.json';

const Navbar = ({ onToggleNotifications, displayNotifications }) => {
  const floatLeft = { float: 'left' };

  return (
    <div className="navbar">
      <h1 className="brand">{ 'TimR' }</h1>
      <div className="version">{ `v${pkg.version}` }</div>

      <nav style={ { display: 'inline' } }>
        <ul className="navbar-menu">
          <li style={ floatLeft }>
            <label>
              { 'Notifications ' }
              <input onChange={ onToggleNotifications } type="checkbox" checked={ displayNotifications } />
            </label>
          </li>
          <li style={ floatLeft }>
            <a href="/logout">Logga ut</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  displayNotifications: PropTypes.bool.isRequired,
  onToggleNotifications: PropTypes.func.isRequired
};

export default Navbar;
