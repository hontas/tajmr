import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Wave } from 'better-react-spinkit';
import classNames from 'classnames';

import Login from '../auth/login.jsx';
import UserMenu from '../user/userMenu.jsx';
import pkg from '../../../../package.json';
import { toggleDisplayNotifications } from '../../actions';

const Navbar = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      uid: PropTypes.string.isRequired,
      password: PropTypes.shape({
        profileImageURL: PropTypes.string.isRequired
      }).isRequired
    })
  },

  getInitialState() {
    return {};
  },

  render() {
    const { user, isSaving, isFetching } = this.props;
    const { showLogin, showUserMenu } = this.state;
    const isLoading = isSaving || isFetching;

    const loginMenuClasses = classNames('pure-menu-item pure-menu-has-children', { 'pure-menu-active': !user && showLogin });
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
              <a className="pure-menu-link" href="#" onClick={ this.openDialog('Login') }>{ 'Logga in' }</a>
              <ul className="pure-menu-children">
                  <li className="pure-menu-item">
                    <Login />
                  </li>
              </ul>
            </li>
            :
            <li className={ userMenuClasses }>
              <a className="pure-menu-link" href="#" onClick={ this.openDialog('UserMenu') }>{ 'Inställningar' }</a>
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

function mapStateToProps({ intervals, userSettings, user }) {
  return {
    user,
    isFetching: intervals.isFetching,
    isSaving: intervals.isSaving,
    activeInterval: intervals.items.find((interval) => !interval.endTime),
    userSettings
  };
}

export default connect(mapStateToProps)(Navbar);
