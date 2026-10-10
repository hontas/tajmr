import { registerSW } from 'virtual:pwa-register';

const reload = () => window.location.reload();

// a new version waits until the returned function is called (the user's decision)
export default function registerServiceWorker({ onNeedRefresh }: { onNeedRefresh: () => void }) {
  if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') {
    return () => Promise.resolve();
  }

  const updateServiceWorker = registerSW({
    onNeedRefresh,
    // reloaded below: the library skips the reload when the page had no worker at first load
    onNeedReload: () => {},
    onRegisteredSW(url, registration) {
      if (!registration) return;
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
