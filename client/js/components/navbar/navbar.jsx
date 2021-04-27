import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from '../button/button.jsx';
import Hamburger from '../icons/Hamburger.jsx';
import UserMenu from '../user/userMenu.jsx';
import * as userSettingActions from '../../redux/userSettings';
import * as customPropTypes from '../../constants/propTypes';
import * as SpinKit from '../spinkit/spinkit.jsx';

import styles from './navbar.module.css';

function Navbar({ user, isSaving, isFetching, appInitialized, userSettings, dispatch }) {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const navBarInnerRef = React.useRef(null);
  const isLoading = appInitialized && (isSaving || isFetching);

  const userMenuToggle = React.useRef();
  const userMenuBackdrop = React.useRef();

  const updateSettings = (prop, value) => {
    dispatch(userSettingActions.updateSettings({ [prop]: value }));
  };

  const toggleUserMenu = () => {
    if (showUserMenu) {
      document.body.style.overflow = '';
      userMenuToggle.current.focus();
    } else {
      document.body.style.overflow = 'hidden';
      userMenuBackdrop.current.focus();
    }
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav
      className={classNames('pure-menu', 'pure-menu-horizontal', 'pure-menu-fixed', styles.navbar)}
    >
      <div className={styles.inner} ref={navBarInnerRef}>
        <h1 className={classNames('pure-menu-heading', styles.brand)}>TajmR</h1>
        <span className={styles.version}>
          <small>{`${process.env.RELEASE} - ${process.env.BUILD_TIME}`}</small>
        </span>
        {isLoading && (
          <div
            data-testid={isFetching ? 'loading-intervals-container' : 'saving-intervals-container'}
            className={styles.loadingContainer}
          >
            <SpinKit.Wave color="currentColor" />
            <small className={styles.loadingText}>
              {isFetching ? 'Laddar intervall...' : 'Sparar...'}
            </small>
          </div>
        )}

        {user && (
          <>
            <Button
              ref={userMenuToggle}
              className={styles.menuBtn}
              data-testid="user-menu-toggle"
              onClick={toggleUserMenu}
            >
              <Hamburger active={showUserMenu} />
            </Button>
            <button
              ref={userMenuBackdrop}
              className={classNames(styles.userMenuBackdrop, {
                [styles.userMenuBackdropActive]: showUserMenu,
              })}
              onClick={toggleUserMenu}
              title="Close user menu"
              aria-label="Close user menu"
            />
            <UserMenu
              user={user}
              userSettings={userSettings}
              updateSettings={updateSettings}
              className={classNames(styles.userMenu, {
                [styles.userMenuActive]: showUserMenu,
              })}
            />
          </>
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  appInitialized: PropTypes.bool.isRequired,
  userSettings: customPropTypes.userSettings.isRequired,
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
