import React from 'react';
import firebaseApi from '../../utils/firebaseApi';

const UserMenu = ({ user }) => {
  return (
    <ul className="list-menu">
      <li>
        <label>{ 'Notifications ' }
          <input checked={ user.displayNotifications } type="checkbox" />
        </label>
      </li>
      <li><a href="#" onClick={ firebaseApi.logout }>{ 'Logga ut' }</a></li>
    </ul>
    );
};

export default UserMenu;
