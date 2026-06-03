self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { clients.claim(); });
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/foglio-ore/'));
});

self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SCHEDULE') {
    var t = e.data.time || '21:00';
    scheduleNext(t);
  }
});

function scheduleNext(t) {
  var parts = t.split(':');
  var now = new Date();
  var next = new Date();
  next.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  var delay = next.getTime() - now.getTime();

  setTimeout(function() {
    self.registration.showNotification('📋 Foglio Ore', {
      body: 'Inserisci i dati di oggi!',
      icon: '/foglio-ore/icon.png',
      tag: 'foglio-ore',
      renotify: true
    });
    scheduleNext(t);
  }, delay);
}
