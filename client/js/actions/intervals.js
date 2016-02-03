import cuid from 'cuid';
import { findAll } from '../utils/intervalsApi';

export const INTERVAL_ADD = 'INTERVAL_ADD';
export const INTERVAL_UPDATE = 'INTERVAL_UPDATE';
export const INTERVAL_COMPLETE = 'INTERVAL_COMPLETE';
export const INTERVAL_REMOVE = 'INTERVAL_REMOVE';
export const INTERVALS_FETCHED = 'INTERVALS_FETCHED';
export const REQUEST_INTERVALS = 'REQUEST_INTERVALS';

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
  return {
    type: REQUEST_INTERVALS
  };
}

export function intervalsFetched(intervals) {
  return {
    type: INTERVALS_FETCHED,
    intervals
  };
}

export function updateInterval(interval) {
  return {
    type: INTERVAL_UPDATE,
    interval
  };
}

export function completeInterval(interval) {
  return {
    type: INTERVAL_COMPLETE,
    interval: Object.assign({}, interval, {
      endTime: Date.now()
    })
  };
}

export function removeInterval(id) {
  return {
    type: INTERVAL_REMOVE,
    id
  };
}

export function fetchIntervals() {
  return (dispatch) => {
    dispatch(requestIntervals());

    return findAll()
      .then((intervals) => dispatch(intervalsFetched(intervals)))
      .catch(() => dispatch(intervalsFetched([])));
  };
}
