import {
  INTERVAL_ADD,
  INTERVAL_UPDATE,
  INTERVAL_COMPLETE,
  INTERVAL_REMOVE,
  INTERVALS_FETCHED,
  REQUEST_INTERVALS
} from '../actions/intervals';

export function intervals(state = {
    isFetching: false,
    items: []
  }, action) {
  switch (action.type) {
    case REQUEST_INTERVALS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case INTERVALS_FETCHED:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.intervals,
        lastUpdated: action.receivedAt
      });
    case INTERVAL_ADD:
      return Object.assign({}, state, {
        isFetching: false,
        items: [ action.interval, ...state.items ]
      });
    case INTERVAL_UPDATE:
    case INTERVAL_COMPLETE:
      const updatedIndex = state.items.find((item) => item.id === action.interval.id);
      return Object.assign({}, state, {
        isFetching: false,
        items: [ ...state.items.slice(0, updatedIndex), action.interval, ...state.items.slice(updatedIndex + 1) ]
      });
    case INTERVAL_REMOVE:
      const deletedIndex = state.items.find((item) => item.id === action.id);
      return Object.assign({}, state, {
        isFetching: false,
        items: [ ...state.items.slice(0, deletedIndex), ...state.items.slice(deletedIndex + 1) ]
      });
    default:
      return state;
  }
}
