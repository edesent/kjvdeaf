// KJV for the Deaf — service worker
// Caches the app shell and visited pages so the site works offline
// and loads instantly on repeat visits, even on a weak connection.

const CACHE_NAME = "kjvdeaf-v1";
const OFFLINE_URL = "/";

// Core files to pre-cache immediately on install.
const PRECACHE_URLS = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Network-first for navigations (so updates show up right away when
// online), falling back to cache when offline. Cache-first for
// everything else (images, fonts, scripts) since those rarely change.
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests over http(s).
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Don't cache error responses or opaque cross-origin responses.
          if (!response || response.status !== 200 || response.type === "error") {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
