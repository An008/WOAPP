// Iron Protocol - ui-settings.js
// Setup tab, notification controls, data reset, logout
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// -- SETTINGS -------------------------------------------------------------------
function renderSettings(){
  var ph=getPhase(),phWk=getPhaseWk();
  document.getElementById('v-settings').innerHTML='<div class="hdr"><div class="hdr-ttl">Setup</div></div>'
  +'<div class="sh">PROFILE</div>'
  +'<div style="background:var(--bg3);border:1px solid var(--bord2);border-radius:12px;margin:0 18px 10px;padding:14px;display:flex;align-items:center;gap:12px">'
  +'<div style="width:44px;height:44px;border-radius:12px;background:rgba(232,160,42,.18);color:var(--amber);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900">'+CUR_USER.name.substring(0,2).toUpperCase()+'</div>'
  +'<div style="flex:1"><div style="font-size:16px;font-weight:700;color:var(--white)">'+CUR_USER.name+'</div><div style="font-size:11px;color:var(--txt2);margin-top:2px">'+CUR_USER.type.toUpperCase()+' profile</div></div>'
  +'<button onclick="doLogout()" style="padding:8px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg3);color:var(--txt2);font-size:13px;font-weight:700;cursor:pointer">Sign out</button></div>'
  +(CUR_USER.type==='test'?'<div style="padding:0 18px 10px"><button onclick="if(confirm(\'Clear all training data for '+CUR_USER.name+'?\')){localStorage.removeItem(\''+SK+'-'+CUR_USER.name+'\');loadS();renderToday();renderSettings();}" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(155,141,232,.3);background:rgba(155,141,232,.08);color:var(--purple);font-size:13px;font-weight:700;cursor:pointer">&#128465; Clear Test Data</button></div>':'')
  +'<div class="sh">PROGRAMME</div>'
  +'<div class="sr"><div class="sr-l">Age</div><input class="sr-i" type="number" inputmode="numeric" value="'+(S.profile.age||40)+'" onchange="S.profile.age=parseInt(this.value)||40;saveS();"></div>'
  +'<div class="sr"><div class="sr-l">Height (cm)</div><input class="sr-i" type="number" inputmode="numeric" value="'+(S.profile.height||164)+'" onchange="S.profile.height=parseInt(this.value)||164;saveS()"></div>'
  +'<div class="sr"><div class="sr-l">Start Date</div><input class="sr-i" type="date" value="'+S.profile.start+'" onchange="S.profile.start=this.value;saveS();renderToday()"></div>'
  +'<div class="sr"><div class="sr-l">Phase</div><div style="color:var(--amber);font-size:14px">Phase '+(ph+1)+' \u2014 '+PHASES[ph].name+'</div></div>'
  +'<div class="sr"><div class="sr-l">Phase Week</div><div style="color:var(--amber);font-size:14px">'+phWk+'</div></div>'
  +(S.profile.assessmentDate?'<div class="sr"><div class="sr-l">Last Assessment</div><div style="color:var(--green);font-size:13px">'+S.profile.assessmentDate+'</div></div>':'')
  +'<div class="sh">ASSESSMENT</div>'
+(S.profile&&S.profile.assessmentDate?
  '<div style="margin:0 18px 10px;background:var(--bg3);border:1px solid rgba(155,141,232,.3);border-radius:12px;padding:14px">'
  +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">'
  +'<div><div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3)">Last assessment</div>'
  +'<div style="font-size:14px;font-weight:700;color:var(--white)">'+S.profile.assessmentDate+'</div></div>'
  +(S.profile.nextAssessmentDate?'<div style="text-align:right"><div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3)">Next</div>'
  +'<div style="font-size:14px;font-weight:700;color:var(--amber)">'+S.profile.nextAssessmentDate+'</div></div>':'')
  +'</div>'
  +(S.profile.assessmentSummary?'<div style="font-size:13px;color:var(--txt2);line-height:1.6;margin-bottom:10px">'+S.profile.assessmentSummary+'</div>':'')
  +(S.profile.assessmentLoads?getLoadsHTML(S.profile.assessmentLoads):'')
  +'</div>'
  +(S.assessmentHistory&&S.assessmentHistory.length>1?
    '<div class="sh" style="padding-top:8px">ASSESSMENT HISTORY</div>'
    +S.assessmentHistory.slice().reverse().slice(0,5).map(function(a){
      return '<div style="padding:10px 18px;border-bottom:1px solid var(--border)">'
        +'<div style="display:flex;justify-content:space-between">'
        +'<span style="font-size:13px;font-weight:700;color:var(--white)">'+a.date+'</span>'
        +'<span style="font-size:12px;color:var(--txt2)">Phase '+a.phase+' Wk '+a.phaseWeek+'</span></div>'
        +(a.priority?'<div style="font-size:12px;color:var(--amber);margin-top:2px">Priority: '+a.priority+'</div>':'')
        +'</div>';
    }).join('')
  :'')
:'<div style="padding:0 18px 10px;font-size:13px;color:var(--txt2)">No assessment completed yet. Tap below to calibrate your starting loads.</div>')
+'<div style="padding:0 18px 12px"><button onclick="closeOv(\'v-assessment\');openAssessment()" class="btn" style="background:rgba(155,141,232,.1);border:1px solid rgba(155,141,232,.3);color:var(--purple);">'
+(S.profile&&S.profile.assessmentDate?'&#128202; Re-run Assessment':'&#128202; Run Assessment')+'</button></div>'
+'<div class="sh">AI COACH</div>'
  +'<div style="padding:0 18px 10px;font-size:13px;color:var(--txt2);line-height:1.6">Free Groq key at <strong style="color:var(--white)">console.groq.com</strong> (keys start with gsk_). Also accepts Google AI keys (AIza).</div>'
  +'<div class="sr"><div class="sr-l">API Key</div><input class="sr-i" type="password" value="'+getApiKey()+'" placeholder="gsk_ or AIza..." onchange="setApiKey(this.value);renderSettings()" style="width:180px;font-size:12px"></div>'
  +(getApiKey()?'<div style="padding:4px 18px 10px;font-size:12px;color:var(--green)">&#10003; '+(getApiKey().startsWith('gsk_')?'Groq connected':'Gemini connected')+'</div>':'')
  +'<div class="sh">OVERRIDE NEXT SESSION</div>'
  +'<div class="sr"><div class="sr-l">Next session</div><div style="display:flex;gap:6px">'+['A','B','C'].map(function(t){return '<button onclick="S.next=\''+t+'\';saveS();renderSettings();" style="padding:8px 14px;border-radius:8px;border:1px solid '+(S.next===t?'var(--amber)':'var(--border)')+';background:'+(S.next===t?'rgba(232,160,42,.15)':'var(--bg3)')+';color:'+(S.next===t?'var(--amber)':'var(--txt2)')+';font-weight:700;font-size:13px;cursor:pointer">'+t+'</button>';}).join('')+'</div></div>'
  +'<div class="sh">TIMELINE</div>'
  +'<div style="padding:14px 18px;background:var(--card);margin:0 18px;border-radius:12px;border:1px solid var(--border);font-size:14px;color:var(--txt2);line-height:1.85">Phase 1 Foundation: <span style="color:var(--white);font-weight:700">Weeks 1\u20138</span><br>Phase 2 Development: <span style="color:var(--white);font-weight:700">Weeks 9\u201320</span><br>Phase 3 Integration: <span style="color:var(--white);font-weight:700">Weeks 21\u201336</span><br>Phase 4 Readiness: <span style="color:var(--white);font-weight:700">Weeks 37\u201348</span><br><div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">Finland X: <span style="color:var(--amber);font-weight:700">~12 months</span></div></div>'
  +'<div class="sh">REMINDERS</div>'
  +'<div class="sr"><div class="sr-l">Daily training reminder</div><input class="sr-i" type="time" value="'+(S.profile.remindTime||'18:00')+'" onchange="S.profile.remindTime=this.value;saveS()"></div>'
  +('Notification' in window?
    Notification.permission==='granted'?
      '<div style="padding:6px 18px 12px">'
    +'<div style="padding:10px 14px;background:rgba(61,184,122,.1);border:1px solid rgba(61,184,122,.2);border-radius:10px;margin-bottom:8px">'  
    +'<div style="font-size:12px;font-weight:800;color:var(--green)">\u2713 Enabled \u2014 fires at '+(S.profile.remindTime||'18:00')+' if session not done</div></div>'
    +'<button onclick="testNotif()" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(61,184,122,.3);background:rgba(61,184,122,.08);color:var(--green);font-size:13px;font-weight:700;cursor:pointer">Send Test Notification</button></div>':
      Notification.permission==='denied'?
    '<div style="padding:6px 18px 12px"><div style="padding:10px 14px;background:rgba(227,80,80,.08);border:1px solid rgba(227,80,80,.2);border-radius:10px">'
    +'<div style="font-size:12px;font-weight:800;color:var(--red)">\u2715 Blocked by browser</div>'
    +'<div style="font-size:11px;color:var(--txt2);margin-top:3px">Browser Settings \u2192 Notifications \u2192 allow an008.github.io</div></div></div>'
    :'<div style="padding:6px 18px 12px">'
    +'<div style="padding:10px 14px;background:rgba(74,158,219,.08);border:1px solid rgba(74,158,219,.2);border-radius:10px;margin-bottom:8px">'
    +'<div style="font-size:12px;font-weight:700;color:var(--blue)">Not enabled yet</div>'
    +'<div style="font-size:11px;color:var(--txt2);margin-top:2px">Tap the button below \u2014 a permission dialog will appear.</div></div>'
    +'<button onclick="requestNotifPermission().then(function(){renderSettings();})" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(74,158,219,.3);background:rgba(74,158,219,.08);color:var(--blue);font-size:13px;font-weight:700;cursor:pointer">Enable Training Reminders</button></div>'
  :'<div style="padding:4px 18px 10px;font-size:12px;color:var(--txt3)">Notifications not supported in this browser</div>')
  +'<div style="padding:20px 18px 6px;text-align:center;font-size:11px;color:var(--txt3)">IRON PROTOCOL v'+APP_VERSION+'</div>'
  +'<div style="height:20px"></div>';
}

