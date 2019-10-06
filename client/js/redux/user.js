export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

/**
 * Actions
 */

export function userLoggedOut() {
  return {
    type: USER_LOGGED_OUT
  };
}

export const userLoggedIn = (user) => ({ type: USER_LOGGED_IN, user });

/**
 * Reducer
 */

export default function reducer(state = null, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
      return action.user;
    case USER_LOGGED_OUT:
      return null;
    default:
      return state;
  }
}
