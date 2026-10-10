import md5 from 'md5';
import {
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type KeyboardEvent,
  type SyntheticEvent,
} from 'react';
import classNames from 'classnames';
import Button from '#/components/button/button.tsx';

import type { AppUser } from '#/store/user.ts';
import type { UserSettingsState } from '#/store/userSettings.ts';
import firebaseApi from '#/utils/firebaseApi.ts';

import styles from './userMenu.module.css';

const garavatarUrl = 'https://www.gravatar.com/avatar';

const identity = <T,>(value: T) => value;

const preventDefault = (evt: SyntheticEvent) => {
  if (evt.type === 'keydown' && (evt as KeyboardEvent).key !== 'Enter') return;
  evt.preventDefault();
};

interface UserMenuProps {
  className?: string;
  updateSettings: (prop: string, value: boolean | number | string) => void;
  user: AppUser;
  userSettings: UserSettingsState;
}

const UserMenu = ({ userSettings, user, className, updateSettings }: UserMenuProps) => {
  const { displayMonthReport, displayNotifications, displayPreviousIntervals, hoursInWeek } =
    userSettings;
  const [isSavingUserSettings, startSavingUserSettings] = useTransition();
  const [isSavingUserPassword, startSavingUserPassword] = useTransition();
  const [updatePasswordError, setUpdatePasswordError] = useState<string | null>(null);
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false);
  const oldPass = useRef<HTMLInputElement>(null);
  const newPass = useRef<HTMLInputElement>(null);
  const photoURL = user && (user.photoURL || `${garavatarUrl}/${md5(user.email ?? '')}`);

  const handleChange =
    (prop: string, transform: (value: string) => string | number = identity) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      const value = target.type === 'checkbox' ? target.checked : transform(target.value);
      updateSettings(prop, value);
    };

  const saveUserSettings = (evt: SyntheticEvent) => {
    evt.preventDefault();
    startSavingUserSettings(() => firebaseApi.saveUserData(user.uid, userSettings));
  };

  const updateUserPassword = (evt: SyntheticEvent) => {
    evt.preventDefault();
    startSavingUserPassword(async () => {
      try {
        await firebaseApi.updateUserPassword(
          oldPass.current?.value ?? '',
          newPass.current?.value ?? '',
        );
        setUpdatePasswordError(null);
        setUpdatePasswordSuccess(true);
        setTimeout(() => setUpdatePasswordSuccess(false), 2000);
        if (oldPass.current) oldPass.current.value = '';
        if (newPass.current) newPass.current.value = '';
      } catch (error) {
        setUpdatePasswordError(error instanceof Error ? error.message : String(error));
        setUpdatePasswordSuccess(false);
      }
    });
  };

  return (
    <form
      data-testid="user-menu"
      className={classNames(styles.container, className)}
      onSubmit={preventDefault}
    >
      <div className={styles.row}>
        <img alt="avatar" className={styles.profileImage} src={photoURL} />
        <Button className={styles.logOut} theme="link" onClick={firebaseApi.logout}>
          Logga ut
        </Button>
      </div>
      <fieldset className={styles.fieldset}>
        <label className={styles.label}>
          Visa notifiering
          <input
            checked={displayNotifications}
            onChange={handleChange('displayNotifications')}
            style={{ float: 'right' }}
            type="checkbox"
          />
        </label>
        <label className={styles.label}>
          Visa tidigare intervall
          <input
            checked={displayPreviousIntervals}
            onChange={handleChange('displayPreviousIntervals')}
            style={{ float: 'right' }}
            type="checkbox"
          />
        </label>
        <label className={styles.label}>
          Visa månadsrapport
          <input
            checked={displayMonthReport}
            onChange={handleChange('displayMonthReport')}
            style={{ float: 'right' }}
            type="checkbox"
          />
        </label>
        <label className={styles.label}>
          Full arbetsvecka (h)
          <input
            value={hoursInWeek}
            onChange={handleChange('hoursInWeek', Number)}
            style={{ float: 'right', width: '100px' }}
            type="number"
          />
        </label>
      </fieldset>
      <Button
        theme="accent"
        isLoading={isSavingUserSettings}
        onClick={saveUserSettings}
        text="Spara inställningar"
      />
      <fieldset className={styles.fieldset}>
        {updatePasswordError && <p style={{ whiteSpace: 'normal' }}>{updatePasswordError}</p>}
        <div className={styles.changePass}>
          <div className={styles.changePassLabel}>
            <input
              onKeyDown={preventDefault}
              autoComplete="current-password"
              className={styles.changePassInput}
              ref={oldPass}
              type="password"
              placeholder="Nuvarande lösenord"
              aria-label="Nuvarande lösenord"
              id="oldPassword"
            />
          </div>
          <div className={styles.changePassLabel}>
            <input
              onKeyDown={preventDefault}
              autoComplete="new-password"
              className={styles.changePassInput}
              ref={newPass}
              type="password"
              placeholder="Nytt lösenord"
              aria-label="Nytt lösenord"
              id="newPassword"
            />
          </div>
          <Button
            theme={updatePasswordSuccess ? 'success' : 'accent'}
            className={styles.changePassBtn}
            isLoading={isSavingUserPassword}
            onClick={updateUserPassword}
            text={updatePasswordSuccess ? '👍' : 'Ändra'}
          />
        </div>
      </fieldset>
    </form>
  );
};

export default UserMenu;
