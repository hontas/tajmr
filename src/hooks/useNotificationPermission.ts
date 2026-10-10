import { useSyncExternalStore } from 'react';

export type NotificationSupport = NotificationPermission | 'unsupported';

const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  let status: PermissionStatus | undefined;
  let unsubscribed = false;

  navigator.permissions
    ?.query({ name: 'notifications' })
    .then((result) => {
      if (unsubscribed) return;
      status = result;
      status.addEventListener('change', onChange);
    })
    .catch(() => {});

  return () => {
    unsubscribed = true;
    listeners.delete(onChange);
    status?.removeEventListener('change', onChange);
  };
};

const getSnapshot = (): NotificationSupport =>
  'Notification' in window ? Notification.permission : 'unsupported';

const requestPermission = async () => {
  if (!('Notification' in window)) return;
  await Notification.requestPermission();
  listeners.forEach((listener) => listener());
};

export default function useNotificationPermission() {
  const permission = useSyncExternalStore(subscribe, getSnapshot);
  return { permission, requestPermission };
}
