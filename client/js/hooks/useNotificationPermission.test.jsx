import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useNotificationPermission } from './useNotificationPermission';

const Probe = () => {
  const { permission, supported, granted, denied, canRequest, requestPermission } =
    useNotificationPermission();
  return (
    <div>
      <span data-testid="state">
        {JSON.stringify({ permission, supported, granted, denied, canRequest })}
      </span>
      <button type="button" onClick={requestPermission}>
        ask
      </button>
    </div>
  );
};

const readState = () => JSON.parse(screen.getByTestId('state').textContent);

const mockPermissionsApi = (state) => {
  const listeners = {};
  const status = {
    state,
    addEventListener: jest.fn((evt, cb) => {
      listeners[evt] = cb;
    }),
    removeEventListener: jest.fn(),
  };
  Object.defineProperty(navigator, 'permissions', {
    configurable: true,
    value: { query: jest.fn().mockResolvedValue(status) },
  });
  return { status, listeners };
};

describe('useNotificationPermission', () => {
  afterEach(() => {
    delete global.Notification;
    delete navigator.permissions;
  });

  test('reports unsupported (and denied) when the Notification API is missing', () => {
    render(<Probe />);
    expect(readState()).toMatchObject({ supported: false, denied: true, canRequest: false });
  });

  test('maps "default" to "prompt" so permission can be requested straight away', () => {
    global.Notification = { permission: 'default', requestPermission: jest.fn() };
    render(<Probe />);
    expect(readState()).toMatchObject({ permission: 'prompt', supported: true, canRequest: true });
  });

  test('updates derived flags after permission is granted', async () => {
    global.Notification = {
      permission: 'default',
      requestPermission: jest.fn().mockResolvedValue('granted'),
    };
    render(<Probe />);

    await act(async () => {
      fireEvent.click(screen.getByText('ask'));
    });

    expect(readState()).toMatchObject({ granted: true, canRequest: false, denied: false });
  });

  test('follows permission changes made in the browser settings', async () => {
    global.Notification = { permission: 'default', requestPermission: jest.fn() };
    const { status, listeners } = mockPermissionsApi('prompt');
    render(<Probe />);
    await act(async () => {});

    status.state = 'denied';
    act(() => listeners.change());

    expect(readState()).toMatchObject({ denied: true, canRequest: false });
  });

  test('removes the change listener on unmount', async () => {
    global.Notification = { permission: 'default', requestPermission: jest.fn() };
    const { status } = mockPermissionsApi('prompt');
    const { unmount } = render(<Probe />);
    await act(async () => {});

    unmount();

    expect(status.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
