// Iron Protocol - auth.js
// Login, profile entry, tab routing, overlays
// ASCII-ONLY: no byte above 0x7F may appear in this file.

function doLogin(){
  var name=(document.getElementById('ls-name').value||'').trim();
  var pwd=(document.getElementById('ls-pwd').value||'').trim();
  var errEl=document.getElementById('ls-err');
  if(!name||!pwd){errEl.textContent='Enter your name and password.';return;}
  // Check credentials against local USERS array \u2014 no network needed
  var user=USERS.find(function(u){return u.name.toLowerCase()===name.toLowerCase()&&u.pwd===pwd;});
  if(!user){errEl.textContent='Name or password incorrect.';return;}
  CUR_USER={name:user.name,type:user.type||'training'};
  errEl.textContent='Loading...';
  // Pull latest data from GitHub in background (non-blocking)
  var tk=_RTK();
  if(tk&&tk.indexOf('REPLACE')===-1){
    fetch('https://api.github.com/repos/'+GH_REPO+'/contents/data-'+user.name+'.json',
      {headers:{'Authorization':'token '+tk}})
    .then(function(r){return r.ok?r.json():null;})
    .then(function(d){
      if(d&&d.content){
        try{
          var cloud=JSON.parse(atob(d.content.replace(/\n/g,'')));
          // Never let a thinner cloud copy erase local work.
          var localRaw=localStorage.getItem(SK+'-'+user.name);
          var keep=cloud;
          if(localRaw){
            try{
              var loc=JSON.parse(localRaw);
              var nLoc=Object.keys(loc.sessions||{}).length;
              var nCld=Object.keys(cloud.sessions||{}).length;
              var mLoc=(loc.measurements||[]).length;
              var mCld=(cloud.measurements||[]).length;
              if(nLoc>nCld||mLoc>mCld)keep=loc;
            }catch(e){}
          }
          localStorage.setItem(SK+'-'+user.name,JSON.stringify(keep));
        }catch(e){}
      }
      _enterApp();
    })
    .catch(function(){_enterApp();});
  } else {
    _enterApp();
  }
}
function _enterApp(){
  loadS();
  document.getElementById('login-screen').style.display='none';
  document.getElementById('app').style.display='flex';
  curSessDate=today();
  curSessType=S.next||'A';
  showTab('today');
  startNotifCheck();
}

async function autoSyncToGH(){
  var tk=_RTK();
  if(!tk||tk.indexOf('REPLACE')>-1||!CUR_USER||!S)return;
  var path='data-'+CUR_USER.name+'.json';
  try{
    var shaRes=await fetch(_gh_url(path),{headers:{'Authorization':'token '+tk}});
    var sha=shaRes.ok?(await shaRes.json()).sha:null;
    var body={message:'Auto-sync '+CUR_USER.name+' '+today(),content:btoa(unescape(encodeURIComponent(JSON.stringify(S,null,2))))};
    if(sha)body.sha=sha;
    await fetch(_gh_url(path),{method:'PUT',headers:{'Authorization':'token '+tk,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}

// Auto-sync when app goes to background
document.addEventListener('visibilitychange',function(){
  if(document.visibilityState==='hidden'&&CUR_USER&&S){autoSyncToGH();}
  else if(document.visibilityState==='visible'){checkTrainingNotif();}
});

// ===========================================================
// TABS / OVERLAYS
// ===========================================================
var TABS=['today','history','journal','metrics','settings'];
function showTab(id){
  TABS.forEach(function(t){document.getElementById('v-'+t).classList.toggle('on',t===id);var nb=document.getElementById('nb-'+t);if(nb)nb.classList.toggle('on',t===id);});
  document.getElementById('nb-session').classList.remove('on');
  if(id==='today')renderToday();
  else if(id==='history')renderHistory();
  else if(id==='journal')renderJournalList();
  else if(id==='metrics')renderMetrics();
  else if(id==='settings')renderSettings();
}
function openOv(id){document.getElementById(id).classList.add('on');}
function closeOv(id){document.getElementById(id).classList.remove('on');}
