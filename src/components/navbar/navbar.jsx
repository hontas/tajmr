import * as React from 'react';
import classNames from 'classnames';

import Button from '#/components/button/button.jsx';
import Hamburger from '#/components/icons/Hamburger.jsx';
import UserMenu from '#/components/user/userMenu.jsx';
import * as userSettingActions from '#/store/userSettings.js';
import { useDispatch, useSelector } from '#/store/useStore.jsx';
import { getDateTimeString } from '#/utils/time.js';
import * as SpinKit from '#/components/spinkit/spinkit.jsx';

import styles from './navbar.module.css';

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isFetching = useSelector((state) => state.intervals.isFetching);
  const isSaving = useSelector((state) => state.intervals.isSaving);
  const userSettings = useSelector((state) => state.userSettings);
  const appInitialized = useSelector((state) => state.app.initialized);
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
    <nav className={styles.navbar}>
      <div className={styles.inner} ref={navBarInnerRef}>
        <h1 className={styles.brand}>TajmR</h1>
        <span className={styles.version}>
          <small>{`${process.env.RELEASE} - ${getDateTimeString(process.env.BUILD_TIME)}`}</small>
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

export default Navbar;
