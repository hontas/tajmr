import React, { PropTypes } from 'react';
import Spinner from 'react-spinkit';
import classNames from 'classnames';

import Login from '../auth/login.jsx';
import UserMenu from '../user/userMenu.jsx';
import pkg from '../../../../package.json';
import { toggleDisplayNotifications } from '../../actions';

export default React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    intervals: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      isSaving: PropTypes.bool.isRequired
    }).isRequired,
    isConnected: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      uid: PropTypes.string.isRequired,
      password: PropTypes.shape({
        email: PropTypes.string.isRequired,
        profileImageURL: PropTypes.string.isRequired
      }).isRequired
    }),
    userSettings: PropTypes.shape({
      firstName: PropTypes.string,
      displayNotifications: PropTypes.bool
    }).isRequired
  },

  getInitialState() {
    return {};
  },

  render() {
    const { user, userSettings, isConnected, intervals: { isSaving, isFetching } } = this.props;
    const { showLogin, showUserMenu } = this.state;
    const isLoading = isSaving || isFetching;

    const spinnerStyle = { transform: 'scale(.75)' };
    const loginMenuClasses = classNames('pure-menu-item pure-menu-has-children', { 'pure-menu-active': !user && showLogin });
    const userMenuClasses = classNames('pure-menu-item pure-menu-has-children', { 'pure-menu-active': user && showUserMenu });

    return (
      <div className="navbar pure-menu pure-menu-horizontal pure-menu-fixed">
        <h1 className="brand pure-menu-heading">{ 'TimR' }</h1>
        <span className="version">{ `v${pkg.version}` }</span>
        { isLoading &&
          <div style={ { color: 'gray', display: 'inline-block', marginLeft: '1em' } }>
            <Spinner noFadeIn overrideSpinnerClassName="spin-kit-spinner" spinnerName="wave" />
            <small style={ { verticalAlign: 'middle' } }>{ isFetching ? 'Laddar intervall...' : 'Sparar...' }</small>
          </div>
        }

        <ul className="navbar-menu pure-menu-list">
          { !user ?
            <li className={ loginMenuClasses }>
              <a href="#" className="pure-menu-link" onClick={ this.openDialog('Login') }>{ 'Logga in' }</a>
              <ul className="pure-menu-children">
                  <li className="pure-menu-item">
                    <Login />
                  </li>
              </ul>
            </li>
            :
            <li className={ userMenuClasses }>
              <a href="#" className="pure-menu-link" onClick={ this.openDialog('UserMenu') }>{ 'Inställningar' }</a>
              <ul className="pure-menu-children">
                <li className="pure-menu-item">
                  <UserMenu { ...this.props } />
                </li>
              </ul>
            </li>
          }
          { user && <img alt="profile image" className="profile-image" src={ user.password.profileImageURL }/> }
        </ul>
      </div>
    );
  },

  openDialog(dialog) {
    const key = `show${dialog}`;
    return (evt) => {
      evt.preventDefault();
      this.replaceState({ [key]: !this.state[key] });
    };
  },

  onToggleNotifications() {
    this.props.dispatch(toggleDisplayNotifications());
  }
});
