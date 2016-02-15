import React from 'react';

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
    console.log(user.uid);
    firebaseApi.ref.child('users').child(user.uid).set(userSettings);
  }

  const { displayName, displayNotifications } = userSettings;

  return (
    <form className="pure-form pure-form-stacked user-menu">
      <label>{ 'Display name ' }
        <input value={ displayName } onChange={ handleChange('displayName') } />
      </label>
      <label className="pure-checkbox">{ 'Notifications ' }
        <input checked={ displayNotifications } onChange={ handleChange('displayNotifications') } style={ { float: 'right' } } type="checkbox" />
      </label>
      <button className="pure-button pure-button-primary" onClick={ saveUserSettings }>{ 'Spara' }</button>
      <button className="pure-button" onClick={ firebaseApi.logout }>{ 'Logga ut' }</button>
    </form>
    );
};

export default UserMenu;
