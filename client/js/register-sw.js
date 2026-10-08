import { registerSW } from 'virtual:pwa-register';

const reload = () => window.location.reload();

// Registers the service worker (production only). A new version waits until the function this
// returns is called, which is the user's decision; `onNeedRefresh` fires when one is waiting.
export default function registerServiceWorker({ onNeedRefresh }) {
  if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') {
    return () => Promise.resolve();
  }

  const updateServiceWorker = registerSW({
    onNeedRefresh,
    // the reload is done below: the worker library skips it when the page had no worker at first
    // load, and then the page would keep running the old code after the user accepted
    onNeedReload: () => {},
    onRegisteredSW(url, registration) {
      if (!registration) return;
      // An installed PWA is rarely reloaded, so look for a new version whenever the app comes back
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration.update();
      });
    },
  });

  return () => {
    navigator.serviceWorker.addEventListener('controllerchange', reload, { once: true });
    return updateServiceWorker(true);
  };
}
