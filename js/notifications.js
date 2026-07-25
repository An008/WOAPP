// Iron Protocol - notifications.js
// Permission, daily reminder check, test notification
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// --- NOTIFICATIONS -----------------------------------------------------------
var _notifInt=null;

function requestNotifPermission(){
  if(!('Notification' in window))return Promise.resolve(false);
  if(Notification.permission==='granted')return Promise.resolve(true);
  return Notification.requestPermission().then(function(p){return p==='granted';});
}

function checkTrainingNotif(){
  if(!S||!CUR_USER)return;
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  var td=today();
  if(localStorage.getItem('iron-notif-'+td))return;
  var remindTime=(S.profile&&S.profile.remindTime)||'18:00';
  var parts=remindTime.split(':');
  var remindMins=parseInt(parts[0]||18)*60+parseInt(parts[1]||0);
  var now=new Date();
  var nowMins=now.getHours()*60+now.getMinutes();
  if(nowMins<remindMins)return;
  var comp=compFor(td,type);
  if(comp.pct>=100)return;
  var type=S.next||'A';
  var sd=SESSIONS[type];
  try{
    new Notification('Iron Protocol',{
      body:sd.name+' \u2014 '+sd.dur+' \u00b7 tap to open',
      tag:'iron-train-'+td,
      requireInteraction:false
    });
    localStorage.setItem('iron-notif-'+td,'1');
  }catch(e){}
}

function startNotifCheck(){
  clearInterval(_notifInt);
  _notifInt=setInterval(checkTrainingNotif,60000);
  checkTrainingNotif();
}
