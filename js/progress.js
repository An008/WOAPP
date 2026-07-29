// Iron Protocol - progress.js
// Output indicators: XP, levels, rank, development map.
// Every value is DERIVED from logged work at read time. Nothing is stored, so
// nothing can desync or be inflated by editing storage. RPE remains the only
// input/performance signal; this file is strictly a mirror of what was done.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var XP={session:100,partial:40,goal:250,assessment:150,measurement:25,journal:15,phase:500};

var RANKS=[
  {min:1, name:'RECRUIT',        note:'In processing. Building the base.'},
  {min:5, name:'CANDIDATE',      note:'Accepted for selection. Volume rising.'},
  {min:10,name:'SELECTION',      note:'Under assessment. Load and endurance tested.'},
  {min:15,name:'OPERATOR',       note:'Qualified. Capable across all mission types.'},
  {min:20,name:'SENIOR OPERATOR',note:'Proven under fatigue. Consistently mission capable.'},
  {min:25,name:'TIER ONE',       note:'Full qualification. The task now is holding it.'}
];


// --- OPERATIONAL READINESS ---------------------------------------------------
// Rank is earned and never lost. Readiness is current and must be held. This is
// the mechanic that gives "maintaining the rank" teeth once Tier One is reached.
var READY_STATES=[
  {min:85,name:'FULLY MISSION CAPABLE',short:'FMC', col:'#3DB87A'},
  {min:60,name:'MISSION CAPABLE',      short:'MC',  col:'#E8A02A'},
  {min:35,name:'DEGRADED',             short:'DEG', col:'#E35050'},
  {min:0, name:'NON-OPERATIONAL',      short:'NOP', col:'#E35050'}
];

function readiness(){
  var t=today();
  var startGap=S.profile&&S.profile.start?daysBetween(S.profile.start,t):0;
  if(startGap<0)startGap=0;
  // expectation ramps over the first three weeks, then holds at 9 per 21 days
  var expected=Math.max(1,Math.min(9,Math.floor(startGap/7*3)||1));
  var recent=trainingDates().filter(function(d){return daysBetween(d,t)<21;}).length;
  var adherence=Math.min(100,Math.round(recent/expected*100));
  var gap=Math.max(0,daysSinceTraining());
  var recency=gap<=3?100:gap<=5?80:gap<=7?55:gap<=14?25:0;
  var score=Math.round(adherence*0.6+recency*0.4);
  var st=READY_STATES[READY_STATES.length-1];
  for(var i=0;i<READY_STATES.length;i++){if(score>=READY_STATES[i].min){st=READY_STATES[i];break;}}
  return {score:score,adherence:adherence,recency:recency,expected:expected,
          recent:recent,gap:gap,state:st};
}

// Sustainment begins once every prescribed mission has been executed
function isSustainment(){return completedTraining()>=totalPlannedSessions();}
function sustainmentDays(){
  if(!isSustainment())return 0;
  var d=trainingDates();
  if(!d.length)return 0;
  return daysBetween(d[Math.min(totalPlannedSessions()-1,d.length-1)],today());
}

// Tuned so executing every prescribed mission plus standards and
// assessments arrives at TIER ONE (T25) - qualification and programme
// completion are the same moment.
function xpToNext(level){return 300+40*level;}

function xpBreakdown(){
  var b={sessions:0,partial:0,goals:0,assessments:0,measurements:0,journal:0,phases:0};
  var full=0,part=0;
  Object.keys(S.sessions||{}).forEach(function(k){
    var p=sessComp(k).pct;                 // completed objectives only
    if(p>=100){full++;b.sessions+=XP.session;}
    else if(p>=50){part++;b.partial+=XP.partial;}
  });
  var goals=(S.landmarks||[]).filter(function(l){return l.done;}).length;
  var asmt=(S.assessmentHistory||[]).length;
  var meas=(S.measurements||[]).length;
  var jrnl=Object.keys(S.journal||{}).length;
  var phases=getPhase();
  b.goals=goals*XP.goal;
  b.assessments=asmt*XP.assessment;
  b.measurements=meas*XP.measurement;
  b.journal=jrnl*XP.journal;
  b.phases=phases*XP.phase;
  b.counts={sessions:full,partial:part,goals:goals,assessments:asmt,
            measurements:meas,journal:jrnl,phases:phases};
  b.total=b.sessions+b.partial+b.goals+b.assessments+b.measurements+b.journal+b.phases;
  return b;
}

