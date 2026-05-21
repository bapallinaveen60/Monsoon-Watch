// ═══════════════════════════════════════════════════════
// MONSOON WATCH — Service Worker
// Strategy: cache-first for app shell, network-first for
// NASA satellite imagery (falls back to cached if offline)
// ═══════════════════════════════════════════════════════

const APP_VERSION  = 'v1.0.0';
const SHELL_CACHE  = 'mw-shell-' + APP_VERSION;
const IMAGE_CACHE  = 'mw-images-' + APP_VERSION;
const FONT_CACHE   = 'mw-fonts-' + APP_VERSION;

// App shell — everything needed to run offline
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/game.js',
  '/js/map.js',
  '/js/scenarios.js',
  '/js/imagery.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── Install: pre-cache the app shell ──────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ───────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== SHELL_CACHE && k !== IMAGE_CACHE && k !== FONT_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: routing strategy ───────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // NASA GIBS imagery — network-first, cache fallback
  if (url.hostname.includes('earthdata.nasa.gov') ||
      url.hostname.includes('wvs.earthdata.nasa.gov')) {
    event.respondWith(_networkFirst(event.request, IMAGE_CACHE));
    return;
  }

  // Google Fonts — cache-first
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(_cacheFirst(event.request, FONT_CACHE));
    return;
  }

  // App shell — cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(_cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  // Everything else — network only
  event.respondWith(fetch(event.request));
});

// ── Cache strategies ──────────────────────────────────

// Cache-first: serve from cache, fall back to network and update cache
async function _cacheFirst(request, cacheName) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first: try network, fall back to cache
async function _networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Return a transparent 1×1 PNG as placeholder when fully offline
    return new Response(
      _transparentPng(),
      { headers: { 'Content-Type': 'image/png' } }
    );
  }
}

// 1×1 transparent PNG fallback for satellite images when offline
function _transparentPng() {
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

// ── Background sync: queue failed image requests ──────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
