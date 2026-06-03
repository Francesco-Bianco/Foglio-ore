self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  clients.claim();
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/foglio-ore/'));
});

// Notifica giornaliera alle 21:00
self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATION') {
    scheduleDailyNotification();
  }
});

function scheduleDailyNotification() {
  var now = new Date();
  var next21 = new Date();
  next21.setHours(21, 0, 0, 0);
  if (next21 <= now) {
    next21.setDate(next21.getDate() + 1);
  }
  var delay = next21.getTime() - now.getTime();

  setTimeout(function() {
    self.registration.showNotification('📋 Foglio Ore', {
      body: 'Inserisci i dati di oggi!',
      icon: '/foglio-ore/icon.png',
      badge: '/foglio-ore/icon.png',
      tag: 'foglio-ore-daily',
      renotify: true
    });
    // Ripianifica per il giorno dopo
    scheduleDailyNotification();
  }, delay);
}
