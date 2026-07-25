// Iron Protocol - ui-today.js
// Today screen: macros, goals, banners, hero card
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// --- MACRO CHECK-IN ----------------------------------------------------------
function getMacroTargets(){
  var td=today();
  var type=(S.sessions[td]?S.sessions[td].type:S.next)||'A';
  return MACRO_TARGETS[type]||MACRO_TARGETS.REST;
}

function getLoadsHTML(loads){
  if(!loads)return '';
  var LN={'goblet':'Goblet Squat','db-row':'DB Row','suitcase':'Suitcase Carry','band-pa':'Band Pull-Apart','pushup':'Push-up','z2':'Zone 2 Run'};
  var html='<div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3);margin-bottom:8px">PRESCRIBED LOADS</div>';
  Object.keys(loads).forEach(function(k){
    var l=loads[k];if(!l)return;
    var v=l.weight?l.weight+'kg':l.bandLevel?l.bandLevel+' band':l.duration?l.duration+'min':'BW';
    var vol=l.sets&&l.reps?l.sets+'\u00d7'+l.reps:l.duration?l.duration+'min':'';
    var note=(l.note&&l.note!=='str')?'<div style="font-size:11px;color:var(--txt3);padding:2px 0 4px;font-style:italic">'+l.note+'</div>':'';
    html+='<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)"><span style="font-size:13px;color:var(--txt)">'+(LN[k]||k)+'</span><span style="font-size:13px;font-weight:700;color:var(--amber)">'+v+(vol?' \u00b7 '+vol:'')+'</span></div>'+note;
  });
  return html;
}
function buildReassessmentBanner(){
  if(!S.profile||!S.profile.assessmentDate)return '';
  var nextDate=S.profile.nextAssessmentDate||addDays(S.profile.assessmentDate,56);
  var days=daysUntil(nextDate);
  var count=(S.assessmentHistory&&S.assessmentHistory.length)||1;
  if(days>7)return '';
  var overdue=days<=0;
  var col=overdue?'var(--amber)':'var(--blue)';
  var bg=overdue?'rgba(232,160,42,.08)':'rgba(74,158,219,.07)';
  var bord=overdue?'rgba(232,160,42,.25)':'rgba(74,158,219,.2)';
  var msg=overdue?'Reassessment overdue':'Reassessment in '+days+' day'+(days!==1?'s':'');
  var sub=overdue?'Was due '+nextDate+' \u00b7 '+count+' previous assessment'+(count!==1?'s':''):
                  'Scheduled '+nextDate+' \u00b7 '+count+' previous'+(count!==1?' assessments':' assessment');
  return '<div style="margin:10px 18px 0;background:'+bg+';border:1px solid '+bord+';border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:12px;cursor:pointer" onclick="openAssessment()">'
    +'<div style="font-size:20px">&#128202;</div>'
    +'<div style="flex:1"><div style="font-size:13px;font-weight:800;color:'+col+'">'+msg+'</div>'
    +'<div style="font-size:12px;color:var(--txt2);margin-top:2px">'+sub+'</div></div>'
    +'<div style="font-size:12px;font-weight:700;color:'+col+'">Run &#8250;</div></div>';
}

function buildMacroCard(){
  var td=today();
  var logged=(S.macros&&S.macros[td])||{protein:0,carbs:0,fat:0};
  var t=getMacroTargets();
  var kcalLogged=Math.round(logged.protein*4+logged.carbs*4+logged.fat*9);
  var kcalPct=Math.min(100,Math.round(kcalLogged/t.kcal*100));
  var kcalCol=kcalPct>=90?'var(--green)':kcalPct>=60?'var(--amber)':'var(--txt3)';

  function bar(label,val,target){
    var pct=Math.min(100,Math.round(val/target*100));
    var col=pct>=90?'var(--green)':pct>=60?'var(--amber)':'var(--txt3)';
    return '<div style="margin-bottom:9px">'
      +'<div style="display:flex;justify-content:space-between;margin-bottom:3px">'
      +'<span style="font-size:12px;font-weight:700;color:var(--txt2)">'+label+'</span>'
      +'<span style="font-size:12px;font-weight:800;color:'+col+';font-variant-numeric:tabular-nums">'+val+'g <span style="color:var(--txt3);font-weight:600">/ '+target+'g</span></span>'
      +'</div>'
      +'<div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden">'
      +'<div style="height:100%;width:'+pct+'%;background:'+col+';border-radius:3px;transition:width .4s"></div>'
      +'</div></div>';
  }

  return '<div style="margin:10px 18px 0;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    +'<div><div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--txt3)">TODAY&#39;S MACROS</div>'
    +'<div style="font-size:15px;font-weight:800;color:'+kcalCol+';margin-top:2px;font-variant-numeric:tabular-nums">'+kcalLogged+' <span style="font-size:12px;color:var(--txt3);font-weight:600">/ '+t.kcal+' kcal</span></div></div>'
    +'<button onclick="showMacroSheet()" style="padding:7px 13px;border-radius:8px;border:1px solid var(--bord2);background:var(--bg3);color:var(--txt2);font-size:12px;font-weight:700;cursor:pointer">Log</button>'
    +'</div>'
    +bar('Protein',logged.protein,t.protein)
    +bar('Carbs',logged.carbs,t.carbs)
    +bar('Fat',logged.fat,t.fat)
    +'</div>';
}

