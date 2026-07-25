// Iron Protocol - ui-today.js
// Today screen: macros, goals, banners, hero card
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// --- MACRO CHECK-IN ----------------------------------------------------------
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

function showMacroSheet(){
  var td=today();
  var logged=(S.macros&&S.macros[td])||{protein:0,carbs:0,fat:0};
  var t=getMacroTargets(S.next||'A');
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
// --- MACROS: derived from live measurements when available -------------------
// Mifflin-St Jeor BMR x activity factor for the session type. Falls back to the
// static programme table until a bodyweight measurement exists.
function getMacroTargets(type){
  type=type||S.next||'A';
  var base=MACRO_TARGETS[type]||MACRO_TARGETS.REST;
  var ms=S.measurements||[];
  var m=null;
  for(var i=ms.length-1;i>=0;i--){if(ms[i]&&ms[i].weight){m=ms[i];break;}}
  if(!m){var o=Object.assign({},base);o.derived=false;return o;}
  var w=m.weight, h=S.profile.height||164, age=S.profile.age||40;
  var bmr=10*w+6.25*h-5*age+5;
  var AF={A:1.60,B:1.65,C:1.60,REST:1.35};
  var kcal=Math.round(bmr*(AF[type]||1.4)/10)*10;
  var protein=Math.round(w*2.2);
  var fat=Math.round(w*0.95);
  var carbs=Math.max(0,Math.round((kcal-protein*4-fat*9)/4));
  return {kcal:kcal,protein:protein,carbs:carbs,fat:fat,
          derived:true,bmr:Math.round(bmr),basis:m.date};
}

function buildMacroCard(type){
  var td=today();
  var logged=(S.macros&&S.macros[td])||{protein:0,carbs:0,fat:0};
  var t=getMacroTargets(type);
  var kc=Math.round(logged.protein*4+logged.carbs*4+logged.fat*9);
  var kp=Math.min(100,Math.round(kc/t.kcal*100));
  var kcol=kp>=90?'var(--green)':kp>=60?'var(--amber)':'var(--txt3)';
  function bar(l,v,tg){
    var p=Math.min(100,Math.round(v/tg*100));
    var c=p>=90?'var(--green)':p>=60?'var(--amber)':'var(--txt3)';
    return '<div style="margin-bottom:8px">'
      +'<div style="display:flex;justify-content:space-between;margin-bottom:3px">'
      +'<span style="font-size:11px;font-weight:700;color:var(--txt2);letter-spacing:.02em">'+l+'</span>'
      +'<span style="font-size:11px;font-weight:800;color:'+c+';font-variant-numeric:tabular-nums">'+v+'<span style="color:var(--txt3);font-weight:600">/'+tg+'g</span></span>'
      +'</div>'
      +'<div style="height:4px;background:var(--border);border-radius:3px;overflow:hidden">'
      +'<div style="height:100%;width:'+p+'%;background:'+c+';border-radius:3px;transition:width .4s"></div>'
      +'</div></div>';
  }
  return '<div style="margin:10px 16px 0;background:var(--card);border:1px solid var(--border);border-radius:16px;padding:14px 15px">'
    +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:11px">'
    +'<div><div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--txt3)">TODAY\'S MACROS</div>'
    +'<div style="font-size:19px;font-weight:900;color:'+kcol+';margin-top:1px;font-variant-numeric:tabular-nums;letter-spacing:-.02em">'+kc+'<span style="font-size:12px;color:var(--txt3);font-weight:600"> / '+t.kcal+' kcal</span></div>'
    +'<div style="font-size:10px;color:var(--txt3);margin-top:1px">'+(t.derived?'From your measurements \u00b7 BMR '+t.bmr:'Programme default \u00b7 log weight in Metrics')+'</div></div>'
    +'<button onclick="showMacroSheet()" style="padding:7px 13px;border-radius:9px;border:1px solid var(--bord2);background:var(--bg3);color:var(--txt2);font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0">Log</button>'
    +'</div>'
    +bar('Protein',logged.protein,t.protein)+bar('Carbs',logged.carbs,t.carbs)+bar('Fat',logged.fat,t.fat)
    +'</div>';
}

function pickSession(t){
  var p=planToday();
  if(p.mode==='train'&&t===p.type){beginSession();return;}
  var msg=t===p.next
    ? SESSIONS[t].name+' is next in the plan, but today is '+(p.mode==='done'?'already done':'a recovery day')+'.\n\n'+p.reason
    : SESSIONS[t].name+' is not due yet. The plan runs A then B then C in order, and advances when a session is completed.';
  alert(msg);
}

function progressRing(pct,size,stroke,color,track,label,sub){
  var r=(size-stroke)/2, c=2*Math.PI*r, p=Math.max(0,Math.min(100,pct));
  var off=c*(1-p/100);
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" style="display:block;flex-shrink:0">'
    +'<circle cx="'+(size/2)+'" cy="'+(size/2)+'" r="'+r+'" fill="none" stroke="'+track+'" stroke-width="'+stroke+'"/>'
    +'<circle cx="'+(size/2)+'" cy="'+(size/2)+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="'+stroke
    +'" stroke-linecap="round" stroke-dasharray="'+c+'" stroke-dashoffset="'+off
    +'" transform="rotate(-90 '+(size/2)+' '+(size/2)+')" style="transition:stroke-dashoffset .6s ease"/>'
    +'<text x="50%" y="50%" text-anchor="middle" dy="'+(sub?'0.05em':'0.36em')+'" font-size="'+Math.round(size*0.25)
    +'" font-weight="900" fill="'+color+'" letter-spacing="-0.5">'+label+'</text>'
    +(sub?'<text x="50%" y="50%" text-anchor="middle" dy="1.5em" font-size="'+Math.round(size*0.1)
      +'" font-weight="700" fill="'+color+'" opacity=".65" letter-spacing="1">'+sub+'</text>':'')
    +'</svg>';
}

function dayStreak(){
  var days={};
  Object.keys(S.sessions).forEach(function(k){
    if(sessComp(k).pct>=100){days[(S.sessions[k].date||k.split('|')[0])]=1;}
  });
  var list=Object.keys(days).sort().reverse();
  if(!list.length)return 0;
  var ms=86400000, t=new Date(today()+'T12:00:00');
  var gap=Math.round((t-new Date(list[0]+'T12:00:00'))/ms);
  if(gap>1)return 0;
  var n=1, prev=new Date(list[0]+'T12:00:00');
  for(var i=1;i<list.length;i++){
    var d=new Date(list[i]+'T12:00:00');
    if(Math.round((prev-d)/ms)===1){n++;prev=d;}else break;
  }
  return n;
}

function tile(val,unit,label,color){
  var c=color||'var(--white)';
  return '<div style="background:var(--card);border:1px solid var(--border);border-radius:18px;padding:14px 14px 12px">'
    +'<div style="font-size:28px;font-weight:900;color:'+c+';letter-spacing:-.035em;line-height:1;font-variant-numeric:tabular-nums">'
    +val+(unit?'<span style="font-size:13px;font-weight:700;color:var(--txt3)">'+unit+'</span>':'')+'</div>'
    +'<div style="font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:var(--txt3);margin-top:7px">'+label+'</div>'
    +'</div>';
}

function renderToday(){
  var ph=getPhase(),phD=PHASES[ph],phWk=getPhaseWk();
  var phPct=Math.min(100,Math.round(phWk/phD.weeks*100));
  var td=today();
  var PLAN=syncPlan();
  var type=PLAN.mode==='train'?PLAN.type:'REST';
  var comp=compFor(td,type), sd=SESSIONS[type];
  var hr=new Date().getHours();
  var g=hr<12?'Good morning':hr<18?'Good afternoon':'Good evening';
  var doneToday=Object.keys(S.sessions).filter(function(k){
    return k.indexOf(td+'|')===0&&sessComp(k).pct>=100;
  }).map(function(k){return S.sessions[k].type;});
  var showAssess=!S.profile.assessmentDate||isPhaseEnd();
  var gp=goalPct(), gDone=completedSessions(), gTot=totalPlannedSessions();

  var h='<div style="padding-bottom:12px">';

  h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:18px 16px 0">'
   +'<div style="font-size:22px;font-weight:800;color:var(--white);letter-spacing:-.025em">'+g+', '+CUR_USER.name+'</div>'
   +'<div onclick="doLogout()" style="font-size:11px;font-weight:700;color:var(--txt3);cursor:pointer;padding:6px 10px;border:1px solid var(--border);border-radius:10px">Exit</div></div>';

  h+=xpBar();
  h+='<div style="display:flex;align-items:center;gap:9px;padding:11px 16px 0">'
   +'<span style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);background:rgba(232,160,42,.1);border:1px solid rgba(232,160,42,.22);border-radius:20px;padding:5px 11px;white-space:nowrap">PHASE '+(ph+1)+' \u00b7 '+phD.name+'</span>'
   +'<div style="flex:1;height:3px;background:var(--border);border-radius:2px;overflow:hidden">'
   +'<div style="height:100%;width:'+phPct+'%;background:var(--amber);border-radius:2px"></div></div>'
   +'<span style="font-size:10px;font-weight:800;color:var(--txt3);font-variant-numeric:tabular-nums">'+phPct+'%</span></div>';

  if(doneToday.length){
    h+='<div style="display:flex;gap:6px;padding:11px 16px 0;flex-wrap:wrap">'
     +doneToday.map(function(t){return '<span style="font-size:10px;font-weight:800;color:var(--green);background:rgba(61,184,122,.1);border:1px solid rgba(61,184,122,.22);border-radius:20px;padding:5px 11px">\u2713 '+t+' DONE</span>';}).join('')
     +'</div>';
  }

  // --- HERO: filled accent card with progress ring --------------------------
  var label=comp.pct>=100?'REPLAY SESSION':(comp.pct>0?'CONTINUE':(PLAN.mode==='train'?'START SESSION':'START RECOVERY'));
  var eyebrow=comp.pct>=100?'COMPLETE':(PLAN.mode==='train'?'TODAY \u00b7 PRESCRIBED':PLAN.title.toUpperCase());
  h+='<div style="margin:13px 16px 0;border-radius:24px;overflow:hidden;background:'+sd.col+'">'
   +'<div style="padding:18px 18px 16px;display:flex;align-items:center;gap:16px">'
   +progressRing(comp.pct,86,9,'rgba(10,14,22,.92)','rgba(10,14,22,.16)',comp.pct+'%')
   +'<div style="flex:1;min-width:0">'
   +'<div style="font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:rgba(10,14,22,.55)">'+eyebrow+'</div>'
   +'<div style="font-size:19px;font-weight:900;color:#0A0E16;letter-spacing:-.03em;line-height:1.15;margin-top:3px">'+sd.name+'</div>'
   +'<div style="font-size:11px;font-weight:700;color:rgba(10,14,22,.6);margin-top:3px">'+sd.dur+'</div>'
   +'</div></div>'
   +'<div style="padding:0 18px 16px">'
   +'<button onclick="beginSession()" style="width:100%;padding:13px;border:none;border-radius:14px;background:#0A0E16;color:'+sd.col+';font-size:13px;font-weight:900;letter-spacing:.06em;cursor:pointer">'+label+'</button></div>'
   +'<div style="display:flex;gap:1px;background:rgba(10,14,22,.14)">'
   +planStrip().map(function(x){
      var st=x.state;
      var op=st==='now'?'1':st==='done'?'.55':'.32';
      var mark=st==='done'?' \u2713':st==='locked'?' \u1F512':'';
      return '<div onclick="pickSession(\''+x.type+'\')" style="flex:1;padding:10px 4px;text-align:center;cursor:pointer;background:'
        +(st==='now'?'rgba(10,14,22,.18)':'transparent')+'">'
        +'<div style="font-size:12px;font-weight:900;color:#0A0E16;opacity:'+op+'">'+x.type+mark+'</div>'
        +'<div style="font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#0A0E16;opacity:'+(st==='now'?'.6':'.3')+';margin-top:2px">'
        +(st==='now'?'NOW':st==='done'?'DONE':'LOCKED')+'</div></div>';
    }).join('')+'</div></div>';

  if(PLAN.mode!=='train'){
    h+='<div style="margin:11px 16px 0;padding:13px 15px;background:rgba(74,158,219,.07);border:1px solid rgba(74,158,219,.22);border-radius:16px">'
     +'<div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--blue)">'+PLAN.title.toUpperCase()+'</div>'
     +'<div style="font-size:12px;color:var(--txt2);margin-top:4px;line-height:1.55">'+PLAN.reason+'</div>'
     +(PLAN.next?'<div style="font-size:11px;color:var(--txt3);margin-top:6px">Next up: <span style="color:'+SESSIONS[PLAN.next].col+';font-weight:800">'+SESSIONS[PLAN.next].name+'</span></div>':'')
     +'</div>';
  }

  // --- BENTO STATS ----------------------------------------------------------
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:11px 16px 0">'
   +tile(gp,'%','To Goal','var(--amber)')
   +tile(gDone,' /'+gTot,'Sessions')
   +tile(dayStreak(),'','Day Streak','var(--green)')
   +tile('P'+(ph+1),'','Phase \u00b7 Wk '+phWk)
   +'</div>';

  if(isDeloadWeek()){
    h+='<div style="margin:11px 16px 0;padding:11px 14px;background:rgba(74,158,219,.07);border:1px solid rgba(74,158,219,.2);border-radius:16px">'
     +'<div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--blue)">DELOAD WEEK</div>'
     +'<div style="font-size:11px;color:var(--txt2);margin-top:3px;line-height:1.5">One fewer set on main work. Same weight. Recovery is the stimulus.</div></div>';
  }

  h+=buildRpeBanner();

  if(showAssess){
    h+='<div style="padding:11px 16px 0"><button onclick="openAssessment()" style="width:100%;padding:13px;border-radius:16px;border:1px solid rgba(155,141,232,.28);background:rgba(155,141,232,.09);color:var(--purple);font-size:12px;font-weight:800;letter-spacing:.05em;cursor:pointer">'
     +(S.profile.assessmentDate?'PHASE COMPLETE \u2014 RE-ASSESS':'RUN BASELINE ASSESSMENT')+'</button>'
     +'<div style="font-size:10px;color:var(--txt3);text-align:center;padding-top:6px">'
     +(S.profile.assessmentDate?'Recalibrates loads for the next phase':'Sets your starting loads across every session')+'</div></div>';
  }

  h+=buildReassessmentBanner();
  h+=buildMacroCard(type);

  if(S.profile&&S.profile.assessmentDate){
    var n=(S.assessmentHistory&&S.assessmentHistory.length)||1;
    h+='<div onclick="showTab(\'settings\')" style="margin:11px 16px 0;padding:11px 14px;background:var(--bg3);border-left:2px solid var(--purple);border-radius:0 16px 16px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer">'
     +'<div><div style="font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:var(--purple)">CALIBRATED</div>'
     +'<div style="font-size:11px;color:var(--txt2);margin-top:2px">'+S.profile.assessmentDate+' \u00b7 '+n+' assessment'+(n!==1?'s':'')+'</div></div>'
     +'<div style="font-size:17px;color:var(--purple)">\u203a</div></div>';
  }

  var active=getActiveLandmarks().filter(function(l){return !l.done;});
  h+='<div class="sh">CURRENT GOALS</div>';
  if(!active.length){
    h+='<div style="padding:0 16px 10px"><div style="background:rgba(61,184,122,.09);border:1px solid rgba(61,184,122,.22);border-radius:16px;padding:13px 15px;font-size:12px;color:var(--green);font-weight:700">\u2713 All phase goals achieved \u2014 see Metrics</div></div>';
  }else{
    h+='<div style="padding:0 16px">'+active.slice(0,3).map(function(lm){
      return '<div class="lm" onclick="toggleLm(\''+lm.id+'\')"><i>'+lm.i+'</i>'
        +'<div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--white)">'+lm.g+'</div>'
        +'<div style="font-size:10px;color:var(--txt2)">'+lm.p+'</div></div><div class="lm-c">\u25cb</div></div>';
    }).join('')
    +'<div style="text-align:center;padding:8px 0"><span style="font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--txt3)">'
    +active.length+' OPEN IN PHASE '+(ph+1)+(active.length>3?' \u00b7 SHOWING 3':'')+'</span></div></div>';
  }

  h+='</div>';
  document.getElementById('v-today').innerHTML=h;
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
