// This service worker file caches the main app shell (the HTML file).
// This allows the app to load instantly on repeat visits and even load offline.

const CACHE_NAME = 'metar-forecast-verification-cache-v1'; // Updated version
const urlsToCache = [
  '/METAR-forecast-verification/',
  '/METAR-forecast-verification/index.html'
];

// Install event: This runs when the service worker is first installed.
self.addEventListener('install', event => {
  // We wait until the cache is opened and our core files are added to it.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: This runs every time the app requests a file (like an image, script, or the page itself).
self.addEventListener('fetch', event => {
  event.respondWith(
    // We check if the requested file is already in our cache.
    caches.match(event.request)
      .then(response => {
        // If it's in the cache, we return it immediately. This is what makes it fast!
        if (response) {
          return response;
        }
        // If it's not in the cache, we fetch it from the internet like normal.
        return fetch(event.request);
      }
    )
  );
});

// Activate event: This runs when a new service worker takes over.
// We use this to delete old, outdated caches.
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

