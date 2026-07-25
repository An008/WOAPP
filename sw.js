// Iron Protocol - service worker
// Required for notifications on Android Chrome, where the bare Notification
// constructor throws "Illegal constructor" and only showNotification() works.
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
      for (var i=0;i<list.length;i++){
        if (list[i].url.indexOf('WOAPP') > -1 && 'focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
