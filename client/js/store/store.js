import cuid from 'cuid';

import baseStore from './baseStore';
import constants from '../constants';

const _intervals = getFromLocalStorage();
let _currentIntervalId = getFromIntervals();

const store = Object.assign({}, baseStore, {
  getIntervals() {
    return Object.keys(_intervals)
      .map((key) => Object.assign({}, _intervals[key]));
  },

  getCurrentInterval() {
    if (_intervals[_currentIntervalId]) {
      return Object.assign({}, _intervals[_currentIntervalId]);
    }
  },

  startedWorking(timestamp) {
    const id = cuid();
    _intervals[id] = { id, startedWorkingAt: timestamp };
    _currentIntervalId = id;
    persistToLocalStorage();
    this.emitChange();
  },

  stoppedWorking({ timestamp, intervalId }) {
    _intervals[intervalId] = Object.assign({}, _intervals[intervalId], {
      stoppedWorkingAt: timestamp
    });
    _currentIntervalId = null;
    persistToLocalStorage();
    this.emitChange();
  },

  updateInterval(interval) {
    const id = interval.id;
    if (_intervals[id]) {
      _intervals[id] = Object.assign({}, _intervals[id], interval);
    }
    persistToLocalStorage();
    this.emitChange();
  },

  removeInterval(id) {
    if (_intervals[id]) {
      delete _intervals[id];
    }
    persistToLocalStorage();
    this.emitChange();
  }
});

function persistToLocalStorage() {
  localStorage.setItem(constants.LOCAL_STORAGE_KEY, JSON.stringify(_intervals));
}

function getFromLocalStorage() {
  let result;

  if (window.localStorage) {
    try {
      result = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_KEY));
    } catch (error) {
      console.log('Failed to read from local storage', error.toString());
    }
  }
  return result || {};
}

function getFromIntervals() {
  const match = Object.keys(_intervals)
    .map((key) => _intervals[key])
    .filter((interval) => interval.startedWorkingAt && !interval.stoppedWorkingAt);

  return match.length && match[0].id || null;
}

export default store;