function levelState(){
  var total=xpBreakdown().total, lvl=1, spent=0;
  while(total-spent>=xpToNext(lvl)&&lvl<99){spent+=xpToNext(lvl);lvl++;}
  var into=total-spent, need=xpToNext(lvl);
  var rank='NOVICE';
  RANKS.forEach(function(r){if(lvl>=r.min)rank=r.name;});
  return {level:lvl,into:into,need:need,total:total,rank:rank,
          pct:Math.min(100,Math.round(into/need*100))};
}

// Compact level strip for the Today screen
function xpBar(){
  var L=levelState(), R=readiness(), sus=isSustainment();
  return '<div style="margin:12px 16px 0;background:var(--card);border:1px solid var(--border);border-radius:16px;padding:12px 14px">'
    +'<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">'
    +'<div style="display:flex;align-items:baseline;gap:8px;min-width:0">'
    +'<span style="font-size:14px;font-weight:900;color:var(--amber);letter-spacing:-.01em;white-space:nowrap">'+L.rank+'</span>'
    +'<span style="font-size:9px;font-weight:800;letter-spacing:.14em;color:var(--txt3)">T'+L.level+'</span></div>'
    +'<span style="font-size:9px;font-weight:800;letter-spacing:.12em;color:'+R.state.col+';white-space:nowrap">'+R.state.short+' '+R.score+'%</span>'
    +'</div>'
    +'<div style="display:flex;gap:3px">'
    +[0,1,2,3,4,5,6,7,8,9].map(function(i){
       var on=(sus?R.score:L.pct)>i*10;
       return '<div style="flex:1;height:5px;border-radius:2px;background:'+(on?(sus?R.state.col:'var(--amber)'):'rgba(255,255,255,.07)')+'"></div>';
     }).join('')
    +'</div>'
    +'<div style="font-size:9px;font-weight:700;letter-spacing:.06em;color:var(--txt3);margin-top:6px">'
    +(sus?'SUSTAINMENT \u00b7 HOLD READINESS':'MERIT '+L.into+' / '+L.need+' TO NEXT RANK')+'</div>'
    +'</div>';
}


// --- OPERATOR ATTRIBUTES -----------------------------------------------------
// Physical state read off the Body tab measurements, not self-reported.
function operatorFatigue(){
  if(typeof muscleRecovery!=='function')return null;
  var rec=muscleRecovery();
  var ks=Object.keys(rec);
  if(!ks.length)return null;
  var trained=ks.filter(function(k){return rec[k].days!==null;});
  if(!trained.length)return 0;
  var mean=ks.reduce(function(a,k){return a+rec[k].pct;},0)/ks.length;
  return Math.max(0,Math.min(100,Math.round(100-mean)));
}

