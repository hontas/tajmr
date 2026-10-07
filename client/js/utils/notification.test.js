import notify from './notification';

describe('notify', () => {
  let close;
  let NotificationMock;

  beforeEach(() => {
    jest.useFakeTimers();
    close = jest.fn();
    NotificationMock = jest.fn(() => ({ close }));
    NotificationMock.permission = 'granted';
    NotificationMock.requestPermission = jest.fn();
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

  test.each(['denied', 'default'])('does nothing when permission is %s', async (permission) => {
    NotificationMock.permission = permission;

    await notify('Hello');

    expect(NotificationMock).not.toHaveBeenCalled();
  });

  test('never asks for permission itself', async () => {
    NotificationMock.permission = 'default';

    await notify('Hello');

    expect(NotificationMock.requestPermission).not.toHaveBeenCalled();
  });

  test('does nothing when notifications are not supported', async () => {
    delete window.Notification;

    await expect(notify('Hello')).resolves.toBeUndefined();
  });

  describe('with a service worker registration', () => {
    const setServiceWorker = (registration) => {
      Object.defineProperty(navigator, 'serviceWorker', {
        configurable: true,
        value: { getRegistration: jest.fn().mockResolvedValue(registration) },
      });
    };

    afterEach(() => {
      delete navigator.serviceWorker;
    });

    test('prefers registration.showNotification and closes it after five seconds', async () => {
      const closeFromRegistration = jest.fn();
      const registration = {
        showNotification: jest.fn().mockResolvedValue(),
        getNotifications: jest.fn().mockResolvedValue([{ close: closeFromRegistration }]),
      };
      setServiceWorker(registration);

      await notify('hej');

      expect(registration.showNotification).toHaveBeenCalledWith(
        'tajmr',
        expect.objectContaining({ body: 'hej', tag: 'tajmr' })
      );
      expect(NotificationMock).not.toHaveBeenCalled();
      jest.advanceTimersByTime(5000);
      expect(closeFromRegistration).toHaveBeenCalled();
    });

    test('falls back to a page notification when nothing is registered', async () => {
      setServiceWorker(undefined);
      await notify('hej');
      expect(NotificationMock).toHaveBeenCalledTimes(1);
    });

    test('swallows errors so the timer keeps working', async () => {
      setServiceWorker({ showNotification: jest.fn().mockRejectedValue(new Error('nope')) });
      await expect(notify('hej')).resolves.toBeUndefined();
    });
  });
});
