import * as React from 'react';
import Button from './button.jsx';
import { useNotificationContext } from '../../context/Notification.jsx';

const noop = () => {};

export const NotificationButton = () => {
  const { supported, granted, denied, requestPermission } = useNotificationContext();

  if (!supported) {
    return null;
  }

  if (denied) {
    return (
      <Button
        disabled
        data-testid="notifications-btn"
        title="Notiser är blockerade. Ändra det i webbläsarens inställningar."
        onClick={noop}
        text="🚫"
      />
    );
  }

  return (
    <Button
      disabled={granted}
      data-testid="notifications-btn"
      title={granted ? 'Notiser är aktiverade' : 'Aktivera notiser'}
      onClick={requestPermission}
      text={granted ? '🔔' : '🔕'}
    />
  );
};
