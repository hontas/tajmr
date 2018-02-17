import { combineReducers } from 'redux';
import intervals from './intervals';
import { user, userSettings } from './user';
import app from './app';

function version(state = null) {
  return state;
}

export default combineReducers({
  userSettings,
  intervals,
  version,
  user,
  app
});