function showMacroSheet(){
  var td=today();
  var logged=(S.macros&&S.macros[td])||{protein:0,carbs:0,fat:0};
  var t=getMacroTargets();
  var el=document.getElementById('macro-sheet');
  if(el)el.remove();
  var div=document.createElement('div');
  div.id='macro-sheet';
  div.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:600;background:var(--bg2);border:1px solid var(--border);border-radius:18px 18px 0 0;padding:20px 18px 44px;box-shadow:0 -8px 32px rgba(0,0,0,.4)';
  div.innerHTML='<div style="width:36px;height:4px;background:var(--bord2);border-radius:2px;margin:0 auto 18px"></div>'
    +'<div style="font-size:17px;font-weight:800;color:var(--white);margin-bottom:4px">Log Today&#39;s Macros</div>'
    +'<div style="font-size:12px;color:var(--txt2);margin-bottom:18px">Target: '+t.protein+'g protein &middot; '+t.carbs+'g carbs &middot; '+t.fat+'g fat &middot; '+t.kcal+' kcal</div>'
    +['Protein','Carbs','Fat'].map(function(n){var k=n.toLowerCase();return '<div style="margin-bottom:14px"><div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3);margin-bottom:5px">'+n+' (g)</div><input type="number" inputmode="numeric" id="ml-'+k+'" value="'+logged[k]+'" placeholder="0" style="width:100%;background:var(--bg3);border:1.5px solid var(--bord2);border-radius:10px;color:var(--white);font-size:18px;padding:11px 14px;-webkit-appearance:none"></div>';}).join('')
    +'<button onclick="saveMacroLog()" class="btn btn-g" style="margin-bottom:8px">&#10003; Save</button>'
    +'<button onclick="document.getElementById(\'macro-sheet\').remove()" class="btn" style="background:transparent;border:1px solid var(--border);color:var(--txt2)">Cancel</button>';
  document.body.appendChild(div);
}

function saveMacroLog(){
  var td=today();
  if(!S.macros)S.macros={};
  S.macros[td]={
    protein:parseInt(document.getElementById('ml-protein').value)||0,
    carbs:parseInt(document.getElementById('ml-carbs').value)||0,
    fat:parseInt(document.getElementById('ml-fat').value)||0
  };
  saveS();
  var el=document.getElementById('macro-sheet');if(el)el.remove();
  renderToday();
}


// ===========================================================
// TODAY
// ===========================================================

