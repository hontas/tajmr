import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Wave } from 'better-react-spinkit';

import Button from '../button/button.jsx';
import Hamburger from '../icons/Hamburger.jsx';
import UserMenu from '../user/userMenu.jsx';
import pkg from '../../../../package.json';

const { BUILD_TIME } = process.env;
class Navbar extends React.Component {
  state = { showUserMenu: false };

  render() {
    const { showUserMenu } = this.state;
    const { user, isSaving, isFetching, appInitialized } = this.props;
    const isLoading = appInitialized && (isSaving || isFetching);

    return (
      <nav className="navbar pure-menu pure-menu-horizontal pure-menu-fixed">
        <h1 className="brand pure-menu-heading">TajmR</h1>
        <span className="version">
          {`v${pkg.version}`}
          <small>{` ${BUILD_TIME}`}</small>
        </span>
        {isLoading && (
          <div
            data-testid={isFetching ? 'loading-intervals-container' : 'saving-intervals-container'}
            className="loading-container"
          >
            <Wave color="currentColor" className="spin-kit-spinner" />
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
              'navbar__user-menu--active': showUserMenu
            })}
          />
        )}
      </nav>
    );
  }

  toggleUserMenu = () => this.setState(({ showUserMenu }) => ({ showUserMenu: !showUserMenu }));
}

Navbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  appInitialized: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  })
};

function mapStateToProps({ intervals, userSettings, user, app }) {
  return {
    user,
    isFetching: intervals.isFetching,
    isSaving: intervals.isSaving,
    userSettings,
    appInitialized: app.initialized
  };
}

export default connect(mapStateToProps)(Navbar);
