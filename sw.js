self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// عند الضغط على الإشعار يُفتح التطبيق أو يُعرض إن كان مفتوحاً
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(list =>
      list.length ? list[0].focus() : self.clients.openWindow('./index.html')
    )
  );
});

// نعرض النسخة الأحدث من الشبكة، ونستعمل النسخة المحفوظة عند انقطاع الإنترنت
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});