// --- PHASE-ADAPTIVE LANDMARKS -----------------------------------------------
var PHASE_LM=[
  ['l2','l3','l1','l6','l4'],   // Phase 1 Foundation
  ['l4','l1','l7','l5','l9'],   // Phase 2 Development
  ['l7','l8','l9','l5','l10'],  // Phase 3 Integration
  ['l11','l8','l10','l9','l7']  // Phase 4 Readiness
];
function getActiveLandmarks(){
  var ph=Math.min(getPhase(),3);
  return PHASE_LM[ph].map(function(id){return S.landmarks.find(function(lm){return lm.id===id;});}).filter(Boolean);
}
function renderToday(){
  var ph=getPhase(),phD=PHASES[ph],phWk=getPhaseWk(),pct=Math.min(100,Math.round(phWk/phD.weeks*100));
  var td=today(),ex=S.sessions[td];
  var todayType=ex?ex.type:S.next;
  var comp=sessComp(td);
  var heroType=(comp.pct>=100)?S.next:todayType;
  var sd=SESSIONS[heroType];
  var hr=new Date().getHours(),g=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening';
  document.getElementById('v-today').innerHTML='<div style="padding-bottom:8px">'
  +'<div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--txt3);padding:14px 18px 0">PHASE '+(ph+1)+' \u2014 '+phD.name+' \u00b7 WEEK '+phWk+'</div>'
  +'<div style="display:flex;justify-content:space-between;align-items:flex-end;padding:4px 18px 0"><div style="font-size:24px;font-weight:800;color:var(--white);line-height:1.2">'+g+',<br>'+CUR_USER.name+'</div><div onclick="doLogout()" style="font-size:12px;font-weight:700;color:var(--txt3);cursor:pointer;padding:4px 8px;border:1px solid var(--border);border-radius:6px">Sign out</div></div>'
  +'<div style="margin:12px 18px 0;background:var(--bg3);border:1px solid var(--bord2);border-radius:14px;padding:13px 16px"><div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--txt2)">'+phD.name+'</div><div style="font-size:16px;font-weight:800;color:var(--white);margin-top:2px">'+phD.desc+'</div><div style="margin-top:8px;height:4px;background:var(--border);border-radius:2px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--amber);border-radius:2px"></div></div><div style="font-size:11px;color:var(--txt3);margin-top:3px">Week '+phWk+' of '+phD.weeks+'</div></div>'
  +(comp.pct>=100&&heroType!==todayType?'<div style="margin:8px 18px 0;padding:8px 12px;background:rgba(61,184,122,.1);border:1px solid rgba(61,184,122,.25);border-radius:8px;display:flex;align-items:center;gap:8px"><div style="font-size:13px;color:var(--green)">\u2713</div><div style="font-size:12px;font-weight:700;color:var(--green)">'+SESSIONS[todayType].name+' complete today</div></div>':'')
  +'<div class="sh">TODAY</div>'
  +'<div class="hero '+sd.hero+'" style="cursor:pointer" onclick="beginSession()">'
  +'<div style="font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:'+sd.col+';opacity:.8;margin-bottom:4px">'+(comp.pct>=100&&heroType!==todayType?'NEXT \u2014 ':'')+sd.icon+' '+sd.name+'</div>'
  +'<div style="font-size:20px;font-weight:900;color:var(--white);margin-bottom:12px">'+sd.dur+'</div>'
  +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><div class="h-bar"><div class="h-fill" style="width:'+comp.pct+'%;background:'+sd.col+'"></div></div><div style="font-size:14px;font-weight:800;color:var(--white);width:40px;text-align:right">'+comp.pct+'%</div></div>'
  +'<button class="btn" style="background:rgba(255,255,255,.13)">'+(comp.pct>=100?'&#10003; SESSION COMPLETE':'&#9654; '+(comp.pct>0?'CONTINUE':'START')+' SESSION')+'</button>'
  +'</div>'
  +(isDeloadWeek()?'<div style="margin:10px 18px 0;padding:12px 14px;background:rgba(74,158,219,.08);border:1px solid rgba(74,158,219,.25);border-radius:10px"><div style="font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--blue)">DELOAD WEEK \u2014 Matveyev Wave Loading</div><div style="font-size:12px;color:var(--txt2);margin-top:3px">Reduce all main work sets by 1. Keep the same weight. Your body recovers; the neural adaptation holds. This produces more total adaptation than a third consecutive progressive week.</div></div>':'')
  +'<div style="padding:0 18px;margin-top:10px;display:flex;gap:8px"><button class="btn" style="background:rgba(155,141,232,.1);border:1px solid rgba(155,141,232,.2);color:var(--purple);font-size:13px" onclick="openAssessment()">&#128202; Run Assessment</button></div>'
  +buildReassessmentBanner()
  +buildMacroCard()
  +(S.profile&&S.profile.assessmentDate?'<div style="margin:10px 18px 0;padding:10px 14px;background:var(--bg3);border-left:3px solid var(--purple);border-radius:0 10px 10px 0;display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--purple)">PROGRAMME CALIBRATED</div><div style="font-size:12px;color:var(--txt2);margin-top:1px">'+S.profile.assessmentDate+' &middot; '+((S.assessmentHistory&&S.assessmentHistory.length)||1)+' assessment'+(((S.assessmentHistory&&S.assessmentHistory.length)||1)!==1?'s':'')+'</div></div><div style="font-size:12px;font-weight:700;color:var(--purple);cursor:pointer" onclick="showTab(\"settings\")">View &rsaquo;</div></div>':'')
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 18px;margin-top:10px"><div class="stat"><div class="stat-v">'+totalSess()+'</div><div class="stat-l">Sessions Done</div></div><div class="stat"><div class="stat-v">'+phWk+'</div><div class="stat-l">Week of Program</div></div></div>'
  +'<div class="sh">CURRENT GOALS</div>'
  +(function(){
    var active=getActiveLandmarks().filter(function(l){return !l.done;});
    if(active.length===0)return '<div style="padding:0 18px 10px"><div style="background:rgba(61,184,122,.1);border:1px solid rgba(61,184,122,.25);border-radius:10px;padding:12px 14px;font-size:13px;color:var(--green);font-weight:700">&#10003; All phase goals achieved! Check Metrics tab for achievements.</div></div>';
    return '<div style="padding:0 18px">'+active.map(function(lm){return '<div class="lm" onclick="toggleLm(\''+lm.id+'\')">'+'<i>'+lm.i+'</i><div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--white)">'+lm.g+'</div><div style="font-size:11px;color:var(--txt2)">'+lm.p+'</div></div>'+'<div class="lm-c">&#9675;</div></div>';}).join('')+'<div style="text-align:center;padding:6px 0"><span style="font-size:12px;color:var(--txt3)">Phase '+(getPhase()+1)+' goals \u00b7 '+active.length+' remaining</span></div></div>';
  })();
}
function toggleLm(id){
  var lm=S.landmarks.find(function(l){return l.id===id;});
  if(!lm)return;
  if(!lm.done){
    // Mark as achievement
    lm.done=true;lm.achievedDate=today();
    saveS();renderToday();
  }
}
