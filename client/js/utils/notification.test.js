import notify from './notification';

describe('notify', () => {
  let close;
  let NotificationMock;

  beforeEach(() => {
    vi.useFakeTimers();
    close = vi.fn();
    // called with `new`, so it has to be a function, not an arrow function
    // eslint-disable-next-line prefer-arrow-callback
    NotificationMock = vi.fn(function Notification() {
      return { close };
    });
    NotificationMock.requestPermission = vi.fn(() => Promise.resolve('granted'));
    window.Notification = NotificationMock;
  });

  afterEach(() => {
    delete window.Notification;
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
    NotificationMock.requestPermission.mockResolvedValue('denied');

    await notify('Hello');

    expect(NotificationMock).not.toHaveBeenCalled();
  });

  test('does nothing when notifications are not supported', async () => {
    delete window.Notification;

    await expect(notify('Hello')).resolves.toBeUndefined();
  });
});
