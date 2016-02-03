import {
  CONNECTED,
  TOGGLE_DISPLAY_NOTIFICATIONS
} from '../constants';

export function connect(value) {
  return {
    type: CONNECTED,
    value
  };
}

export function toggleDisplayNotifications() {
  return {
    type: TOGGLE_DISPLAY_NOTIFICATIONS
  };
}
