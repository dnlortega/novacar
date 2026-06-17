const CACHE = 'novacar-v2';
const STATIC = ['/', '/style.css', '/script.js', '/dynamic.js', '/favicon.svg', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.includes('/api/') || e.request.url.includes('/_next/')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok) {
        const toCache = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, toCache));
      }
      return res;
    }))
  );
});

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener('push', e => {
  const data = e.data?.json() ?? { title: 'NovaCar', body: 'Nova notificação' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body:    data.body,
      icon:    '/favicon.svg',
      badge:   '/favicon.svg',
      vibrate: [200, 100, 200],
      data:    { url: data.url || '/admin' },
      actions: [{ action: 'open', title: 'Abrir Painel' }],
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/admin';
  e.waitUntil(clients.matchAll({ type: 'window' }).then(wins => {
    const w = wins.find(w => w.url.includes('/admin'));
    return w ? w.focus() : clients.openWindow(url);
  }));
});
