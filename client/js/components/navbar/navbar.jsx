/* global PKG_VERSION BUILD_TIME */

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
import debounce from '../../utils/debounce';

import './navbar.css';

function Navbar({ user, isSaving, isFetching, appInitialized, userSettings, dispatch }) {
  const [menuRightPosition, setMenuRightPosition] = React.useState(0);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const navBarInnerRef = React.useRef(null);
  const isLoading = appInitialized && (isSaving || isFetching);

  const userMenuToggle = React.useRef();
  const userMenuBackdrop = React.useRef();

  React.useEffect(() => {
    const resizeHandler = debounce(() => setWindowWidth(window.innerWidth));
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  React.useEffect(() => {
    const { right } = navBarInnerRef.current?.getBoundingClientRect();
    setMenuRightPosition(windowWidth - right);
  }, [navBarInnerRef, windowWidth]);

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

  const BuildInfo = () => (
    <span className="navbar__version">
      <small>{`${process.env.RELEASE} - ${process.env.BUILD_TIME}`}</small>
    </span>
  );

  return (
    <nav
      className="navbar pure-menu pure-menu-horizontal pure-menu-fixed"
      style={{ '--user-menu-right-pos': `${menuRightPosition}px` }}
    >
      <div className="navbar__inner" ref={navBarInnerRef}>
        <h1 className="navbar__brand pure-menu-heading">TajmR</h1>
        <BuildInfo />
        {isLoading && (
          <div
            data-testid={isFetching ? 'loading-intervals-container' : 'saving-intervals-container'}
            className="navbar__loading-container"
          >
            <SpinKit.Wave color="currentColor" />
            <small className="navbar__loading-text">
              {isFetching ? 'Laddar intervall...' : 'Sparar...'}
            </small>
          </div>
        )}

        {user && (
          <>
            <Button
              ref={userMenuToggle}
              className="navbar__menu-btn"
              data-testid="user-menu-toggle"
              onClick={toggleUserMenu}
            >
              <Hamburger active={showUserMenu} />
            </Button>
            <button
              ref={userMenuBackdrop}
              className={classNames('navbar__user-menu-backdrop', {
                'navbar__user-menu-backdrop--active': showUserMenu,
              })}
              onClick={toggleUserMenu}
              title="Close user menu"
              aria-label="Close user menu"
            />
            <UserMenu
              user={user}
              userSettings={userSettings}
              updateSettings={updateSettings}
              className={classNames('navbar__user-menu', {
                'navbar__user-menu--active': showUserMenu,
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