function attributeBand(){
  var comp=(typeof bodyComp==='function')?bodyComp():null;
  var fat=operatorFatigue();
  var mt=(typeof macroTargets==='function')?macroTargets('A'):null;

  function cell(label,val,unit,col,sub){
    return '<div style="flex:1;min-width:0;background:rgba(10,14,22,.3);border-radius:12px;padding:10px 11px">'
      +'<div style="font-size:8px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:var(--txt3)">'+label+'</div>'
      +'<div style="font-size:16px;font-weight:900;color:'+(col||'var(--white)')+';font-variant-numeric:tabular-nums;line-height:1.25">'
      +val+(unit?'<span style="font-size:10px;font-weight:700;color:var(--txt3)">'+unit+'</span>':'')+'</div>'
      +(sub?'<div style="font-size:8px;font-weight:700;color:var(--txt3);margin-top:1px">'+sub+'</div>':'')
      +'</div>';
  }
  if(!comp){
    return '<div style="margin-top:9px;padding:11px 13px;background:rgba(10,14,22,.3);border-radius:12px;font-size:11px;color:var(--txt2);line-height:1.5">'
      +'ATTRIBUTES unavailable \u2014 log a bodyweight in the Body tab to populate the operator profile.</div>';
  }
  var bfCol=comp.bf>25?'#E35050':comp.bf>BF_CUT_THRESHOLD?'#E8A02A':'#3DB87A';
  var ftCol=fat===null?'var(--txt3)':fat>=60?'#E35050':fat>=30?'#E8A02A':'#3DB87A';
  return '<div style="margin-top:9px">'
    +'<div style="font-size:8px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--txt3);margin-bottom:7px">ATTRIBUTES</div>'
    +'<div style="display:flex;gap:7px;margin-bottom:7px">'
    +cell('Mass',comp.weight,'kg',null,'BMI '+comp.bmi)
    +cell('Body Fat',comp.bf,'%',bfCol,comp.manual?'measured':(comp.calibrated?'DEXA-calibrated':'RFM uncal.'))
    +'</div>'
    +'<div style="display:flex;gap:7px">'
    +cell('Lean Mass',comp.lbm,'kg','#3DB87A',null)
    +cell('Fatigue',fat===null?'-':fat,'%',ftCol,fat===null?'no data':fat>=60?'high':fat>=30?'moderate':'low')
    +'</div>'
    +(mt&&mt.derived?'<div style="margin-top:7px;padding:9px 11px;border-radius:11px;background:'
      +(mt.cutting?'rgba(227,80,80,.1)':'rgba(61,184,122,.1)')+';border:1px solid '
      +(mt.cutting?'rgba(227,80,80,.25)':'rgba(61,184,122,.25)')+'">'
      +'<div style="display:flex;justify-content:space-between;align-items:baseline">'
      +'<span style="font-size:9px;font-weight:800;letter-spacing:.13em;color:'+(mt.cutting?'#E35050':'#3DB87A')+'">'
      +(mt.cutting?'CUTTING PHASE':'MAINTENANCE')+'</span>'
      +'<span style="font-size:13px;font-weight:900;color:var(--white);font-variant-numeric:tabular-nums">'+mt.kcal+' kcal</span></div>'
      +'<div style="font-size:9px;color:var(--txt3);margin-top:2px">'
      +(mt.cutting?'Body fat above '+BF_CUT_THRESHOLD+'% \u2014 deficit applied':'Body fat at or below '+BF_CUT_THRESHOLD+'% \u2014 holding')
      +' \u00b7 '+mt.protein+'g protein</div></div>':'')
    +'</div>';
}

// --- DEVELOPMENT MAP ---------------------------------------------------------
// Cumulative weighted set volume per muscle group across every logged session.
var DEV_TARGET=300;   // weighted sets = fully developed on the silhouette

function developmentMap(){
  var vol={};
  Object.keys(MUSCLE_NAMES).forEach(function(k){vol[k]=0;});
  Object.keys(S.sessions||{}).forEach(function(key){
    var s=S.sessions[key];
    if(!s||!s.exercises)return;
    Object.keys(s.exercises).forEach(function(exId){
      var ed=s.exercises[exId];
      if(!ed)return;
      // only serials carrying an RPE count as verified work
      var sets=(ed.sets||[]).filter(function(x){return x.done&&x.rpe!=null;}).length;
      if(!sets&&ed.comp&&(!ed.sets||!ed.sets.length))sets=1;
      if(!sets)return;
      var mm=MM[exId];
      if(!mm)return;
      (mm.f||[]).forEach(function(g){if(vol[g]!==undefined)vol[g]+=sets;});
      (mm.b||[]).forEach(function(g){if(vol[g]!==undefined)vol[g]+=sets*0.6;});
    });
  });
  var pct={};
  Object.keys(vol).forEach(function(k){
    pct[k]={vol:Math.round(vol[k]),pct:Math.min(100,Math.round(vol[k]/DEV_TARGET*100))};
  });
  return pct;
}

function devMap(dev,side,w){
  var BASE='rgba(255,255,255,.05)';
  var ST='rgba(255,255,255,.10)';
  var isF=side==='front';
  var vb=isF?'0 0 46 100':'0 0 44 100';
  var cx=isF?23:22;
  var h=Math.round(w*100/(isF?46:44));
  var svg='<svg width="'+w+'" height="'+h+'" viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg">'
    +'<ellipse cx="'+cx+'" cy="7" rx="8" ry="7" fill="'+BASE+'" stroke="'+ST+'" stroke-width=".4"/>'
    +'<rect x="'+(cx-4)+'" y="14" width="8" height="5" rx="2" fill="'+BASE+'"/>';
  function paint(k,r){
    var d=dev[k]||{pct:0};
    var o=(0.08+0.92*(d.pct/100)).toFixed(3);
    return '<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]
      +'" rx="3" fill="#E8A02A" fill-opacity="'+o+'" stroke="'+ST+'" stroke-width=".3"/>';
  }
  if(isF){Object.keys(FG).forEach(function(k){svg+=paint(k,FG[k]);});}
  else{Object.keys(BG).forEach(function(k){BG[k].forEach(function(r){svg+=paint(k,r);});});}
  return svg+'</svg>';
}

