import {
  INTERVAL_ADD,
  INTERVAL_UPDATED,
  INTERVAL_UPDATE_FAILED,
  INTERVAL_COMPLETE,
  INTERVAL_REMOVE,
  INTERVALS_REQUEST,
  INTERVALS_FETCHED,
  REQUEST_INTERVAL_UPDATE
} from '../actions/intervals';

import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT
} from '../actions/userActions';

export function intervals(state = {
    isFetching: false,
    isSaving: false,
    items: {}
  }, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
    case USER_LOGGED_OUT:
      return Object.assign({}, state, {
        items: {}
      });

    case INTERVALS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });

    case INTERVALS_FETCHED: {
      const items = Object.keys(action.intervals)
        .map((id) => ({ ...action.intervals[id], id }))
        .reduce((res, curr) => {
          res[curr.id] = curr;
          return res;
        }, {});
      return {
        ...state,
        items
      };
    }

    case INTERVAL_ADD:
      return Object.assign({}, state, {
        isSaving: false,
        items: {
          ...state.items,
          [action.interval.id]: action.interval
        }
      });

    case REQUEST_INTERVAL_UPDATE:
      return Object.assign({}, state, {
        isSaving: true
      });

    case INTERVAL_UPDATED:
    case INTERVAL_COMPLETE: {
      return Object.assign({}, state, {
        isSaving: false,
        items: {
          ...state.items,
          [action.interval.id]: action.interval
        }
      });
    }

    case INTERVAL_UPDATE_FAILED:
      return Object.assign({}, state, {
        error: action.error,
        isSaving: false
      });

    case INTERVAL_REMOVE: {
      const copy = { ...state.items };
      delete copy[action.id];
      return Object.assign({}, state, {
        isSaving: false,
        items: copy
      });
    }

    default:
      return state;
  }
}
