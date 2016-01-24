import React, { PropTypes } from 'react';
import pkg from '../../../../package.json';

const Navbar = ({ onToggleNotifications, user, userSettings }) => {
  const floatLeft = { float: 'left' };

  function getUserNav() {
    if (user) {
      const name = user.username.split('@')[0];
      return <a href="/logout">{ 'Logout ' + name }</a>;
    } else {
      return <div><a href="/login">Login</a>{ ' | ' }<a href="/register">Register</a></div>;
    }
  }

  return (
    <div className="navbar">
      <h1 className="brand">{ 'TimR' }</h1>
      <div className="version">{ `v${pkg.version}` }</div>

      <nav style={ { display: 'inline' } }>
        <ul className="navbar-menu">
          <li style={ floatLeft }>
            <label>
              { 'Notifications ' }
              <input onChange={ onToggleNotifications } type="checkbox" checked={ userSettings.displayNotifications } />
            </label>
          </li>
          <li style={ floatLeft }>
            { getUserNav() }
          </li>
        </ul>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  onToggleNotifications: PropTypes.func.isRequired,
  userSettings: PropTypes.object.isRequired
};

export default Navbar;
