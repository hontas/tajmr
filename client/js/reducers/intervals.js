import {
  INTERVAL_ADD,
  INTERVAL_UPDATE,
  INTERVAL_UPDATED,
  INTERVAL_COMPLETE,
  INTERVAL_REMOVE,
  INTERVALS_FETCHED,
  REQUEST_INTERVALS,
  REQUEST_INTERVAL_UPDATE
} from '../actions/intervals';

function getIndexById(array, id) {
  return array.indexOf(array.find((item) => item.id === id));
}

export function intervals(state = {
    isFetching: false,
    isSaving: false,
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
        isSaving: false,
        items: [ action.interval, ...state.items ]
      });
    case REQUEST_INTERVAL_UPDATE:
      return Object.assign({}, state, {
        isSaving: true
      });
    case INTERVAL_UPDATE:
    case INTERVAL_COMPLETE:
      const updatedIndex = getIndexById(state.items, action.interval.id);
      return Object.assign({}, state, {
        isSaving: false,
        items: [ ...state.items.slice(0, updatedIndex), action.interval, ...state.items.slice(updatedIndex + 1) ]
      });
    case INTERVAL_UPDATED:
      return Object.assign({}, state, {
        isSaving: false
      });
    case INTERVAL_REMOVE:
      const deletedIndex = getIndexById(state.items, action.id);
      return Object.assign({}, state, {
        isSaving: false,
        items: [ ...state.items.slice(0, deletedIndex), ...state.items.slice(deletedIndex + 1) ]
      });
    default:
      return state;
  }
}
