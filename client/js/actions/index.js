import cuid from 'cuid';

import {
  INTERVAL_ADD,
  INTERVAL_UPDATE,
  INTERVAL_COMPLETE,
  INTERVAL_REMOVE,
  INTERVALS_FETCHED,
  TOGGLE_DISPLAY_NOTIFICATIONS
} from '../constants';

export function addInterval(interval = {
  id: cuid(),
  startTime: Date.now()
}) {
  return {
    type: INTERVAL_ADD,
    interval
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

export function toggleDisplayNotifications() {
  return {
    type: TOGGLE_DISPLAY_NOTIFICATIONS
  };
}
