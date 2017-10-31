import {
  INTERVAL_ADD,
  INTERVAL_UPDATED,
  INTERVAL_UPDATE_FAILED,
  INTERVAL_COMPLETE,
  INTERVAL_REMOVE,
  INTERVALS_REQUEST,
  INTERVALS_FETCHED,
  INTERVALS_UPDATE_TIMESTAMP,
  REQUEST_INTERVAL_UPDATE
} from '../actions/intervals';

import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT
} from '../actions/userActions';

export default function intervals(state = {
  timestamp: Date.now(),
  updatedAt: 0,
  isFetching: true,
  isSaving: false,
  items: {}
}, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
    case USER_LOGGED_OUT:
      return {
        ...state,
        updatedAt: Date.now(),
        isFetching: false,
        items: {}
      };

    case INTERVALS_UPDATE_TIMESTAMP:
      return {
        ...state,
        timestamp: action.timestamp
      };

    case INTERVALS_REQUEST:
      return {
        ...state,
        updatedAt: Date.now(),
        isFetching: true
      };

    case INTERVALS_FETCHED: {
      const items = Object.keys(action.intervals)
        .map((id) => ({ ...action.intervals[id], id }))
        .reduce((res, curr) => {
          res[curr.id] = curr;
          return res;
        }, {});
      return {
        ...state,
        isFetching: false,
        updatedAt: Date.now(),
        items
      };
    }

    case INTERVAL_ADD:
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: false,
        items: {
          ...state.items,
          [action.interval.id]: action.interval
        }
      };

    case REQUEST_INTERVAL_UPDATE:
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: true
      };

    case INTERVAL_UPDATED:
    case INTERVAL_COMPLETE: {
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: false,
        items: {
          ...state.items,
          [action.interval.id]: action.interval
        }
      };
    }

    case INTERVAL_UPDATE_FAILED:
      return {
        ...state,
        updatedAt: Date.now(),
        error: action.error,
        isSaving: false
      };

    case INTERVAL_REMOVE: {
      const copy = { ...state.items };
      delete copy[action.id];
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: false,
        items: copy
      };
    }

    default:
      return state;
  }
}
