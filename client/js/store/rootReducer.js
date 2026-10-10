import intervals from './intervals';
import user from './user';
import userSettings from './userSettings';
import app from './app';

const reducers = { userSettings, intervals, user, app };

export default function rootReducer(state = {}, action) {
  const next = {};
  let changed = false;
  Object.keys(reducers).forEach((key) => {
    next[key] = reducers[key](state[key], action);
    if (next[key] !== state[key]) changed = true;
  });
  return changed ? next : state;
}
