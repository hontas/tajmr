import * as Sentry from '@sentry/react';

import notify from './notification.ts';

vi.mock(import('@sentry/react'), async (importOriginal) => ({
  ...(await importOriginal()),
  captureException: vi.fn<typeof Sentry.captureException>(),
}));

const close = vi.fn<() => void>();
const registration = {
  showNotification: vi.fn<(title: string, options: NotificationOptions) => Promise<void>>(),
  getNotifications: vi.fn<() => Promise<{ close: () => void }[]>>(),
};
const getRegistration = vi.fn<() => Promise<typeof registration | undefined>>();

const stubBrowser = (permission: NotificationPermission) => {
  vi.stubGlobal('Notification', { permission });
  vi.stubGlobal('navigator', { ...navigator, serviceWorker: { getRegistration } });
};

describe('notify', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    getRegistration.mockResolvedValue(registration);
    registration.showNotification.mockResolvedValue();
    registration.getNotifications.mockResolvedValue([{ close }]);
    stubBrowser('granted');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('shows the notification through the service worker and closes it after 5 seconds', async () => {
    await notify('Hello');

    expect(registration.showNotification).toHaveBeenCalledWith('tajmr', {
      body: 'Hello',
      icon: 'icons/apple-touch-icon.png',
      tag: 'tajmr',
    });
    expect(close).not.toHaveBeenCalled();
    vi.advanceTimersByTime(5000);
    expect(close).toHaveBeenCalledTimes(1);
  });

  test('never asks for permission', async () => {
    const requestPermission = vi.fn<() => Promise<NotificationPermission>>();
    vi.stubGlobal('Notification', { permission: 'default', requestPermission });

    await notify('Hello');

    expect(requestPermission).not.toHaveBeenCalled();
    expect(registration.showNotification).not.toHaveBeenCalled();
  });

  test('does nothing when permission is denied', async () => {
    stubBrowser('denied');

    await notify('Hello');

    expect(registration.showNotification).not.toHaveBeenCalled();
  });

  test('does nothing when notifications are not supported', async () => {
    vi.stubGlobal('Notification', undefined);
    Reflect.deleteProperty(window, 'Notification');

    await expect(notify('Hello')).resolves.toBeUndefined();
  });

  test('does nothing without a registered service worker', async () => {
    getRegistration.mockResolvedValue(undefined);

    await notify('Hello');

    expect(registration.showNotification).not.toHaveBeenCalled();
  });

  test('reports a failure instead of throwing', async () => {
    const error = new Error('no way');
    registration.showNotification.mockRejectedValue(error);

    await expect(notify('Hello')).resolves.toBeUndefined();

    expect(Sentry.captureException).toHaveBeenCalledWith(error);
  });
});
