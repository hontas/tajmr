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
    <ul className="list-menu user-menu">
      <li>
        <label>{ 'Display name ' }
          <input value={ displayName } onChange={ handleChange('displayName') } />
        </label>
      </li>
      <li>
        <label>{ 'Notifications ' }
          <input checked={ displayNotifications } onChange={ handleChange('displayNotifications') } style={ { float: 'right' } } type="checkbox" />
        </label>
      </li>
      <li>
        <button onClick={ saveUserSettings }>{ 'Spara' }</button>
      </li>
      <li>
        <button onClick={ firebaseApi.logout }>{ 'Logga ut' }</button>
      </li>
    </ul>
    );
};

export default UserMenu;
