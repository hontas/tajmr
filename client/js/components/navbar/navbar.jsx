import React, { PropTypes } from 'react';
import Spinner from 'react-spinkit';

import pkg from '../../../../package.json';
import { toggleDisplayNotifications } from '../../actions';

export default React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    intervals: PropTypes.shape({
      isSaving: PropTypes.bool.isRequired
    }).isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired
    }),
    userSettings: PropTypes.shape({
      displayNotifications: PropTypes.bool
    }).isRequired
  },

  render() {
    const { user, userSettings, isConnected, intervals: { isSaving } } = this.props;
    const floatLeft = { float: 'left' };

    function getUserNav() {
      if (user) {
        const name = user.username.split('@')[0];
        return <a href="/logout">{ 'Logout ' + name }</a>;
      } else {
        return <div><a href="/login">{ 'Login' }</a>{ ' | ' }<a href="/register">{ 'Register' }</a></div>;
      }
    }

    const spinnerStyle = { color: 'gray', float: 'left', marginLeft: '1em', transform: 'scale(.75)' };

    return (
      <div className="navbar">
        <h1 className="brand">{ 'TimR' }</h1>
        <div className="version">{ `v${pkg.version}` }{ isConnected && ' connected' }</div>
        { isSaving && <Spinner noFadeIn overrideSpinnerClassName="spin-kit-spinner" spinnerName="wave" style={ spinnerStyle } /> }

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
