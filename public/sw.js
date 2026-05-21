const CACHE_NAME = "energy-iq-v1";
const STATIC_ASSETS = [
  "/manifest.json",
  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Network-only for API routes — responses are user-specific, never cache them
  if (url.pathname.startsWith("/api/")) return;

  // Network-first for Next.js internal routes; cache only immutable static chunks
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(
      fetch(request).then((response) => {
        if (url.pathname.startsWith("/_next/static/") && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
    );
    return;
  }

  // Skip navigation requests (HTML pages) to avoid caching user-specific content
  if (request.mode === "navigate") return;

  // Cache-first for static assets (images, fonts, icons, manifest, etc.)
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
    )
  );
});
