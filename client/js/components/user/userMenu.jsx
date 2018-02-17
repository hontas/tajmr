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
    isSavingUserSettings: false
  };

  render() {
    const { userSettings, user, className } = this.props;
    const { displayMonthReport, displayNotifications, displayPreviousIntervals } = userSettings;
    const { isSavingUserSettings } = this.state;
    const photoURL = user && (user.photoURL || `${garavatarUrl}/${md5(user.email)}`);

    return (
      <form className={classNames('pure-form pure-form-stacked user-menu', className)}>
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
        </fieldset>
        <Button
          className="pure-button-primary"
          isLoading={isSavingUserSettings}
          onClick={this.saveUserSettings}
          text="Spara"
        />
      </form>
    );
  }

  handleChange(prop) {
    const { dispatch } = this.props;

    return ({ target }) => {
      const value = target.type === 'checkbox' ? target.checked : target.value;
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
