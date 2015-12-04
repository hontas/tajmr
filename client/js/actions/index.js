import cuid from 'cuid';
import { INTERVAL_ADD, INTERVAL_UPDATE, INTERVAL_COMPLETE, INTERVAL_REMOVE } from '../constants';

export function addInterval() {
  return {
    type: INTERVAL_ADD,
    interval: {
      id: cuid(),
      startTime: Date.now()
    }
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
