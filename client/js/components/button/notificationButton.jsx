import * as React from 'react';
import Button from './button.jsx';
import { useNotificationContext } from '../../context/Notification.jsx';

export const NotificationButton = () => {
  const { granted, denied, canRequest, requestPermission } = useNotificationContext();
  console.log('granted, denied, canRequest', granted, denied, canRequest);

  if (denied) {
    return null;
  }

  return (
    <Button
      disabled={!canRequest}
      data-testid="notifications-btn"
      onClick={requestPermission}
      text={granted ? '🔔' : '🔕'}
    />
  );
};
