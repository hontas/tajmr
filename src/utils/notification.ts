const fiveSeconds = 5000;
const title = 'tajmr';

export default async function notify(message: string) {
  if (!('Notification' in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const notification = new Notification(title, {
    body: message,
    icon: 'icons/apple-touch-icon.png',
    tag: title,
  });
  setTimeout(() => notification.close(), fiveSeconds);
}
