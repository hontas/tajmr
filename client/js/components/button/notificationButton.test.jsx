import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { NotificationButton } from './notificationButton.jsx';
import { NotificationContext } from '../../context/Notification.jsx';

const setup = (value) => {
  const requestPermission = jest.fn();
  render(
    <NotificationContext.Provider value={{ supported: true, requestPermission, ...value }}>
      <NotificationButton />
    </NotificationContext.Provider>
  );
  return { requestPermission };
};

describe('NotificationButton', () => {
  test('renders nothing when notifications are unsupported', () => {
    setup({ supported: false });
    expect(screen.queryByTestId('notifications-btn')).not.toBeInTheDocument();
  });

  test('requests permission when clicked in the prompt state', () => {
    const { requestPermission } = setup({ canRequest: true });
    fireEvent.click(screen.getByTestId('notifications-btn'));
    expect(requestPermission).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('notifications-btn')).toHaveTextContent('🔕');
  });

  test('shows an enabled, disabled-for-clicks bell when granted', () => {
    setup({ granted: true });
    const btn = screen.getByTestId('notifications-btn');
    expect(btn).toHaveTextContent('🔔');
    expect(btn).toBeDisabled();
  });

  test('explains that notifications are blocked when denied', () => {
    setup({ denied: true });
    const btn = screen.getByTestId('notifications-btn');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('title', expect.stringContaining('blockerade'));
  });
});
