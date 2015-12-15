import { combineReducers } from 'redux';
import {
  INTERVAL_ADD,
  INTERVAL_UPDATE,
  INTERVAL_COMPLETE,
  INTERVAL_REMOVE,
  TOGGLE_DISPLAY_NOTIFICATIONS
} from '../constants';

function intervals(state = {}, action) {
  switch (action.type) {
    case INTERVAL_ADD:
    case INTERVAL_UPDATE:
    case INTERVAL_COMPLETE:
      const id = action.interval.id;
      const update = { [id]: action.interval };
      return Object.assign({}, state, update);
    case INTERVAL_REMOVE:
      const newState = Object.assign({}, state);
      delete newState[action.id];
     return newState;
    default:
      return state;
  }
}

function version(state = null) {
  return state;
}

function displayNotifications(state = true, action) {
  switch (action.type) {
    case TOGGLE_DISPLAY_NOTIFICATIONS:
      return !state;
    default:
      return state;
  }
}

export default combineReducers({
  displayNotifications,
  intervals,
  version
});
