// Iron Protocol - ui-journal.js
// Breathing, journal entries, history list
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// -- BREATHING ------------------------------------------------------------------
function openBreath(){renderBreath();openOv('v-breathing');}
function stopBreath(){clearInterval(_brInt);_brInt=null;}
function renderBreath(){
  document.getElementById('br-body').innerHTML='<div class="br-ring" id="br-ring"><div style="font-size:18px;font-weight:900;color:var(--white)" id="br-ph">READY</div><div style="font-size:36px;font-weight:900;color:var(--white);margin-top:4px" id="br-n">\u2014</div></div>'
  +'<div style="font-size:14px;color:var(--txt2);margin-bottom:20px" id="br-rd">Round 1 of 3</div>'
  +'<div style="font-size:13px;color:var(--txt2);max-width:280px;line-height:1.6;text-align:center">Exhale all air. Hold on empty lungs. Tap the circle when you must breathe.</div>'
  +'<button class="btn btn-g" id="br-start" onclick="startBreath()" style="max-width:240px;margin-top:24px">&#9654; Start</button>'
  +'<div onclick="stopBreath();closeOv(\'v-breathing\')" style="margin-top:16px;font-size:14px;color:var(--txt3);cursor:pointer">Skip</div>';
}
function startBreath(){
  document.getElementById('br-start').style.display='none';
  var round=1,phase='exhale',count=3;
  function tick(){
    var ring=document.getElementById('br-ring'),ph=document.getElementById('br-ph'),n=document.getElementById('br-n'),rd=document.getElementById('br-rd');
    if(!ring){clearInterval(_brInt);return;}
    if(phase==='exhale'){ring.className='br-ring exh';ph.textContent='EXHALE';n.textContent=count;count--;if(count<0)phase='hold';}
    else if(phase==='hold'){ring.className='br-ring hld';ph.textContent='HOLD';n.textContent='&#9679;';clearInterval(_brInt);_brInt=null;ring.style.cursor='pointer';ring.onclick=function(){ring.onclick=null;ring.style.cursor='';phase='recover';count=5;_brInt=setInterval(tick,1000);};return;}
    else if(phase==='recover'){ring.className='br-ring inh';ph.textContent='RECOVER';n.textContent=count;count--;if(count<0){round++;if(round>3){clearInterval(_brInt);_brInt=null;ring.className='br-ring';ph.textContent='DONE';n.textContent='&#10003;';return;}if(rd)rd.textContent='Round '+round+' of 3';phase='exhale';count=3;}}
  }
  _brInt=setInterval(tick,1000);
}

// -- JOURNAL --------------------------------------------------------------------
function openJournalEntry(){var date=curSessDate||today();renderJournalEntry(date);showTab('journal');}
function renderJournalEntry(date){
  var j=S.journal[date]||{};
  document.getElementById('v-journal').innerHTML='<div class="hdr"><div class="hdr-ttl">Journal</div><div class="hdr-sub">'+fmtDate(date)+'</div></div>'
  +'<div style="padding:16px 18px;padding-bottom:calc(var(--nav-h)+20px)">'
  +'<div class="jq"><span class="jq-l">Body Scan</span><span class="jq-q">How did my body feel today?</span><textarea class="jq-i" id="jq1" oninput="svJ(\''+date+'\')">'+( j.q1||'')+'</textarea></div>'
  +'<div class="jq"><span class="jq-l">Surprise</span><span class="jq-q">What surprised me \u2014 positive or negative?</span><textarea class="jq-i" id="jq2" oninput="svJ(\''+date+'\')">'+( j.q2||'')+'</textarea></div>'
  +'<div class="jq"><span class="jq-l">Intention</span><span class="jq-q">What will I do differently next time?</span><textarea class="jq-i" id="jq3" oninput="svJ(\''+date+'\')">'+( j.q3||'')+'</textarea></div>'
  +'<button class="btn btn-g" onclick="svJ(\''+date+'\');showTab(\'today\')">&#10003; Save</button></div>';
}
function svJ(date){S.journal[date]={q1:document.getElementById('jq1').value,q2:document.getElementById('jq2').value,q3:document.getElementById('jq3').value};saveS();}
function renderJournalList(){
  var keys=Object.keys(S.journal).sort().reverse();
  if(!keys.length){document.getElementById('v-journal').innerHTML='<div class="hdr"><div class="hdr-ttl">Journal</div></div><div class="empty"><i>&#128214;</i><div style="font-size:17px;font-weight:700;color:var(--txt)">No entries yet</div><div>Opens after Session B.</div></div>';return;}
  document.getElementById('v-journal').innerHTML='<div class="hdr"><div class="hdr-ttl">Journal</div><div class="hdr-sub">'+keys.length+' entries</div></div>'+keys.map(function(d){var j=S.journal[d];return '<div onclick="renderJournalEntry(\''+d+'\')" style="padding:14px 18px;border-bottom:1px solid var(--border);cursor:pointer"><div style="font-size:11px;color:var(--txt2)">'+d+'</div><div style="font-size:14px;color:var(--white);margin-top:2px">'+( j.q1?j.q1.slice(0,55)+'..':'Entry logged')+'</div></div>';}).join('');
}

// -- HISTORY --------------------------------------------------------------------
function renderHistory(){
  var keys=Object.keys(S.sessions).sort().reverse();
  if(!keys.length){document.getElementById('v-history').innerHTML='<div class="hdr"><div class="hdr-ttl">History</div></div><div class="empty"><i>&#128197;</i><div style="font-size:17px;font-weight:700;color:var(--txt)">No sessions yet</div></div>';return;}
  var cols={A:'var(--amber)',B:'var(--blue)',C:'var(--red)',REST:'var(--txt3)'};
  document.getElementById('v-history').innerHTML='<div class="hdr"><div class="hdr-ttl">History</div><div class="hdr-sub">'+keys.length+' sessions</div></div>'+keys.map(function(d){var sess=S.sessions[d],sd=SESSIONS[sess.type],comp=sessComp(d);var c=cols[sess.type]||'var(--txt2)';var pc=comp.pct>=100?'var(--green)':comp.pct>0?'var(--amber)':'var(--txt3)';return '<div class="hi" onclick="curSessDate=\''+d+'\';curSessType=\''+sess.type+'\';beginSession()"><div class="hi-d" style="background:'+c+'"></div><div class="hi-dt">'+d+'</div><div style="flex:1"><div style="font-size:14px;font-weight:700;color:var(--white)">'+(sd?sd.name:sess.type)+'</div><div style="font-size:11px;color:var(--txt2)">'+(sd?sd.dur:'')+'</div></div><div style="font-size:13px;font-weight:800;color:'+pc+'">'+comp.pct+'%</div></div>';}).join('');
}
