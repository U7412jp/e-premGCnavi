const CACHE_NAME = "usuki-digital-ticket-navi-v1";

// GitHub Pagesのサブディレクトリ（リポジトリ名）を明示する
const ASSETS_TO_CACHE = [
  "/e-premGCnavi/",
  "/e-premGCnavi/index.html",
  "/e-premGCnavi/manifest.json",
  "/e-premGCnavi/icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // ナビゲート（ページ遷移）時のフォールバックもリポジトリ名付きに変更
        return cachedResponse || fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/e-premGCnavi/index.html");
          }
        });
      })
  );
});
