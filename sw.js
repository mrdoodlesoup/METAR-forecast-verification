// A more robust, standard "cache-first" service worker.

const CACHE_NAME = 'metar-cache-v2'; // A new version name to force an update.
const URLS_TO_CACHE = [
  '/METAR-forecast-verification/',
  '/METAR-forecast-verification/index.html'
];

// Install the service worker and cache the app shell.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Serve assets from the cache first. If not found, fetch from the network.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the response is in the cache, return it.
        if (response) {
          return response;
        }
        // If not, fetch it from the network.
        return fetch(event.request);
      })
  );
});

// Clean up old caches when a new service worker is activated.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

