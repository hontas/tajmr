import { USER_LOGGED_OUT } from './user';

const USER_UPDATE_SETTINGS = 'USER_UPDATE_SETTINGS';

export function updateSettings(settings) {
  return {
    type: USER_UPDATE_SETTINGS,
    settings
  };
}

const initialState = {
  updatedAt: 0,
  displayMonthReport: false,
  displayNotifications: false,
  displayPreviousIntervals: false,
  displayName: '',
  hoursInWeek: 40
};

export default function reducer(state = initialState, action) {
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
