import React, { PropTypes } from 'react';
import Spinner from 'react-spinkit';

import Login from '../auth/login.jsx';
import UserMenu from '../user/userMenu.jsx';
import pkg from '../../../../package.json';
import { toggleDisplayNotifications } from '../../actions';

export default React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    intervals: PropTypes.shape({
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
      displayNotifications: PropTypes.bool
    }).isRequired
  },

  getInitialState() {
    return {};
  },

  render() {
    const { user, isConnected, intervals: { isSaving } } = this.props;
    const { showLogin, showUserMenu } = this.state;
    const floatLeft = { float: 'left' };

    const spinnerStyle = { color: 'gray', float: 'left', marginLeft: '1em', transform: 'scale(.75)' };

    return (
      <div className="navbar">
        <h1 className="brand">{ 'TimR' }</h1>
        <div className="version">{ `v${pkg.version}` }{ isConnected && ' connected' }</div>
        { isSaving && <Spinner noFadeIn overrideSpinnerClassName="spin-kit-spinner" spinnerName="wave" style={ spinnerStyle } /> }

        <nav style={ { display: 'inline' } }>
          <ul className="navbar-menu">
            <li style={ floatLeft }>
              { user ?
                <div className="profile"><a href="#" onClick={ this.openDialog('UserMenu') }>{ 'Meny' }</a><img alt="profile image" className="profile-image" src={ user.password.profileImageURL }/></div> :
                <a href="#" onClick={ this.openDialog('Login') }>{ 'Logga in' }</a>
              }
              { !user && showLogin && <Login /> }
              { user && showUserMenu && <UserMenu user={ user } /> }
            </li>
          </ul>
        </nav>
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
