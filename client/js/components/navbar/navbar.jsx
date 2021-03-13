import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from '../button/button.jsx';
import Hamburger from '../icons/Hamburger.jsx';
import UserMenu from '../user/userMenu.jsx';
import * as SpinKit from '../spinkit/spinkit.jsx';
import pkg from '../../../../package.json';

class Navbar extends React.Component {
  state = { showUserMenu: false, scrollY: 0 };

  render() {
    const { showUserMenu } = this.state;
    const { user, isSaving, isFetching, appInitialized } = this.props;
    const isLoading = appInitialized && (isSaving || isFetching);

    return (
      <nav className="navbar pure-menu pure-menu-horizontal pure-menu-fixed">
        <h1 className="brand pure-menu-heading">TajmR</h1>
        <span className="version">
          {`v${pkg.version}`}
          <small>{` ${process.env.BUILD_TIME}`}</small>
        </span>
        {isLoading && (
          <div
            data-testid={isFetching ? 'loading-intervals-container' : 'saving-intervals-container'}
            className="loading-container"
          >
            <SpinKit.Wave color="currentColor" />
            <small className="loading-text">
              {isFetching ? 'Laddar intervall...' : 'Sparar...'}
            </small>
          </div>
        )}

        {user && (
          <Button
            className="navbar__menu-btn"
            data-testid="user-menu-toggle"
            onClick={this.toggleUserMenu}
          >
            <Hamburger active={showUserMenu} />
          </Button>
        )}
        {user && (
          <UserMenu
            {...this.props}
            className={classNames('navbar__user-menu', {
              'navbar__user-menu--active': showUserMenu,
            })}
          />
        )}
      </nav>
    );
  }

  toggleUserMenu = () => {
    this.setState(({ showUserMenu, scrollY }) => {
      if (showUserMenu) {
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      } else {
        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`;
      }
      return { showUserMenu: !showUserMenu, scrollY: window.scrollY };
    });
  };
}

Navbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  appInitialized: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }),
};

function mapStateToProps({ intervals, userSettings, user, app }) {
  return {
    user,
    isFetching: intervals.isFetching,
    isSaving: intervals.isSaving,
    userSettings,
    appInitialized: app.initialized,
  };
}

export default connect(mapStateToProps)(Navbar);
