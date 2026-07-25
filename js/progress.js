// Iron Protocol - progress.js
// Output indicators: XP, levels, rank, development map.
// Every value is DERIVED from logged work at read time. Nothing is stored, so
// nothing can desync or be inflated by editing storage. RPE remains the only
// input/performance signal; this file is strictly a mirror of what was done.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var XP={session:100,partial:40,goal:250,assessment:150,measurement:25,journal:15,phase:500};

var RANKS=[
  {min:1, name:'NOVICE'},
  {min:5, name:'CONDITIONED'},
  {min:10,name:'CAPABLE'},
  {min:15,name:'HARDENED'},
  {min:20,name:'RESILIENT'},
  {min:25,name:'IRON'}
];

function xpToNext(level){return 400+50*level;}

function xpBreakdown(){
  var b={sessions:0,partial:0,goals:0,assessments:0,measurements:0,journal:0,phases:0};
  var full=0,part=0;
  Object.keys(S.sessions||{}).forEach(function(k){
    var p=sessComp(k).pct;
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
  var L=levelState();
  return '<div style="margin:12px 16px 0;background:var(--card);border:1px solid var(--border);border-radius:16px;padding:12px 14px">'
    +'<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">'
    +'<div style="display:flex;align-items:baseline;gap:8px">'
    +'<span style="font-size:15px;font-weight:900;color:var(--amber);letter-spacing:-.02em">LVL '+L.level+'</span>'
    +'<span style="font-size:9px;font-weight:800;letter-spacing:.16em;color:var(--txt3)">'+L.rank+'</span></div>'
    +'<span style="font-size:10px;font-weight:700;color:var(--txt3);font-variant-numeric:tabular-nums">'+L.into+' / '+L.need+' XP</span>'
    +'</div>'
    +'<div style="display:flex;gap:3px">'
    +[0,1,2,3,4,5,6,7,8,9].map(function(i){
       var on=L.pct>i*10;
       var partial=!on&&L.pct>i*10-10&&L.pct>0&&Math.floor(L.pct/10)===i;
       return '<div style="flex:1;height:5px;border-radius:2px;background:'+(on?'var(--amber)':'rgba(255,255,255,.07)')+'"></div>';
     }).join('')
    +'</div></div>';
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
      var sets=(ed.sets||[]).filter(function(x){return x.done;}).length;
      if(!sets&&ed.comp)sets=1;
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

  // rank card
  h+='<div style="margin:0 16px 12px;border-radius:22px;overflow:hidden;background:linear-gradient(160deg,rgba(232,160,42,.16),var(--card) 62%);border:1px solid rgba(232,160,42,.22);padding:18px">'
   +'<div style="display:flex;align-items:center;gap:16px">'
   +progressRing(L.pct,84,8,'var(--amber)','rgba(255,255,255,.07)',String(L.level),'LVL')
   +'<div style="flex:1;min-width:0">'
   +'<div style="font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--txt3)">RANK</div>'
   +'<div style="font-size:21px;font-weight:900;color:var(--amber);letter-spacing:-.02em;line-height:1.1;margin-top:2px">'+L.rank+'</div>'
   +'<div style="font-size:11px;color:var(--txt2);margin-top:4px;font-variant-numeric:tabular-nums">'+L.total.toLocaleString()+' XP total \u00b7 '+L.into+' / '+L.need+' to next</div>'
   +'</div></div></div>';

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
    ['Sessions completed',c.sessions,XP.session,b.sessions],
    ['Sessions partial',c.partial,XP.partial,b.partial],
    ['Goals achieved',c.goals,XP.goal,b.goals],
    ['Assessments',c.assessments,XP.assessment,b.assessments],
    ['Measurements logged',c.measurements,XP.measurement,b.measurements],
    ['Journal entries',c.journal,XP.journal,b.journal],
    ['Phases completed',c.phases,XP.phase,b.phases]
  ].filter(function(r){return r[1]>0;});

  h+='<div class="sh">XP LEDGER</div><div style="padding:0 16px">';
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
      +'<div style="font-size:15px;font-weight:900;color:var(--amber);font-variant-numeric:tabular-nums">'+b.total.toLocaleString()+' XP</div></div>';
  }
  h+='<div style="font-size:10px;color:var(--txt3);line-height:1.6;padding:8px 0 4px">'
   +'XP is recalculated from your session log every time this screen opens. It records what you have done \u2014 it is not a score to chase. '
   +'RPE remains the only measure of how hard the work actually was.</div>';
  h+='</div>';

  return h;
}
