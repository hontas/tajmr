import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT
} from '../constants';

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
