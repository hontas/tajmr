import md5 from 'md5';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/button.jsx';

import * as customPropTypes from '../../constants/propTypes';
import { updateSettings } from '../../actions/userActions';
import firebaseApi from '../../utils/firebaseApi';

const garavatarUrl = 'https://www.gravatar.com/avatar';

class UserMenu extends React.Component {
  state = {
    isSavingUserSettings: false,
    isSavingUserPassword: false,
    updatePasswordError: null,
    updatePasswordSuccess: false
  };

  render() {
    const { userSettings, user, className } = this.props;
    const { displayMonthReport, displayNotifications, displayPreviousIntervals, hoursInWeek } = userSettings;
    const { isSavingUserSettings, isSavingUserPassword, updatePasswordError, updatePasswordSuccess } = this.state;
    const photoURL = user && (user.photoURL || `${garavatarUrl}/${md5(user.email)}`);

    return (
      <form className={classNames('pure-form pure-form-stacked user-menu', className)} onSubmit={this.preventDefault}>
        <div className="user-menu__row">
          <img alt="avatar" className="profile-image" src={photoURL} />
          <button className="user-menu__log-out pure-menu-link" onClick={firebaseApi.logout}>Logga ut</button>
        </div>
        <fieldset className="user-menu__fieldset">
          <label className="user-menu__label">Visa notifiering
            <input
              checked={displayNotifications}
              onChange={this.handleChange('displayNotifications')}
              style={{ float: 'right' }}
              type="checkbox"
            />
          </label>
          <label className="user-menu__label">{'Visa tidigare '}
            <input
              checked={displayPreviousIntervals}
              onChange={this.handleChange('displayPreviousIntervals')}
              style={{ float: 'right' }}
              type="checkbox"
            />
          </label>
          <label className="user-menu__label">{'Visa månadsrapport'}
            <input
              checked={displayMonthReport}
              onChange={this.handleChange('displayMonthReport')}
              style={{ float: 'right' }}
              type="checkbox"
            />
          </label>
          <label className="user-menu__label">{'Full arbetsvecka (h)'}
            <input
              value={hoursInWeek}
              onChange={this.handleChange('hoursInWeek', Number)}
              style={{ float: 'right' }}
              type="number"
            />
          </label>
        </fieldset>
        <Button
          className="pure-button-primary"
          isLoading={isSavingUserSettings}
          onClick={this.saveUserSettings}
          text="Spara inställningar"
        />
        <fieldset className="user-menu__fieldset">
          {updatePasswordError &&
            <p style={{ whiteSpace: 'normal' }}>
              {updatePasswordError}
            </p>
          }
          <div className="user-menu__change-pass pure-button-group">
            <label htmlFor="oldPassword">
              <input
                onKeyDown={this.preventDefault}
                autoComplete="old-password"
                className="user-menu__change-pass__input"
                ref={(node) => { this.oldPass = node; }}
                type="password"
                placeholder="Nuvarande lösenord"
                id="oldPassword"
              />
            </label>
            <label htmlFor="newPassword">
              <input
                onKeyDown={this.preventDefault}
                autoComplete="new-password"
                className="user-menu__change-pass__input"
                ref={(node) => { this.newPass = node; }}
                type="password"
                placeholder="Nytt lösenord"
                id="newPassword"
              />
            </label>
            <Button
              theme={updatePasswordSuccess ? 'success' : 'default'}
              className="user-menu__change-pass__btn pure-button-primary"
              isLoading={isSavingUserPassword}
              onClick={this.updateUserPassword}
              text={updatePasswordSuccess ? '👍' : 'Ändra'}
            />
          </div>
        </fieldset>
      </form>
    );
  }

  preventDefault = (evt) => {
    if (evt.type === 'keydown' && evt.key !== 'Enter') return;
    evt.preventDefault();
  }

  updateUserPassword = (evt) => {
    evt.preventDefault();
    const oldPass = this.oldPass.value;
    const newPass = this.newPass.value;
    this.setState({ isSavingUserPassword: true });

    const handleResponse = ({ message }) => this.setState({
      isSavingUserPassword: false,
      updatePasswordError: message,
      updatePasswordSuccess: !message
    });

    firebaseApi.updateUserPassword(oldPass, newPass)
      .then(() => {
        handleResponse({ message: '' });
        setTimeout(() => this.setState({ updatePasswordSuccess: false }), 2000);
        this.oldPass.value = '';
        this.newPass.value = '';
      })
      .catch(handleResponse);
  }

  handleChange(prop, transform = (x) => x) {
    const { dispatch } = this.props;

    return ({ target }) => {
      const value = target.type === 'checkbox' ? target.checked : transform(target.value);
      dispatch(updateSettings({ [prop]: value }));
    };
  }

  saveUserSettings = (evt) => {
    evt.preventDefault();
    const { user, userSettings } = this.props;
    this.setState({ isSavingUserSettings: true });

    firebaseApi.saveUserData(user.uid, userSettings)
      .then(() => {
        this.setState({ isSavingUserSettings: false });
      });
  }
}

UserMenu.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }),
  userSettings: customPropTypes.userSettings.isRequired
};

export default UserMenu;
