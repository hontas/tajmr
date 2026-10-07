const fiveSeconds = 5000;
const title = 'tajmr';

// Permission is requested explicitly from the UI (see NotificationButton),
// never as a side effect of notifying.
export default async function notify(message) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body: message,
    icon: 'icons/apple-touch-icon.png',
    tag: title,
  });
  setTimeout(() => notification.close(), fiveSeconds);
}
