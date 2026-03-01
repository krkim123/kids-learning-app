const CACHE_NAME = 'fairy-classroom-v20';

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/data.js',
  './js/design-pack.js',
  './js/dump.js',
  './js/ads.js',
  './js/benchmark.js',
  './js/game.js',
  './js/iq-lab.js',
  './js/github-pack-games.js',
  './js/learn.js',
  './js/profile.js',
  './js/reward.js',
  './js/speech.js',
  './js/storage.js',
  './js/daily.js',
  './js/coloring.js',
  './reference_import/dump_manifest.json',
  './reference_import/dump_manifest.js',
  './reference_import/math_launcher.html',
  './manifest.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/favicon.svg',
  './assets/stickers/kids-sticker-sheet.png',
];

const SAME_ORIGIN_STATIC_RE = /\.(?:js|css|png|svg|json|html|ico|webp|jpg|jpeg|gif)$/i;
const ASSET_SET = new Set(ASSETS);

function toAssetPath(url) {
  const path = url.pathname === '/' ? './' : `.${url.pathname}`;
  return path;
}

function isSameOriginStatic(requestUrl) {
  return requestUrl.origin === self.location.origin && SAME_ORIGIN_STATIC_RE.test(requestUrl.pathname);
}

// Install: cache all assets, immediately take over
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: delete ALL old caches, immediately claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch:
// - HTML navigation: network-first (fresh app shell) with cache fallback
// - Static same-origin assets: stale-while-revalidate (fast load + background refresh)
// - Others: network-first with cache fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  const requestAssetPath = toAssetPath(requestUrl);
  const isStaticAsset = isSameOriginStatic(requestUrl) || ASSET_SET.has(requestAssetPath);

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networkUpdate = fetch(event.request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)));
            }
            return response;
          })
          .catch(() => null);

        if (cached) {
          event.waitUntil(networkUpdate);
          return cached;
        }
        return networkUpdate.then((response) => response || new Response('Offline static resource unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }));
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || new Response('Offline resource unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })))
  );
});
