// Kill switch: retires the old Bone Rising service worker that used to be
// registered at this scope (root). Bone Rising itself now lives at
// /bone-rising/ with its own service worker, so nothing here should keep
// running long-term.
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clientList) {
        clientList.forEach(function (client) { client.navigate(client.url); });
      })
  );
});