function renderDevelopment(){
  var L=levelState(), b=xpBreakdown(), dev=developmentMap();
  var c=b.counts;
  var groups=Object.keys(MUSCLE_NAMES).sort(function(a,b2){return dev[b2].pct-dev[a].pct;});
  var avg=Math.round(groups.reduce(function(a,k){return a+dev[k].pct;},0)/groups.length);

  var h='';

  // operator dossier
  var R=readiness(), sus=isSustainment();
  h+='<div style="margin:0 16px 12px;border-radius:22px;overflow:hidden;background:linear-gradient(160deg,rgba(232,160,42,.16),var(--card) 62%);border:1px solid rgba(232,160,42,.22);padding:18px">'
   +'<div style="display:flex;align-items:center;gap:16px;margin-bottom:14px">'
   +progressRing(sus?R.score:L.pct,84,8,sus?R.state.col:'var(--amber)','rgba(255,255,255,.07)',String(L.level),'TIER')
   +'<div style="flex:1;min-width:0">'
   +'<div style="font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--txt3)">OPERATOR</div>'
   +'<div style="font-size:20px;font-weight:900;color:var(--amber);letter-spacing:-.02em;line-height:1.1;margin-top:2px">'+L.rank+'</div>'
   +'<div style="font-size:11px;color:var(--txt2);margin-top:4px;line-height:1.45">'+L.note+'</div>'
   +'</div></div>'
   +'<div style="display:flex;gap:9px">'
   +'<div style="flex:1;background:rgba(10,14,22,.3);border-radius:12px;padding:10px 12px">'
   +'<div style="font-size:9px;font-weight:800;letter-spacing:.14em;color:var(--txt3)">READINESS</div>'
   +'<div style="font-size:17px;font-weight:900;color:'+R.state.col+';font-variant-numeric:tabular-nums;line-height:1.2">'+R.score+'%</div>'
   +'<div style="font-size:9px;font-weight:800;letter-spacing:.08em;color:'+R.state.col+'">'+R.state.name+'</div></div>'
   +'<div style="flex:1;background:rgba(10,14,22,.3);border-radius:12px;padding:10px 12px">'
   +'<div style="font-size:9px;font-weight:800;letter-spacing:.14em;color:var(--txt3)">'+(sus?'SUSTAINED':'MERIT')+'</div>'
   +'<div style="font-size:17px;font-weight:900;color:var(--white);font-variant-numeric:tabular-nums;line-height:1.2">'+(sus?sustainmentDays()+'d':L.total.toLocaleString())+'</div>'
   +'<div style="font-size:9px;color:var(--txt3)">'+(sus?'since qualification':L.into+' / '+L.need+' to next')+'</div></div>'
   +'</div>'
   +attributeBand()
   +'<div style="font-size:10px;color:var(--txt3);line-height:1.55;margin-top:11px">'
   +(sus
     ? 'All prescribed missions executed. Rank is held, not earned again \u2014 readiness is now the only measure.'
     : 'Rank is earned by completed missions and never lost. Readiness reflects the last 21 days and must be held.')
   +'</div></div>';

  // development silhouette
  h+='<div style="margin:0 16px 12px;background:var(--card);border:1px solid var(--border);border-radius:20px;padding:16px">'
   +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
   +'<div><div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--txt3)">DEVELOPMENT</div>'
   +'<div style="font-size:11px;color:var(--txt2);margin-top:2px">Cumulative volume across every session</div></div>'
   +'<div style="text-align:right"><div style="font-size:22px;font-weight:900;color:var(--amber);font-variant-numeric:tabular-nums;line-height:1">'+avg+'<span style="font-size:12px;color:var(--txt3)">%</span></div>'
   +'<div style="font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3);margin-top:2px">Overall</div></div></div>'
   +'<div style="display:flex;justify-content:center;gap:18px;padding:4px 0 10px">'
   +devMap(dev,'front',116)+devMap(dev,'back',112)+'</div>'
   +'<div style="display:flex;justify-content:center;gap:16px"><span style="font-size:10px;font-weight:700;color:var(--txt3)">FRONT</span>'
   +'<span style="font-size:10px;font-weight:700;color:var(--txt3)">BACK</span></div></div>';

  // per-group volume
  h+='<div class="sh">VOLUME BY GROUP</div><div style="padding:0 16px">';
  h+=groups.map(function(k){
    var d=dev[k];
    return '<div style="display:flex;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid var(--border)">'
      +'<div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:var(--white)">'+MUSCLE_NAMES[k]+'</div>'
      +'<div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-top:5px">'
      +'<div style="height:100%;width:'+d.pct+'%;background:var(--amber);border-radius:2px;transition:width .5s"></div></div></div>'
      +'<div style="text-align:right;flex-shrink:0;width:56px"><div style="font-size:13px;font-weight:800;color:var(--amber);font-variant-numeric:tabular-nums">'+d.pct+'%</div>'
      +'<div style="font-size:9px;color:var(--txt3)">'+d.vol+' sets</div></div></div>';
  }).join('')+'</div>';

  // XP ledger - shows exactly where every point came from
  var rows=[
    ['Missions executed',c.sessions,XP.session,b.sessions],
    ['Missions partial',c.partial,XP.partial,b.partial],
    ['Standards met',c.goals,XP.goal,b.goals],
    ['Assessments',c.assessments,XP.assessment,b.assessments],
    ['Measurements logged',c.measurements,XP.measurement,b.measurements],
    ['Journal entries',c.journal,XP.journal,b.journal],
    ['Phases completed',c.phases,XP.phase,b.phases]
  ].filter(function(r){return r[1]>0;});

  h+='<div class="sh">READINESS BREAKDOWN</div><div style="padding:0 16px">'
   +'<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border)">'
   +'<div><div style="font-size:12px;font-weight:600;color:var(--txt)">Mission adherence</div>'
   +'<div style="font-size:10px;color:var(--txt3)">'+R.recent+' of '+R.expected+' expected in last 21 days</div></div>'
   +'<div style="font-size:13px;font-weight:800;color:var(--amber);font-variant-numeric:tabular-nums">'+R.adherence+'%</div></div>'
   +'<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--border)">'
   +'<div><div style="font-size:12px;font-weight:600;color:var(--txt)">Recency</div>'
   +'<div style="font-size:10px;color:var(--txt3)">'+(R.gap>900?'No mission logged yet':R.gap===0?'Mission today':R.gap+' day'+(R.gap!==1?'s':'')+' since last mission')+'</div></div>'
   +'<div style="font-size:13px;font-weight:800;color:var(--amber);font-variant-numeric:tabular-nums">'+R.recency+'%</div></div>'
   +'<div style="font-size:10px;color:var(--txt3);line-height:1.55;padding:8px 0">Readiness = 60% adherence + 40% recency. It decays when missions are missed and recovers when they are executed.</div>'
   +'</div>';

  h+='<div class="sh">MERIT LEDGER</div><div style="padding:0 16px">';
  if(!rows.length){
    h+='<div style="font-size:12px;color:var(--txt2);padding-bottom:10px">No XP yet. Complete a session to start.</div>';
  }else{
    h+=rows.map(function(r){
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)">'
        +'<div><div style="font-size:12px;font-weight:600;color:var(--txt)">'+r[0]+'</div>'
        +'<div style="font-size:10px;color:var(--txt3)">'+r[1]+' \u00d7 '+r[2]+' XP</div></div>'
        +'<div style="font-size:13px;font-weight:800;color:var(--amber);font-variant-numeric:tabular-nums">+'+r[3].toLocaleString()+'</div></div>';
    }).join('');
    h+='<div style="display:flex;justify-content:space-between;padding:11px 0 4px">'
      +'<div style="font-size:12px;font-weight:800;color:var(--white);letter-spacing:.04em">TOTAL</div>'
      +'<div style="font-size:15px;font-weight:900;color:var(--amber);font-variant-numeric:tabular-nums">'+b.total.toLocaleString()+' MERIT</div></div>';
  }
  h+='<div style="font-size:10px;color:var(--txt3);line-height:1.6;padding:8px 0 4px">'
   +'Merit is recalculated from your mission log every time this screen opens. It records what you have executed \u2014 it is not a score to chase. '
   +'RPE remains the only measure of how hard the work actually was.</div>';
  h+='</div>';

  return h;
}
