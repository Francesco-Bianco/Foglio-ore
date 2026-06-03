self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { clients.claim(); });
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/Foglio-ore/'));
});

var reminderTime = '21:00';
var lastNotified = '';

self.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'SCHEDULE') {
    reminderTime = e.data.time || '21:00';
  }
});

// Controlla ogni minuto se è ora di notificare
setInterval(function() {
  var now = new Date();
  var hh = String(now.getHours()).padStart(2,'0');
  var mm = String(now.getMinutes()).padStart(2,'0');
  var currentTime = hh + ':' + mm;
  var today = now.toDateString();

  if (currentTime === reminderTime && lastNotified !== today) {
    lastNotified = today;
    self.registration.showNotification('📋 Foglio Ore', {
      body: 'Inserisci i dati di oggi!',
      tag: 'foglio-ore',
      renotify: true
    });
  }
}, 60000);
