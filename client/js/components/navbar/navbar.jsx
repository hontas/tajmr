import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Wave } from 'better-react-spinkit';
import classNames from 'classnames';
import md5 from 'md5';

import Login from '../auth/login.jsx';
import UserMenu from '../user/userMenu.jsx';
import pkg from '../../../../package.json';

const garavatarUrl = 'https://www.gravatar.com/avatar';

const Navbar = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      uid: PropTypes.string.isRequired
    })
  },

  getInitialState() {
    return {};
  },

  render() {
    const { user, isSaving, isFetching } = this.props;
    const { showLoginMenu, showUserMenu } = this.state;
    const isLoading = isSaving || isFetching;
    const photoURL = user && (user.photoURL  || `${garavatarUrl}/${md5(user.email)}`);

    const loginMenuClasses = classNames('pure-menu-item pure-menu-has-children', { 'pure-menu-active': !user && showLoginMenu });
    const userMenuClasses = classNames('pure-menu-item pure-menu-has-children', { 'pure-menu-active': user && showUserMenu });

    return (
      <div className="navbar pure-menu pure-menu-horizontal pure-menu-fixed">
        <h1 className="brand pure-menu-heading">{ 'TajmR' }</h1>
        <span className="version">{ `v${pkg.version}` }</span>
        { isLoading &&
          <div style={ { color: 'gray', display: 'inline-block', marginLeft: '1em' } }>
            <Wave color="currentColor" className="spin-kit-spinner" />
            <small style={ { verticalAlign: 'middle' } }>{ isFetching ? 'Laddar intervall...' : 'Sparar...' }</small>
          </div>
        }

        <ul className="navbar-menu pure-menu-list">
          { !user ?
            <li className={ loginMenuClasses }>
              <a className="pure-menu-link" href="#" onClick={ this.toggleLoginDialog }>{ 'Logga in' }</a>
              <ul className="pure-menu-children">
                  <li className="pure-menu-item">
                    <Login />
                  </li>
              </ul>
            </li>
            :
            <li className={ userMenuClasses }>
              <a className="pure-menu-link" href="#" onClick={ this.toggleUserDialog }>{ 'Inställningar' }</a>
              <ul className="pure-menu-children">
                <li className="pure-menu-item">
                  <UserMenu { ...this.props } onClose={ this.toggleUserDialog }/>
                </li>
              </ul>
            </li>
          }
          { user && <img alt="profile image" className="profile-image" src={ photoURL }/> }
        </ul>
      </div>
    );
  },

  toggleUserDialog(evt) {
    const key = 'showUserMenu';
    if (evt) evt.preventDefault();
    this.replaceState({ [key]: !this.state[key] });
  },

  toggleLoginDialog(evt) {
    const key = 'showLoginMenu';
    if (evt) evt.preventDefault();
    this.replaceState({ [key]: !this.state[key] });
  }
});

function mapStateToProps({ intervals, userSettings, user }) {
  return {
    user,
    isFetching: intervals.isFetching,
    isSaving: intervals.isSaving,
    userSettings
  };
}

export default connect(mapStateToProps)(Navbar);
