import cuid from 'cuid';
import * as intervalsApi from '../utils/intervalsApi';

export const INTERVAL_ADD = 'INTERVAL_ADD';
export const INTERVAL_UPDATED = 'INTERVAL_UPDATED';
export const INTERVAL_UPDATE_FAILED = 'INTERVAL_UPDATE_FAILED';
export const INTERVAL_COMPLETE = 'INTERVAL_COMPLETE';
export const INTERVAL_REMOVE = 'INTERVAL_REMOVE';
export const INTERVALS_FETCHED = 'INTERVALS_FETCHED';
export const REQUEST_INTERVALS = 'REQUEST_INTERVALS';
export const REQUEST_INTERVAL_UPDATE = 'REQUEST_INTERVAL_UPDATE';

export function addInterval(interval = {
    id: cuid(),
    startTime: Date.now()
  }) {
  return {
    type: INTERVAL_ADD,
    interval
  };
}

export function requestIntervals() {
  return { type: REQUEST_INTERVALS };
}

export function intervalsFetched(intervals) {
  return {
    type: INTERVALS_FETCHED,
    intervals
  };
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

export function intervalUpdateFailed(error) {
  return {
    type: INTERVAL_UPDATE_FAILED,
    error
  };
}

export function attemptRemove(id) {
  return (dispatch) => {
    dispatch(requestIntervalUpdate());
    intervalsApi.remove(id);
  };
}

export function removeInterval(id) {
  return {
    type: INTERVAL_REMOVE,
    id
  };
}

export function attemptUpdate(interval) {
  return (dispatch) => {
    dispatch(requestIntervalUpdate());

    // only need to handle failure as firebase automatically will
    // fire a change event that we handle
    return intervalsApi.update(interval)
      .then((res) => dispatch(intervalUpdated(res)))
      .catch((err) => dispatch(intervalUpdateFailed(err)));
  };
}

export function fetchIntervals() {
  return (dispatch) => {
    dispatch(requestIntervals());

    return intervalsApi.findAll()
      .then((intervals) => dispatch(intervalsFetched(intervals)))
      .catch(() => dispatch(intervalsFetched([])));
  };
}
