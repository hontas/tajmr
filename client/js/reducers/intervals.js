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

const initialState = {
  timestamp: Date.now(),
  updatedAt: 0,
  isFetching: true,
  isSaving: false,
  items: []
};

export default function intervals(state = initialState, action) {
  switch (action.type) {
    case USER_LOGGED_IN:
    case USER_LOGGED_OUT:
      return {
        ...state,
        updatedAt: Date.now(),
        isFetching: false,
        items: []
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
      return {
        ...state,
        isFetching: false,
        updatedAt: Date.now(),
        items: Object.keys(action.intervals)
          .map((id) => ({ ...action.intervals[id], id }))
      };
    }

    case REQUEST_INTERVAL_UPDATE:
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: true
      };

    case INTERVAL_ADD:
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: false,
        items: [
          ...state.items,
          action.interval
        ]
      };

    case INTERVAL_UPDATED:
    case INTERVAL_COMPLETE: {
      const items = state.items.filter(({ id }) => action.interval.id !== id);
      items.push(action.interval);
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: false,
        items
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
      return {
        ...state,
        updatedAt: Date.now(),
        isSaving: false,
        items: state.items.filter(({ id }) => action.id !== id)
      };
    }

    default:
      return state;
  }
}
