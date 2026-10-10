import type { User } from 'firebase/auth';

import type { Action } from './types.ts';

const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export type AppUser = Pick<User, 'uid' | 'email' | 'photoURL'>;

export type UserState = AppUser | null;

export type UserAction =
  | { type: typeof USER_LOGGED_IN; user: AppUser }
  | { type: typeof USER_LOGGED_OUT };

/**
 * Actions
 */

export function userLoggedOut(): UserAction {
  return {
    type: USER_LOGGED_OUT,
  };
}

export const userLoggedIn = (user: AppUser): UserAction => ({ type: USER_LOGGED_IN, user });

/**
 * Reducer
 */

export default function reducer(state: UserState = null, action: Action): UserState {
  switch (action.type) {
    case USER_LOGGED_IN:
      return action.user;
    case USER_LOGGED_OUT:
      return null;
    default:
      return state;
  }
}
