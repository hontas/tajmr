import { CONNECTED } from '../constants';
import { combineReducers } from 'redux';
import { intervals } from './intervals';
import { user, userSettings } from './user';

function version(state = null) {
  return state;
}

function isConnected(state = false, { type, value }) {
  switch (type) {
    case CONNECTED:
      return value;
    default:
      return state;
  }
}

export default combineReducers({
  userSettings,
  isConnected,
  intervals,
  version,
  user
});
