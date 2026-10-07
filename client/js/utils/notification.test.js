import notify from './notification';

describe('notify', () => {
  let close;
  let NotificationMock;

  beforeEach(() => {
    jest.useFakeTimers();
    close = jest.fn();
    NotificationMock = jest.fn(() => ({ close }));
    NotificationMock.requestPermission = jest.fn(() => Promise.resolve('granted'));
    window.Notification = NotificationMock;
  });

  afterEach(() => {
    delete window.Notification;
    jest.useRealTimers();
  });

  test('shows a notification when permission is granted and closes it after 5 seconds', async () => {
    await notify('Hello');

    expect(NotificationMock).toHaveBeenCalledWith('tajmr', {
      body: 'Hello',
      icon: 'icons/apple-touch-icon.png',
      tag: 'tajmr',
    });
    expect(close).not.toHaveBeenCalled();
    jest.advanceTimersByTime(5000);
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
