// Shared by the Sales app and the Owner app (same GitHub Pages site).
// Strategy: open from the device instantly, and refresh the copy in the background, so a new version you upload
// is picked up the next time the app opens. Calls to the server (another website) are never touched.
const CACHE = 'cashbook-v3';
const FILES = ['./', './index.html', './RepApp.html', './owner.html', './manifest.json', './manifest-owner.json', './icon-192.png', './icon-512.png', './icon-owner-192.png', './icon-owner-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch: true});
    const net = fetch(e.request).then(r => { if (r && r.ok) c.put(u.pathname, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || (await c.match('./index.html'));
  }));
});
