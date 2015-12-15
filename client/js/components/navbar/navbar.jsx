import React, { PropTypes } from 'react';
import pkg from '../../../../package.json';

const Navbar = ({ onToggleNotifications, displayNotifications }) => {
  const floatLeft = { float: 'left' };

  return (
    <div className="navbar">
      <nav style={ { display: 'inline' } }>
        <ul style={ { display: 'inline', listStyle: 'none', padding: 0 } }>
          <li style={ floatLeft }>
            <label>
              { 'Notifications ' }
              <input onChange={ onToggleNotifications } type="checkbox" checked={ displayNotifications } />
            </label>
          </li>
        </ul>
        <div className="version">{ `v${pkg.version}` }</div>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  displayNotifications: PropTypes.bool.isRequired,
  onToggleNotifications: PropTypes.func.isRequired
};

export default Navbar;
