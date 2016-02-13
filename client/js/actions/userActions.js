export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const USER_UPDATE_SETTINGS = 'USER_UPDATE_SETTINGS';

export function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    user
  };
}

export function userLoggedOut() {
  return {
    type: USER_LOGGED_OUT
  };
}

export function updateSettings(settings) {
  return {
    type: USER_UPDATE_SETTINGS,
    settings
  };
}
