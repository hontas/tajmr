const fiveSeconds = 5000;

function spawnNotification(body, icon, title) {
  const options = {
    body,
    icon,
    tag: title
  };
  return new Notification(title, options);
}

module.exports = (message) => {
  if ('Notification' in window === false) return;

  Notification.requestPermission((permission) => {
    if (permission === 'granted') {
      const notification = spawnNotification(message, 'icons/apple-touch-icon.png', 'tajmr');
      setTimeout(() => {
        notification.close();
      }, fiveSeconds);
    }
  });
};
