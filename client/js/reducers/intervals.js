import {
  INTERVAL_ADD,
  INTERVAL_UPDATE,
  INTERVAL_COMPLETE,
  INTERVAL_REMOVE,
  INTERVALS_FETCHED
} from '../constants';

export function intervals(state = {}, action) {
  switch (action.type) {
    case INTERVALS_FETCHED:
      return action.intervals.reduce((res, curr) => {
        res[curr.id] = curr;
        return res;
      }, {});
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
