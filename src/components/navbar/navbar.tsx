import { useRef } from 'react';

import Button from '#/components/button/button.tsx';
import Hamburger from '#/components/icons/Hamburger.tsx';
import UserMenu from '#/components/user/userMenu.tsx';
import * as userSettingActions from '#/store/userSettings.ts';
import { useDispatch, useSelector } from '#/store/useStore.tsx';
import { getDateTimeString } from '#/utils/time.ts';
import * as SpinKit from '#/components/spinkit/spinkit.tsx';

import styles from './navbar.module.css';

const closeOnBackdropClick = (dialog: HTMLDialogElement) => {
  const close = (evt: MouseEvent) => {
    if (evt.target === dialog) dialog.close();
  };
  dialog.addEventListener('click', close);
  return () => dialog.removeEventListener('click', close);
};

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isFetching = useSelector((state) => state.intervals.isFetching);
  const isSaving = useSelector((state) => state.intervals.isSaving);
  const userSettings = useSelector((state) => state.userSettings);
  const appInitialized = useSelector((state) => state.app.initialized);
  const menu = useRef<HTMLDialogElement>(null);
  const isLoading = appInitialized && (isSaving || isFetching);

  const updateSettings = (prop: string, value: boolean | number | string) => {
    dispatch(userSettingActions.updateSettings({ [prop]: value }));
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
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
              className={styles.menuBtn}
              data-testid="user-menu-toggle"
              aria-label="Öppna menyn"
              aria-haspopup="dialog"
              onClick={() => menu.current?.showModal()}
            >
              <Hamburger />
            </Button>
            <dialog
              ref={(dialog) => {
                menu.current = dialog;
                return dialog ? closeOnBackdropClick(dialog) : undefined;
              }}
              className={styles.menu}
              aria-label="Meny"
              data-testid="user-menu-dialog"
            >
              <div className={styles.menuPanel}>
                <header className={styles.menuHeader}>
                  <h2 className={styles.menuTitle}>Meny</h2>
                  <Button
                    className={styles.closeBtn}
                    data-testid="user-menu-close"
                    aria-label="Stäng menyn"
                    onClick={() => menu.current?.close()}
                  >
                    ✕
                  </Button>
                </header>
                <UserMenu user={user} userSettings={userSettings} updateSettings={updateSettings} />
              </div>
            </dialog>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
