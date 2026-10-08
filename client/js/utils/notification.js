const fiveSeconds = 5000;
const title = 'tajmr';
const icon = 'icons/apple-touch-icon.png';

function closeAfterDelay(notification) {
  setTimeout(() => notification.close(), fiveSeconds);
}

// Page-level notification: works on desktop while the page is alive, but throws on Android Chrome
function showFromPage(body) {
  closeAfterDelay(new Notification(title, { body, icon, tag: title }));
}

// Shown by the service worker registration: also works from background tabs and on Android.
// Resolves to false when there is no registration (dev builds, unsupported browsers).
async function showFromServiceWorker(body) {
  if (!('serviceWorker' in navigator)) return false;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration || !registration.showNotification) return false;

  await registration.showNotification(title, { body, icon, tag: title });
  const [notification] = await registration.getNotifications({ tag: title });
  if (notification) closeAfterDelay(notification);
  return true;
}

// Permission is requested explicitly from the UI (see NotificationButton),
// never as a side effect of notifying.
export default async function notify(message) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  try {
    if (await showFromServiceWorker(message)) return;
    showFromPage(message);
  } catch (e) {
    // Notifications are best effort; never break the timer for them
  }
}
