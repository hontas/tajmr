import { useCallback, useEffect, useMemo, useState } from 'react';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState(Notification.permission);
  console.log('permission', permission);

  const requestPermission = useCallback(async () => {
    const permissionStatus = await Notification.requestPermission();
    setPermission(permissionStatus);
  }, []);

  const checkNotificationStatus = useCallback(async () => {
    const permissionStatus = await navigator.permissions.query({ name: 'notifications' });
    console.log('permissionStatus', permissionStatus);
    setPermission(permissionStatus.state);

    if (permissionStatus.state === 'prompt') {
      // can ask for permission with user gesture
      // requestPermission()
    }
  }, []);

  useEffect(() => {
    checkNotificationStatus();
  }, [permission]);

  return useMemo(
    () => ({
      permission,
      granted: permission === 'granted',
      denied: permission === 'denied',
      canRequest: permission === 'prompt',
      requestPermission,
    }),
    []
  );
};
