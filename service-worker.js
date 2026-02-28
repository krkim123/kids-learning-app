const CACHE_NAME = 'fairy-classroom-v2';

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/data.js',
  './js/game.js',
  './js/learn.js',
  './js/profile.js',
  './js/reward.js',
  './js/speech.js',
  './js/storage.js',
  './js/daily.js',
  './js/coloring.js',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/favicon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
