import firebaseApi from '../utils/firebaseApi';

export const INTERVAL_ADD = 'INTERVAL_ADD';
export const INTERVAL_UPDATED = 'INTERVAL_UPDATED';
export const INTERVAL_UPDATE_FAILED = 'INTERVAL_UPDATE_FAILED';
export const INTERVAL_COMPLETE = 'INTERVAL_COMPLETE';
export const INTERVAL_REMOVE = 'INTERVAL_REMOVE';
export const INTERVALS_REQUEST = 'INTERVALS_REQUEST';
export const INTERVALS_FETCHED = 'INTERVALS_FETCHED';
export const INTERVALS_UPDATE_TIMESTAMP = 'INTERVALS_UPDATE_TIMESTAMP';
export const REQUEST_INTERVAL_UPDATE = 'REQUEST_INTERVAL_UPDATE';
const RESET_STATE = 'INTERVAL RESET_STATE';

export function intervalAdded(interval) {
  return {
    type: INTERVAL_ADD,
    interval
  };
}

export function reset() {
  return { type: RESET_STATE };
}

export function requestIntervals() {
  return { type: INTERVALS_REQUEST };
}

export function requestIntervalUpdate() {
  return { type: REQUEST_INTERVAL_UPDATE };
}

export function intervalUpdated(interval) {
  return {
    type: INTERVAL_UPDATED,
    interval
  };
}

export function intervalsFetched(intervals) {
  return {
    type: INTERVALS_FETCHED,
    intervals
  };
}

export function updateTimestamp(timestamp) {
  return {
    type: INTERVALS_UPDATE_TIMESTAMP,
    timestamp
  };
}

export function intervalUpdateFailed(error) {
  return {
    type: INTERVAL_UPDATE_FAILED,
    error
  };
}

export function intervalRemoved(id) {
  return {
    type: INTERVAL_REMOVE,
    id
  };
}

/**
 * Thunk Actions
 */

export const attemptRemove = (id) => (dispatch) => {
  dispatch(requestIntervalUpdate());
  firebaseApi.removeInterval(id).then(() => dispatch(intervalRemoved(id)));
};

export function attemptUpdate(interval) {
  return (dispatch) => {
    dispatch(requestIntervalUpdate());

    const handleSuccess = (updatedInterval) => dispatch(intervalUpdated(updatedInterval));
    const handleFailure = (err) => dispatch(intervalUpdateFailed(err));

    // firebase also fires child_added event that we handle
    if (!interval.id) {
      return firebaseApi
        .createInterval(interval)
        .then(handleSuccess)
        .catch(handleFailure);
    }

    // firebase also fires child_changed event that we handle
    return firebaseApi
      .updateInterval(interval)
      .then(handleSuccess)
      .catch(handleFailure);
  };
}

export function fetchIntervalsForUser() {
  return (dispatch) => {
    dispatch(requestIntervals());

    return firebaseApi
      .fetchIntervalsForUser()
      .then((intervals) => dispatch(intervalsFetched(intervals)))
      .catch(() => dispatch(intervalsFetched({})));
  };
}

const initialState = {
  timestamp: Date.now(),
  updatedAt: 0,
  isFetching: true,
  isSaving: false,
  items: []
};

export default function intervalsReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_STATE:
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
        items: Object.keys(action.intervals).map((id) => ({ ...action.intervals[id], id }))
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
        items: [...state.items, action.interval]
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
