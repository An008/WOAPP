// Iron Protocol - wakelock.js
// Screen Wake Lock, scoped deliberately to an ACTIVE MISSION only.
//
// Two things make naive implementations fail:
//   1. The lock is auto-released the moment the page is backgrounded, so it
//      must be re-acquired on visibilitychange or it dies after one phone call.
//   2. Holding it outside a mission is pure battery drain for no benefit.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var WAKE_SENTINEL=null;
var WAKE_WANTED=false;
var WAKE_ERR=null;

function wakeSupported(){
  return (typeof navigator!=='undefined')&&('wakeLock' in navigator)&&!!navigator.wakeLock;
}
function wakeEnabled(){
  return !(S&&S.profile&&S.profile.keepAwake===false);   // opt-out, on by default
}
function wakeActive(){return !!WAKE_SENTINEL;}

function wakeAcquire(){
  WAKE_ERR=null;
  if(!wakeSupported()){WAKE_ERR='Not supported in this browser';return Promise.resolve(false);}
  if(!wakeEnabled()){WAKE_ERR='Disabled in Setup';return Promise.resolve(false);}
  WAKE_WANTED=true;
  if(WAKE_SENTINEL)return Promise.resolve(true);
  try{
    return navigator.wakeLock.request('screen').then(function(sen){
      WAKE_SENTINEL=sen;
      // The browser releases this on its own terms - track it so we can retake it
      if(sen.addEventListener)sen.addEventListener('release',function(){WAKE_SENTINEL=null;});
      return true;
    }).catch(function(e){
      WAKE_ERR=(e&&e.message)||'Request refused';
      return false;
    });
  }catch(e){
    WAKE_ERR=(e&&e.message)||'Request threw';
    return Promise.resolve(false);
  }
}

function wakeRelease(){
  WAKE_WANTED=false;
  if(WAKE_SENTINEL){
    try{WAKE_SENTINEL.release();}catch(e){}
    WAKE_SENTINEL=null;
  }
}

// Re-take the lock whenever we come back to the foreground mid-mission.
// Without this the screen sleeps again after the first interruption.
if(typeof document!=='undefined'&&document.addEventListener){
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'&&WAKE_WANTED&&!WAKE_SENTINEL)wakeAcquire();
  });
}

function wakeStatus(){
  return {supported:wakeSupported(),enabled:wakeEnabled(),
          active:wakeActive(),wanted:WAKE_WANTED,error:WAKE_ERR};
}
