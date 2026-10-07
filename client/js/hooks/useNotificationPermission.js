import { useCallback, useEffect, useMemo, useState } from 'react';

// Notification.permission reports "default" where the Permissions API reports "prompt"
const normalize = (state) => (state === 'default' ? 'prompt' : state);
const isSupported = typeof Notification !== 'undefined';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState(isSupported ? normalize(Notification.permission) : 'denied');

  const requestPermission = useCallback(async () => {
    if (!isSupported) return;
    const permissionStatus = await Notification.requestPermission();
    setPermission(normalize(permissionStatus));
  }, []);

  useEffect(() => {
    if (!isSupported || !navigator.permissions?.query) return undefined;

    let status;
    let cancelled = false;
    const onChange = () => setPermission(normalize(status.state));

    navigator.permissions
      .query({ name: 'notifications' })
      .then((result) => {
        if (cancelled) return;
        status = result;
        onChange();
        status.addEventListener('change', onChange);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      status?.removeEventListener('change', onChange);
    };
  }, []);

  return useMemo(
    () => ({
      permission,
      granted: permission === 'granted',
      denied: permission === 'denied',
      canRequest: permission === 'prompt',
      requestPermission,
    }),
    [permission, requestPermission]
  );
};
