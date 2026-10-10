import notify from './notification.ts';

describe('notify', () => {
  const close = vi.fn<() => void>();
  const requestPermission = vi.fn<() => Promise<NotificationPermission>>();
  const NotificationMock = vi.fn<() => { close: typeof close }>(function Notification() {
    return { close };
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    requestPermission.mockResolvedValue('granted');
    // called with `new`, so the mock has to be a function, not an arrow function
    vi.stubGlobal('Notification', Object.assign(NotificationMock, { requestPermission }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  test('shows a notification when permission is granted and closes it after 5 seconds', async () => {
    await notify('Hello');

    expect(NotificationMock).toHaveBeenCalledWith('tajmr', {
      body: 'Hello',
      icon: 'icons/apple-touch-icon.png',
      tag: 'tajmr',
    });
    expect(close).not.toHaveBeenCalled();
    vi.advanceTimersByTime(5000);
    expect(close).toHaveBeenCalledTimes(1);
  });

  test('does nothing when permission is denied', async () => {
    requestPermission.mockResolvedValue('denied');

    await notify('Hello');

    expect(NotificationMock).not.toHaveBeenCalled();
  });

  test('does nothing when notifications are not supported', async () => {
    Reflect.deleteProperty(window, 'Notification');

    await expect(notify('Hello')).resolves.toBeUndefined();
  });
});
