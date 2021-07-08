export const NOTIFICATION_ADDED = 'NOTIFICATION_ADDED';
export const NOTIFICATION_REMOVED = 'NOTIFICATION_REMOVED';

const THEMES = {
  INFO: 'INFO',
};
export const TYPES = {
  INFO: 'INFO',
  DISMISS: 'DISMISS',
};

/**
 * Actions
 */

export function addNotification(notification) {
  return {
    type: NOTIFICATION_ADDED,
    payload: {
      theme: THEMES.INFO,
      type: TYPES.INFO,
      ...notification,
      id: Date.now() + (Math.random() * 256).toString(16),
    },
  };
}

export function removeNotification(id) {
  return {
    type: NOTIFICATION_REMOVED,
    payload: {
      id,
    },
  };
}

/**
 * Reducer
 */

const baseNotification = {
  type: TYPES.INFO,
  theme: THEMES.INFO,
  message: 'test notification',
};
const initialState = {
  notifications: [
    {
      ...baseNotification,
      id: 'a',
    },
    {
      ...baseNotification,
      id: 'b',
      type: TYPES.DISMISS,
    },
    {
      ...baseNotification,
      id: 'c',
      actionText: 'Click me',
      onAction: () => {},
    },
  ],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_ADDED:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case NOTIFICATION_REMOVED:
      return {
        ...state,
        notifications: state.notifications.filter(({ id }) => id !== action.payload.id),
      };
    default:
      return state;
  }
}
