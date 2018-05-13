/* eslint-disable no-console */
const isProduction = process.env.NODE_ENV === 'production';

// eslint-disable-next-line
// https://github.com/GoogleChromeLabs/sw-precache/blob/5699e5d049235ef0f668e8e2aa3bf2646ba3872f/demo/app/js/service-worker-registration.js
if ('serviceWorker' in navigator && isProduction) {
  navigator.serviceWorker
    .register('service-worker.js')
    .then((reg) => {
      // eslint-disable-next-line
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
}
