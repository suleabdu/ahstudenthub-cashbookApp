// Used when the app is hosted on https (GitHub Pages). Caches the app so it opens offline and can be installed as a desktop app
// from Chrome/Edge. It always tries the network first, so staff get a new version of the app as soon as you upload it.
const CACHE = 'cashbook-rep-v2';
const FILES = ['./', './index.html', './RepApp.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;   // never touch calls to the server
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('./RepApp.html', {ignoreSearch: true}))));
});
