/* eslint-disable no-console */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.DEV) return;

    navigator.serviceWorker
      .register('service-worker.js')
      .then((reg) => {
        // eslint-disable-next-line no-param-reassign
        reg.onupdatefound = function onupdatefound() {
          const installingWorker = reg.installing;

          installingWorker.onstatechange = function onstatechange() {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  console.log('New or updated content is available.');
                } else {
                  console.log('Content is now available offline!');
                }
                break;

              case 'redundant':
                console.error('The installing service worker became redundant.');
                break;
              default:
                console.log(`Unhandled worker state: ${installingWorker.state}`);
            }
          };
        };
      })
      .catch((e) => {
        console.error('Error during service worker registration:', e);
      });
  });
}
