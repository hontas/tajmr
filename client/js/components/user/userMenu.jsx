import md5 from 'md5';
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/button.jsx';

import * as customPropTypes from '../../constants/propTypes';
import firebaseApi from '../../utils/firebaseApi';

import styles from './userMenu.module.css';

const garavatarUrl = 'https://www.gravatar.com/avatar';

const preventDefault = (evt) => {
  if (evt.type === 'keydown' && evt.key !== 'Enter') return;
  evt.preventDefault();
};

const UserMenu = ({ userSettings, user, className, updateSettings }) => {
  const { displayMonthReport, displayNotifications, displayPreviousIntervals, hoursInWeek } =
    userSettings;
  const [isSavingUserSettings, setIsSavingUserSettings] = useState(false);
  const [isSavingUserPassword, setIsSavingUserPassword] = useState(false);
  const [updatePasswordError, setUpdatePasswordError] = useState(null);
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false);
  const oldPass = useRef(null);
  const newPass = useRef(null);
  const photoURL = user && (user.photoURL || `${garavatarUrl}/${md5(user.email)}`);

  const handleChange =
    (prop, transform = (x) => x) =>
    ({ target }) => {
      const value = target.type === 'checkbox' ? target.checked : transform(target.value);
      updateSettings(prop, value);
    };

  const saveUserSettings = (evt) => {
    evt.preventDefault();
    setIsSavingUserSettings(true);

    firebaseApi.saveUserData(user.uid, userSettings).then(() => {
      setIsSavingUserSettings(false);
    });
  };

  const updateUserPassword = (evt) => {
    evt.preventDefault();
    setIsSavingUserPassword(true);

    const handleResponse = ({ message }) => {
      setIsSavingUserPassword(false);
      setUpdatePasswordError(message);
      setUpdatePasswordSuccess(!message);
    };

    firebaseApi
      .updateUserPassword(oldPass.current.value, newPass.current.value)
      .then(() => {
        handleResponse({ message: '' });
        setTimeout(() => setUpdatePasswordSuccess(false), 2000);
        oldPass.current.value = '';
        newPass.current.value = '';
      })
      .catch(handleResponse);
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

UserMenu.propTypes = {
  className: PropTypes.string,
  updateSettings: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    photoURL: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
  userSettings: customPropTypes.userSettings.isRequired,
};

export default UserMenu;
