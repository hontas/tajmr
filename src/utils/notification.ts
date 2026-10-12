import * as Sentry from '@sentry/react';

const fiveSeconds = 5000;
const title = 'tajmr';

export default async function notify(message: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (!registration) return;

    await registration.showNotification(title, {
      body: message,
      icon: 'icons/apple-touch-icon.png',
      tag: title,
    });
    const [notification] = await registration.getNotifications({ tag: title });
    setTimeout(() => notification?.close(), fiveSeconds);
  } catch (error) {
    Sentry.captureException(error);
  }
}
