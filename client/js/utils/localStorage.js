import { LOCAL_STORAGE_KEY } from '../constants';

export function get(version) {
  let result;
  if (window.localStorage) {
    try {
      result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY + version));
    } catch (error) {
      console.error('Failed to read from local storage', error.toString());
    }
  }
  return result || {};
}

export function set(version, data) {
  if (window.localStorage) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY + version, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to write to local storage', error.toString());
    }
  }
}

export default {
  get,
  set
};
