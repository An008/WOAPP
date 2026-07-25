// Iron Protocol - notifications.js
// Android Chrome forbids `new Notification(...)` outright ("Illegal
// constructor") and only accepts ServiceWorkerRegistration.showNotification().
// Everything routes through the service worker, with a desktop fallback.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var _notifInt=null;
var SW_REG=null;
var NOTIF_LAST_ERR=null;

function notifSupported(){return ('Notification' in window);}
function swSupported(){return ('serviceWorker' in navigator);}

function registerSW(){
  if(!swSupported())return Promise.resolve(null);
  if(SW_REG)return Promise.resolve(SW_REG);
  return navigator.serviceWorker.register('sw.js')
    .then(function(){return navigator.serviceWorker.ready;})
    .then(function(reg){SW_REG=reg;return reg;})
    .catch(function(e){NOTIF_LAST_ERR='SW register failed: '+e.message;return null;});
}

function requestNotifPermission(){
  if(!notifSupported())return Promise.resolve(false);
  if(Notification.permission==='granted')return registerSW().then(function(){return true;});
  return Notification.requestPermission().then(function(p){
    if(p!=='granted')return false;
    return registerSW().then(function(){return true;});
  });
}

// Single path for firing anything. Resolves true on success.
function fireNotification(title,body,tag){
  NOTIF_LAST_ERR=null;
  if(!notifSupported()){NOTIF_LAST_ERR='Notification API unavailable';return Promise.resolve(false);}
  if(Notification.permission!=='granted'){NOTIF_LAST_ERR='Permission not granted';return Promise.resolve(false);}
  var opts={body:body,tag:tag||'iron',renotify:false,requireInteraction:false,
            icon:'icon.png',badge:'icon.png'};
  return registerSW().then(function(reg){
    if(reg&&reg.showNotification){
      return reg.showNotification(title,opts).then(function(){return true;});
    }
    try{new Notification(title,opts);return true;}
    catch(e){NOTIF_LAST_ERR=e.message;return false;}
  }).catch(function(e){
    try{new Notification(title,opts);return true;}
    catch(e2){NOTIF_LAST_ERR=(e&&e.message)||e2.message;return false;}
  });
}

function checkTrainingNotif(){
  if(!S||!CUR_USER)return;
  if(!notifSupported()||Notification.permission!=='granted')return;
  var td=today();
  if(localStorage.getItem('iron-notif-'+td))return;
  var remindTime=(S.profile&&S.profile.remindTime)||'18:00';
  var parts=remindTime.split(':');
  var remindMins=parseInt(parts[0]||18)*60+parseInt(parts[1]||0);
  var now=new Date();
  if(now.getHours()*60+now.getMinutes()<remindMins)return;
  var p=(typeof planToday==='function')?planToday():{mode:'train',type:S.next||'A'};
  if(p.mode!=='train')return;
  var type=p.type;
  if(compFor(td,type).pct>=100)return;
  var sd=SESSIONS[type];
  fireNotification('Iron Protocol',
    sd.name+' \u2014 '+sd.dur+' \u00b7 mission authorised',
    'iron-mission-'+td).then(function(ok){
      if(ok)localStorage.setItem('iron-notif-'+td,'1');
    });
}

function startNotifCheck(){
  clearInterval(_notifInt);
  if(notifSupported()&&Notification.permission==='granted')registerSW();
  _notifInt=setInterval(checkTrainingNotif,60000);
  checkTrainingNotif();
}

// Reported verbatim in Setup so a failure is diagnosable rather than silent
function notifDiagnostics(){
  return {
    api: notifSupported(),
    permission: notifSupported()?Notification.permission:'n/a',
    sw: swSupported(),
    swReady: !!SW_REG,
    secure: (location.protocol==='https:'||location.hostname==='localhost'),
    standalone: !!(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches),
    lastError: NOTIF_LAST_ERR
  };
}
