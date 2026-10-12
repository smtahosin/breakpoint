/**
 * BreakPoint Progressive Web App — Offline Service Worker
 * Automatically caches core application assets and routes relative to service worker scope.
 * Enables 100% offline mission generation, solar mathematics, audio dispatch, and pocket cards.
 */

const CACHE_NAME = 'breakpoint-offline-v1';

// Dynamic base path derived from service worker registration scope
const getBasePath = () => {
  try {
    return new URL(self.registration.scope).pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
};

self.addEventListener('install', (event) => {
  const basePath = getBasePath();
  const CORE_ASSETS = [
    `${basePath}/`,
    `${basePath}/start/`,
    `${basePath}/field-card/`,
    `${basePath}/science/`,
    `${basePath}/images/hero-city-sunset.jpg`,
    `${basePath}/images/forest-trail-walk.jpg`,
    `${basePath}/images/field-card-lake.jpg`,
    `${basePath}/images/field-card-holding.jpg`,
    `${basePath}/images/mountain-summit-diffuse.jpg`
  ];

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use cache.addAll with individual catch to avoid failure if an image is missing
      return Promise.allSettled(
        CORE_ASSETS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Stale-While-Revalidate for local assets; Network-first for navigations
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            const basePath = getBasePath();
            return caches.match(`${basePath}/`);
          });
        })
    );
    return;
  }

  // Static assets (CSS, JS, images, fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalidate in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
