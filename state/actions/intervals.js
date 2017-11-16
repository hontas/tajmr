import firebaseApi from '../utils/firebaseApi';

export const INTERVAL_ADD = 'INTERVAL_ADD';
export const INTERVAL_UPDATED = 'INTERVAL_UPDATED';
export const INTERVAL_UPDATE_FAILED = 'INTERVAL_UPDATE_FAILED';
export const INTERVAL_COMPLETE = 'INTERVAL_COMPLETE';
export const INTERVAL_REMOVE = 'INTERVAL_REMOVE';
export const INTERVALS_REQUEST = 'INTERVALS_REQUEST';
export const INTERVALS_REQUEST_FAILED = 'INTERVALS_REQUEST_FAILED';
export const INTERVALS_FETCHED = 'INTERVALS_FETCHED';
export const INTERVALS_UPDATE_TIMESTAMP = 'INTERVALS_UPDATE_TIMESTAMP';
export const REQUEST_INTERVAL_UPDATE = 'REQUEST_INTERVAL_UPDATE';

export function intervalAdded(interval) {
  return {
    type: INTERVAL_ADD,
    interval
  };
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

function intervalsFetched(intervals) {
  return {
    type: INTERVALS_FETCHED,
    intervals
  };
}

function intervalsRequestFailed(error) {
  return {
    type: INTERVALS_REQUEST_FAILED,
    error
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

export function removeInterval(id) {
  return {
    type: INTERVAL_REMOVE,
    id
  };
}

export function attemptRemove(id) {
  return (dispatch) => {
    dispatch(requestIntervalUpdate());
    firebaseApi.removeInterval(id)
      .then(() => dispatch(removeInterval(id)));
  };
}

export function attemptUpdate(interval) {
  return (dispatch) => {
    dispatch(requestIntervalUpdate());

    // only need to handle failure here because
    // firebase fires change event that we handle
    if (!interval.id) {
      return firebaseApi.createInterval(interval)
        .catch((err) => dispatch(intervalUpdateFailed(err)));
    }

    return firebaseApi.updateInterval(interval)
      .catch((err) => dispatch(intervalUpdateFailed(err)));
  };
}

export function fetchIntervalsForUser() {
  return (dispatch) => {
    dispatch(requestIntervals());

    return firebaseApi.fetchIntervalsForUser()
      .then((intervals) => dispatch(intervalsFetched(intervals)))
      .catch((error) => dispatch(intervalsRequestFailed(error)));
  };
}
