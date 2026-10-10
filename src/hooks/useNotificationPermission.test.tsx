import { act, render, screen, fireEvent } from '@testing-library/react';

import useNotificationPermission from './useNotificationPermission.ts';

const Probe = () => {
  const { permission, requestPermission } = useNotificationPermission();
  return (
    <button type="button" onClick={requestPermission}>
      {permission}
    </button>
  );
};

const stubNotification = (permission: NotificationPermission) => {
  const notification = {
    permission,
    requestPermission: vi.fn<() => Promise<NotificationPermission>>(),
  };
  vi.stubGlobal('Notification', notification);
  return notification;
};

const stubPermissionsApi = () => {
  const listeners = new Set<() => void>();
  const status = {
    addEventListener: vi.fn<(type: string, listener: () => void) => void>((_type, listener) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn<(type: string, listener: () => void) => void>((_type, listener) => {
      listeners.delete(listener);
    }),
  };
  vi.stubGlobal('navigator', {
    ...navigator,
    permissions: { query: vi.fn<() => Promise<typeof status>>().mockResolvedValue(status) },
  });
  return { status, change: () => listeners.forEach((listener) => listener()) };
};

describe('useNotificationPermission', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('is unsupported when the Notification API is missing', () => {
    vi.stubGlobal('Notification', undefined);
    Reflect.deleteProperty(window, 'Notification');

    render(<Probe />);

    expect(screen.getByRole('button')).toHaveTextContent('unsupported');
  });

  test('shows the current permission', () => {
    stubNotification('denied');

    render(<Probe />);

    expect(screen.getByRole('button')).toHaveTextContent('denied');
  });

  test('updates after the permission was requested', async () => {
    const notification = stubNotification('default');
    notification.requestPermission.mockImplementation(async () => {
      Object.assign(notification, { permission: 'granted' });
      return 'granted';
    });
    render(<Probe />);

    await act(async () => fireEvent.click(screen.getByRole('button')));

    expect(screen.getByRole('button')).toHaveTextContent('granted');
  });

  test('follows a change made in the browser settings', async () => {
    const notification = stubNotification('default');
    const permissions = stubPermissionsApi();
    render(<Probe />);
    await act(async () => {});

    Object.assign(notification, { permission: 'denied' });
    act(() => permissions.change());

    expect(screen.getByRole('button')).toHaveTextContent('denied');
  });

  test('stops listening when unmounted', async () => {
    stubNotification('default');
    const permissions = stubPermissionsApi();
    const { unmount } = render(<Probe />);
    await act(async () => {});

    unmount();

    expect(permissions.status.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
