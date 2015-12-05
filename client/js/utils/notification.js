const fiveSeconds = 5000;

function spawnNotification(theBody, theIcon, theTitle) {
  const options = {
      body: theBody,
      icon: theIcon
  };
  return new Notification(theTitle, options);
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
