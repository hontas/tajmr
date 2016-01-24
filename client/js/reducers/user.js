import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  TOGGLE_DISPLAY_NOTIFICATIONS
} from '../constants';

export function user(state = {}, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      return action.user;
    case USER_LOGGED_OUT:
      return {};
    default:
      return state;
  }
}

export function userSettings(state = {}, action) {
  switch (action.type) {
    case TOGGLE_DISPLAY_NOTIFICATIONS:
      const displayNotifications = !state.displayNotifications;
      return Object.assign({}, state, { displayNotifications });
    default:
      return state;
  }
}
