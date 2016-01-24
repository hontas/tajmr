import React, { PropTypes } from 'react';

import pkg from '../../../../package.json';
import { toggleDisplayNotifications } from '../../actions';

export default React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
    userSettings: PropTypes.object.isRequired
  },

  render() {
    const { user, userSettings } = this.props;
    const floatLeft = { float: 'left' };

    function getUserNav() {
      if (user) {
        const name = user.username.split('@')[0];
        return <a href="/logout">{ 'Logout ' + name }</a>;
      } else {
        return <div><a href="/login">{ 'Login' }</a>{ ' | ' }<a href="/register">{ 'Register' }</a></div>;
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
                <input checked={ userSettings.displayNotifications } onChange={ this.onToggleNotifications } type="checkbox" />
              </label>
            </li>
            <li style={ floatLeft }>
              { getUserNav() }
            </li>
          </ul>
        </nav>
      </div>
    );
  },

  onToggleNotifications() {
    this.props.dispatch(toggleDisplayNotifications());
  }
});
