import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  USER_UPDATE_SETTINGS
} from '../actions/userActions';

export function user(state = null, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      return action.user;
    case USER_LOGGED_OUT:
      return null;
    default:
      return state;
  }
}

export function userSettings(state = {}, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {
        displayNotifications: true,
        displayPreviousIntervals: true
      };
    case USER_UPDATE_SETTINGS:
      return { ...state, ...action.settings };
    case USER_LOGGED_OUT:
      return {};
    default:
      return state;
  }
}
