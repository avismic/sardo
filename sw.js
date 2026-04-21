// ------------------------------------------------
// sw.js – new version (v2)
// ------------------------------------------------
const CACHE_NAME = 'sourdough-v2';            // ← bump version
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './js/Store.js',
  // IMPORTANT: cache every component we load so the new HTML is always paired
  './js/Components/AppShell.js',
  './js/Components/WelcomeScreen.js',
  './js/Components/Calculator.js',
  './js/Components/BulkRest.js',
  './js/Components/FoldingStep.js',
  './js/Components/BakingStep.js',
  './js/Components/ReviewStep.js',
  './js/Components/EnvironmentLog.js',
  './js/Components/Scheduler.js',
  './js/Components/Timer.js'
];

// Install → cache everything
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  ).then(() => self.skipWaiting()); // activate immediately
});

// Activate → delete old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Fetch → network‑first, fall back to cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Update cache with fresh response
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
