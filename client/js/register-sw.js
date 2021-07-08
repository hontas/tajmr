/* eslint-disable no-console */

const noop = () => {};

export function register({ onUpdate = noop, onAvailableOffline = noop } = {}) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      if (process.env.NODE_ENV !== 'production') return;

      navigator.serviceWorker
        .register('service-worker.js')
        .then((reg) => {
          reg.addEventListener('updatefound', () => {
            const installingWorker = reg.installing;

            installingWorker.addEventListener('statechange', () => {
              switch (installingWorker.state) {
                case 'installed':
                  if (navigator.serviceWorker.controller) {
                    console.log('New or updated content is available.');
                    onUpdate(installingWorker);
                  } else {
                    console.log('Content is now available offline!');
                    onAvailableOffline(installingWorker);
                  }
                  break;

                case 'redundant':
                  console.error('The installing service worker became redundant.');
                  break;
                default:
                  console.log(`Unhandled worker state: ${installingWorker.state}`);
              }
            });
          });
        })
        .catch((e) => {
          console.error('Error during service worker registration:', e);
        });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('controllerchange - time to reload');
      });
    });
  }
}
