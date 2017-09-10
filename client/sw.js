const CACHE_NAME = 'tajmr-v2';
let urlsToCache = [
  '/',
  '/assets/manifest.json',
  '/assets/android-icon-36x36.png',
  '/assets/android-icon-48x48.png',
  '/assets/android-icon-72x72.png',
  '/assets/android-icon-96x96.png',
  '/assets/android-icon-144x144.png',
  '/assets/android-icon-192x192.png',
  '/styles.js',
  '/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async function aiife() {
    console.log('open caches');
    const cache = await caches.open(CACHE_NAME);
    console.log('cache open', cache);
    await cache.addAll(urlsToCache);
    self.skipWaiting();
  }()));
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil((async function iife() {
    const cacheNames = await caches.keys();
    const cachesToDelete = cacheNames
      .filter((cacheName) => !cacheWhitelist.includes(cacheName))
      .map((cacheName) => caches.delete(cacheName));
    await Promise.all(cachesToDelete);
    self.clients.claim();
  }()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith((async function aiife() {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(event.request);
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

      return response || fetchPromise;
    }()));
  }
});
