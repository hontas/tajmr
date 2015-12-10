const fiveSeconds = 5000;

function spawnNotification(body, icon, title) {
  const options = {
      body: body,
      icon: icon,
      tag: title
  };
  return new Notification(title, options);
}

module.exports = (message) => {
  Notification.requestPermission((permission) => {
    if (permission === 'granted') {
      const notification = spawnNotification(message, 'assets/apple-icon.png', 'tajmr');
      setTimeout(() => {
        notification.close();
      }, fiveSeconds);
    }
  });
};
