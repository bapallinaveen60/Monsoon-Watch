// ═══════════════════════════════════════════════════════
// INSAT-Sim — Service Worker
// Uses relative paths so it works on GitHub Pages
// (e.g. https://user.github.io/satellite_meteorology_quiz/)
// ═══════════════════════════════════════════════════════

const APP_VERSION = 'v2.2.2';
const SHELL_CACHE = 'mw-shell-' + APP_VERSION;
const IMAGE_CACHE = 'mw-images-' + APP_VERSION;
const FONT_CACHE  = 'mw-fonts-'  + APP_VERSION;

// Derive base path from sw.js location (works on any subdirectory)
const BASE = self.location.pathname.replace(/\/sw\.js$/, '');

const SHELL_ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/css/style.css',
  BASE + '/js/main.js',
  BASE + '/js/game.js',
  BASE + '/js/map.js',
  BASE + '/js/scenarios.js',
  BASE + '/js/imagery.js',
  BASE + '/js/copilot.js',
  BASE + '/js/edu.js',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png',
];

// ── Install ────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => {
        // Don't block install if some assets fail (e.g. icons not yet deployed)
        console.warn('[SW] Pre-cache partial failure:', err);
        return self.skipWaiting();
      })
  );
});

// ── Activate: clean old caches ─────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== SHELL_CACHE && k !== IMAGE_CACHE && k !== FONT_CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch routing ──────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // NASA GIBS imagery — network-first, cache fallback
  if (url.hostname.includes('earthdata.nasa.gov')) {
    event.respondWith(_networkFirst(event.request, IMAGE_CACHE));
    return;
  }

  // Google Fonts — cache-first
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(_cacheFirst(event.request, FONT_CACHE));
    return;
  }

  // Same-origin app shell — cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(_cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  // Everything else — network only
  event.respondWith(fetch(event.request).catch(() =>
    new Response('Offline', { status: 503 })
  ));
});

// ── Strategies ─────────────────────────────────────────
async function _cacheFirst(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function _networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Transparent 1×1 PNG placeholder when fully offline
    return new Response(_transparentPng(), { headers: { 'Content-Type': 'image/png' } });
  }
}

function _transparentPng() {
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}

// Allow clients to trigger skipWaiting for instant updates
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
