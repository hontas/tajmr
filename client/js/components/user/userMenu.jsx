import React, { PropTypes } from 'react';

import * as propTypes from '../../constants/propTypes';
import { updateSettings } from '../../actions/userActions';
import firebaseApi from '../../utils/firebaseApi';

const UserMenu = ({ user, userSettings, dispatch }) => {
  function handleChange(prop) {
    return ({ target }) => {
      const value = target.type === 'checkbox' ? target.checked : target.value;
      dispatch(updateSettings({ [prop]: value }));
    };
  }

  function saveUserSettings() {
    firebaseApi.ref.child('users').child(user.uid).set(userSettings);
  }

  const { displayNotifications, displayPreviousIntervals } = userSettings;

  return (
    <form className="pure-form pure-form-stacked user-menu">
      <label className="pure-checkbox">{ 'Visa notifiering ' }
        <input checked={ displayNotifications } onChange={ handleChange('displayNotifications') } style={ { float: 'right' } } type="checkbox" />
      </label>
      <label className="pure-checkbox">{ 'Visa tidigare ' }
        <input checked={ displayPreviousIntervals } onChange={ handleChange('displayPreviousIntervals') } style={ { float: 'right' } } type="checkbox" />
      </label>
      <button className="pure-button pure-button-primary" onClick={ saveUserSettings }>{ 'Spara' }</button>
      <button className="pure-button" onClick={ firebaseApi.logout }>{ 'Logga ut' }</button>
    </form>
    );
};

UserMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired,
  userSettings: propTypes.userSettings.isRequired
};

export default UserMenu;
