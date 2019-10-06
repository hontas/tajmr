import { combineReducers } from 'redux';
import intervals from './intervals';
import user from './user';
import userSettings from './userSettings';
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
