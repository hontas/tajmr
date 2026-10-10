import type { AppAction, AppState } from './app.ts';
import type { IntervalsAction, IntervalsState } from './intervals.ts';
import type { UserAction, UserState } from './user.ts';
import type { UserSettingsAction, UserSettingsState } from './userSettings.ts';

interface InitAction {
  type: '@@INIT';
}

export type Action = InitAction | AppAction | UserAction | UserSettingsAction | IntervalsAction;

export interface RootState {
  userSettings: UserSettingsState;
  intervals: IntervalsState;
  user: UserState;
  app: AppState;
}

type GetState = () => RootState;
export type Thunk<Result = void> = (dispatch: Dispatch, getState: GetState) => Result;

export interface Dispatch {
  <A extends Action>(action: A): A;
  <Result>(thunk: Thunk<Result>): Result;
}

export interface Store {
  getState: GetState;
  dispatch: Dispatch;
  subscribe: (listener: () => void) => () => boolean;
}
