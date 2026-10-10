import intervals from './intervals.ts';
import user from './user.ts';
import userSettings from './userSettings.ts';
import app from './app.ts';
import type { Action, RootState } from './types.ts';

export default function rootReducer(state: Partial<RootState>, action: Action): RootState {
  const next: RootState = {
    userSettings: userSettings(state.userSettings, action),
    intervals: intervals(state.intervals, action),
    user: user(state.user, action),
    app: app(state.app, action),
  };
  const changed =
    next.userSettings !== state.userSettings ||
    next.intervals !== state.intervals ||
    next.user !== state.user ||
    next.app !== state.app;
  return changed ? next : (state as RootState);
}
