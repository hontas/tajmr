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

const initialState = {
  updatedAt: 0,
  displayNotifications: false,
  displayPreviousIntervals: false,
  displayName: '',
  hoursInWeek: 40
};
export function userSettings(state = initialState, action) {
  switch (action.type) {
    case USER_UPDATE_SETTINGS:
      return {
        ...state,
        ...action.settings,
        updatedAt: Date.now()
      };
    case USER_LOGGED_OUT:
      return {
        ...initialState,
        updatedAt: Date.now()
      };
    default:
      return state;
  }
}