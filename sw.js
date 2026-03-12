const CACHE = 'gold-news-v1';
const ASSETS = ['./index.html','./manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if(e.request.url.includes('anthropic.com') || e.request.url.includes('newsapi') ||
     e.request.url.includes('finnhub') || e.request.url.includes('allorigins')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}')));
    return;
  }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});
