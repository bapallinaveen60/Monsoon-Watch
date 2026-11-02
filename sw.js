// ═══════════════════════════════════════════════════════
// INSAT-Sim — Service Worker
// Uses relative paths so it works on GitHub Pages
// (e.g. https://bapallinaveen60.github.io/Monsoon-Watch/)
// ═══════════════════════════════════════════════════════

const APP_VERSION = 'v2.2.7';
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
  BASE + '/js/api.js',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png',
];

// ── Cache access ───────────────────────────────────────
// Storage can be unavailable entirely: private windows, browsers set to
// block site data, or shields that disable the Cache API for an origin.
// caches.open() rejects there, so every caller must tolerate a null cache
// rather than letting the rejection escape into respondWith().
async function _openCache(name) {
  try {
    if (!self.caches) return null;
    return await caches.open(name);
  } catch (err) {
    console.warn('[SW] Cache unavailable:', err);
    return null;
  }
}

// ── Install ────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await _openCache(SHELL_CACHE);
      if (cache) {
        try {
          await cache.addAll(SHELL_ASSETS);
        } catch (err) {
          // Don't block install if some assets fail (e.g. icons not yet deployed)
          console.warn('[SW] Pre-cache partial failure:', err);
        }
      }
      await self.skipWaiting();
    })()
  );
});

// ── Activate: clean old caches ─────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter(k => k !== SHELL_CACHE && k !== IMAGE_CACHE && k !== FONT_CACHE)
            .map(k => caches.delete(k))
        );
      } catch (err) {
        console.warn('[SW] Cache cleanup skipped:', err);
      }
      await self.clients.claim();
    })()
  );
});

// ── Fetch routing ──────────────────────────────────────
self.addEventListener('fetch', event => {
  // Only GET is cacheable; let everything else go straight to the network.
  if (event.request.method !== 'GET') return;

  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }

  // Page navigations — network-first, so a deployed update is picked up on
  // the next load and a stale or unusable cache can never strand the app.
  if (event.request.mode === 'navigate') {
    event.respondWith(_navigate(event.request));
    return;
  }

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
  event.respondWith(
    fetch(event.request).catch(() => new Response('Offline', { status: 503 }))
  );
});

// ── Strategies ─────────────────────────────────────────
async function _navigate(request) {
  try {
    const response = await fetch(request);
    if (response.ok) await _put(SHELL_CACHE, request, response.clone());
    return response;
  } catch {
    const cached = await _match(SHELL_CACHE, request) ||
                   await _match(SHELL_CACHE, BASE + '/index.html');
    return cached || new Response(
      '<!doctype html><meta charset="utf-8"><title>Offline</title>' +
      '<body style="font:16px system-ui;padding:2rem">' +
      '<h1>Offline</h1><p>INSAT-Sim could not reach the network. ' +
      'Reconnect and reload to continue.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

async function _cacheFirst(request, cacheName) {
  const cached = await _match(cacheName, request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) await _put(cacheName, request, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function _networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) await _put(cacheName, request, response.clone());
    return response;
  } catch {
    const cached = await _match(cacheName, request);
    if (cached) return cached;
    // Transparent 1×1 PNG placeholder when fully offline
    return new Response(_transparentPng(), { headers: { 'Content-Type': 'image/png' } });
  }
}

// ── Cache helpers: never throw, never reject respondWith ───
async function _match(cacheName, request) {
  const cache = await _openCache(cacheName);
  if (!cache) return null;
  try {
    return (await cache.match(request)) || null;
  } catch {
    return null;
  }
}

async function _put(cacheName, request, response) {
  const cache = await _openCache(cacheName);
  if (!cache) return;
  try {
    await cache.put(request, response);
  } catch (err) {
    console.warn('[SW] Cache write skipped:', err);
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
