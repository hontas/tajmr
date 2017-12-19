import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button.jsx';

import * as customPropTypes from '../../constants/propTypes';
import { updateSettings } from '../../actions/userActions';
import firebaseApi from '../../utils/firebaseApi';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSavingUserSettings: false
    };
  }

  render() {
    const { userSettings } = this.props;
    const { displayMonthReport, displayNotifications, displayPreviousIntervals, displayName } = userSettings;
    const { isSavingUserSettings } = this.state;

    return (
      <form className="pure-form pure-form-stacked user-menu">
        <fieldset>
          <legend>
            <input
              autoCapitalize="sentences"
              spellCheck="false"
              type="text"
              value={displayName}
              onChange={this.handleChange('displayName')}
              placeholder="display name"
            />
          </legend>
          <label className="pure-checkbox">Visa notifiering
            <input
              checked={displayNotifications}
              onChange={this.handleChange('displayNotifications')}
              style={{ float: 'right' }}
              type="checkbox"
            />
          </label>
          <label className="pure-checkbox">{'Visa tidigare '}
            <input
              checked={displayPreviousIntervals}
              onChange={this.handleChange('displayPreviousIntervals')}
              style={{ float: 'right' }}
              type="checkbox"
            />
          </label>
          <label className="pure-checkbox">{'Visa månadsrapport'}
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
        <button className="pure-button" onClick={firebaseApi.logout}>Logga ut</button>
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
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired,
  userSettings: customPropTypes.userSettings.isRequired
};

export default UserMenu;
