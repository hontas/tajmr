import type { UserSettingsData } from '#/utils/interValidator.ts';

import type { Action } from './types.ts';
import { USER_LOGGED_OUT } from './user.ts';

const USER_UPDATE_SETTINGS = 'USER_UPDATE_SETTINGS';

export type UserSettingsState = Required<UserSettingsData> & { updatedAt: number };

export interface UserSettingsAction {
  type: typeof USER_UPDATE_SETTINGS;
  settings: UserSettingsData | null;
}

export function updateSettings(settings: UserSettingsData | null): UserSettingsAction {
  return {
    type: USER_UPDATE_SETTINGS,
    settings,
  };
}

const initialState: UserSettingsState = {
  updatedAt: 0,
  displayMonthReport: false,
  displayNotifications: false,
  displayPreviousIntervals: false,
  displayName: '',
  hoursInWeek: 40,
};

export default function reducer(state = initialState, action: Action): UserSettingsState {
  switch (action.type) {
    case USER_UPDATE_SETTINGS:
      return {
        ...state,
        ...action.settings,
        updatedAt: Date.now(),
      };
    case USER_LOGGED_OUT:
      return {
        ...initialState,
        updatedAt: Date.now(),
      };
    default:
      return state;
  }
}