// -- INIT ----------------------------------------------------------------------
// --- MEASUREMENTS + GOALS/ACHIEVEMENTS -------------------------------------

function testNotif(){
  if(!('Notification' in window)||Notification.permission!=='granted'){alert('Enable notifications in Setup tab first.');return;}
  try{new Notification('Iron Protocol',{body:'Reminders are active. You will be notified at '+(S&&S.profile&&S.profile.remindTime?S.profile.remindTime:'18:00')+'.',tag:'iron-test'});}catch(e){alert('Notification error: '+e.message);}
}
function clearTestData(){
  if(!CUR_USER){alert('Not logged in.');return;}
  var typed=prompt('Type CLEAR to erase all training data for '+CUR_USER.name+'. This cannot be undone.');
  if(typed!=='CLEAR'){alert('Cancelled.');return;}
  localStorage.removeItem(DATA_PFX+CUR_USER.name);
  loadS();renderToday();renderSettings();
  alert('Data cleared for '+CUR_USER.name+'.');
}
function doLogout(){S=null;CUR_USER=null;document.getElementById('app').style.display='none';document.getElementById('login-screen').style.display='flex';document.getElementById('ls-name').value='';document.getElementById('ls-pwd').value='';document.getElementById('ls-err').textContent='';}

// ===========================================================
// SESSION OVERVIEW
