import cuid from 'cuid';
import * as intervalsApi from '../utils/intervalsApi';

export const INTERVAL_ADD = 'INTERVAL_ADD';
export const INTERVAL_UPDATE = 'INTERVAL_UPDATE';
export const INTERVAL_UPDATED = 'INTERVAL_UPDATED';
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

export function intervalUpdated() {
  return { type: INTERVAL_UPDATED };
}

export function updateInterval(interval) {
  return {
    type: INTERVAL_UPDATE,
    interval
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

    return intervalsApi.update(interval)
      .then(() => dispatch(intervalUpdated()))
      .catch(() => dispatch(intervalUpdated()));
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
