import { combineReducers } from 'redux';
import intervals from './intervals';
import { user, userSettings } from './user';

function version(state = null) {
  return state;
}

export default combineReducers({
  userSettings,
  intervals,
  version,
  user
});
