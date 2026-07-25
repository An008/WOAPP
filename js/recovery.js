// Iron Protocol - recovery.js
// Muscle-group freshness derived from logged sessions and the MM map
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var MUSCLE_NAMES={
  shoulders:'Shoulders',chest:'Chest',abs:'Core',biceps:'Biceps',
  forearms:'Forearms',hip_flex:'Hip Flexors',quads:'Quads',tibialis:'Tibialis',
  traps:'Traps',rear_delt:'Rear Delts',lats:'Lats',rhomboids:'Rhomboids',
  triceps:'Triceps',glutes:'Glutes',hamstrings:'Hamstrings',calves:'Calves'
};
var MUSCLE_REGION={
  torso:['chest','abs','lats','rhomboids','traps','rear_delt','shoulders'],
  arms:['biceps','triceps','forearms'],
  legs:['quads','hamstrings','glutes','calves','tibialis','hip_flex']
};
var REGION_NAMES={torso:'Torso',arms:'Arms',legs:'Legs'};

// Freshness curve by days since stimulus. Primary movers carry full cost,
// secondary movers 60 per cent of it.
var FRESH_CURVE=[25,55,80,95,100];

function muscleRecovery(){
  var g={};
  Object.keys(MUSCLE_NAMES).forEach(function(k){
    g[k]={pct:100,days:null,last:null,w:1,exercises:[]};
  });
  var now=new Date(today()+'T12:00:00');
  Object.keys(S.sessions).sort().reverse().forEach(function(key){
    var s=S.sessions[key];
    if(!s||!s.exercises)return;
    var date=s.date||key.split('|')[0];
    var days=Math.round((now-new Date(date+'T12:00:00'))/86400000);
    if(days<0||days>14)return;
    Object.keys(s.exercises).forEach(function(exId){
      var ed=s.exercises[exId];
      var worked=ed&&(ed.comp||((ed.sets||[]).some(function(x){return x.done;})));
      if(!worked)return;
      var mm=MM[exId];
      if(!mm)return;
      [['f',1],['b',0.6]].forEach(function(pair){
        (mm[pair[0]]||[]).forEach(function(k){
          var G=g[k];
          if(!G)return;
          if(G.days===null||days<G.days){G.days=days;G.last=date;G.w=pair[1];}
          if(days<=3&&G.exercises.indexOf(exId)<0)G.exercises.push(exId);
        });
      });
    });
  });
  Object.keys(g).forEach(function(k){
    var G=g[k];
    if(G.days===null){G.pct=100;return;}
    var base=FRESH_CURVE[Math.min(G.days,4)];
    G.pct=Math.round(Math.min(100,100-(100-base)*G.w));
  });
  return g;
}

function freshColor(p){
  return p>=85?'#3DB87A':p>=50?'#E8A02A':'#E35050';
}
function freshLabel(p){
  return p>=85?'Fresh':p>=50?'Recovering':'Fatigued';
}

var RECOVERY_SIDE='front';
function setRecoverySide(s){RECOVERY_SIDE=s;renderMetrics();}

function bodyMap(rec,side,w){
  var DM='rgba(255,255,255,.05)';
  var ST='rgba(255,255,255,.09)';
  var isF=side==='front';
  var vb=isF?'0 0 46 100':'0 0 44 100';
  var cx=isF?23:22;
  var h=Math.round(w*100/(isF?46:44));
  var svg='<svg width="'+w+'" height="'+h+'" viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg">'
    +'<ellipse cx="'+cx+'" cy="7" rx="8" ry="7" fill="'+DM+'" stroke="'+ST+'" stroke-width=".4"/>'
    +'<rect x="'+(cx-4)+'" y="14" width="8" height="5" rx="2" fill="'+DM+'"/>';
  if(isF){
    Object.keys(FG).forEach(function(k){
      var r=FG[k],G=rec[k];
      var c=G&&G.days!==null?freshColor(G.pct):DM;
      var op=G&&G.days!==null?(0.28+0.72*(1-G.pct/100)):1;
      svg+='<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]
        +'" rx="3" fill="'+c+'" fill-opacity="'+(G&&G.days!==null?Math.max(0.3,op).toFixed(2):'1')
        +'" stroke="'+ST+'" stroke-width=".3"/>';
    });
  }else{
    Object.keys(BG).forEach(function(k){
      var rects=BG[k],G=rec[k];
      var c=G&&G.days!==null?freshColor(G.pct):DM;
      var op=G&&G.days!==null?(0.28+0.72*(1-G.pct/100)):1;
      rects.forEach(function(r){
        svg+='<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]
          +'" rx="3" fill="'+c+'" fill-opacity="'+(G&&G.days!==null?Math.max(0.3,op).toFixed(2):'1')
          +'" stroke="'+ST+'" stroke-width=".3"/>';
      });
    });
  }
  return svg+'</svg>';
}

function renderRecovery(){
  var rec=muscleRecovery();
  var all=Object.keys(MUSCLE_NAMES);
  var trained=all.filter(function(k){return rec[k].days!==null;});
  var fresh=all.filter(function(k){return rec[k].pct>=85;});
  var fatigued=all.filter(function(k){return rec[k].pct<50;})
    .sort(function(a,b){return rec[a].pct-rec[b].pct;});

  var h='';

  // --- summary tiles --------------------------------------------------------
  h+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;padding:0 16px 12px">'
   +tile(fresh.length,'/'+all.length,'Fresh','#3DB87A')
   +tile(fatigued.length,'','Fatigued','#E35050')
   +tile(trained.length?Math.min.apply(null,trained.map(function(k){return rec[k].days;})):'-','d','Last Trained')
   +'</div>';

  // --- body map -------------------------------------------------------------
  h+='<div style="margin:0 16px 12px;background:var(--card);border:1px solid var(--border);border-radius:20px;padding:16px">'
   +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
   +'<div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--txt3)">BODY STATE</div>'
   +'<div style="display:flex;gap:1px;background:var(--border);border-radius:9px;overflow:hidden">'
   +['front','back'].map(function(s){
      var on=RECOVERY_SIDE===s;
      return '<div onclick="setRecoverySide(\''+s+'\')" style="padding:6px 14px;cursor:pointer;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;background:'
        +(on?'var(--bg3)':'var(--card)')+';color:'+(on?'var(--amber)':'var(--txt3)')+'">'+s+'</div>';
    }).join('')
   +'</div></div>'
   +'<div style="display:flex;justify-content:center;padding:4px 0 12px">'+bodyMap(rec,RECOVERY_SIDE,132)+'</div>'
   +'<div style="display:flex;justify-content:center;gap:14px">'
   +[['#3DB87A','Fresh'],['#E8A02A','Recovering'],['#E35050','Fatigued']].map(function(x){
      return '<div style="display:flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:2px;background:'+x[0]+'"></span>'
        +'<span style="font-size:10px;font-weight:700;color:var(--txt3)">'+x[1]+'</span></div>';
    }).join('')
   +'</div></div>';

  // --- ranked list by region ------------------------------------------------
  Object.keys(MUSCLE_REGION).forEach(function(reg){
    var ks=MUSCLE_REGION[reg].slice().sort(function(a,b){return rec[a].pct-rec[b].pct;});
    h+='<div class="sh">'+REGION_NAMES[reg].toUpperCase()+' ('+ks.length+')</div>';
    h+='<div style="padding:0 16px">'+ks.map(function(k){
      var G=rec[k],c=freshColor(G.pct);
      var sub=G.days===null?'No recent work'
        :(G.days===0?'Trained today':G.days===1?'Yesterday':G.days+' days ago')
         +(G.exercises.length?' \u00b7 '+G.exercises.length+' exercise'+(G.exercises.length!==1?'s':''):'');
      return '<div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border)">'
        +'<div style="width:3px;height:30px;border-radius:2px;background:'+c+';flex-shrink:0"></div>'
        +'<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;color:var(--white)">'+MUSCLE_NAMES[k]+'</div>'
        +'<div style="font-size:10px;color:var(--txt3);margin-top:1px">'+sub+'</div></div>'
        +'<div style="text-align:right;flex-shrink:0"><div style="font-size:14px;font-weight:900;color:'+c+';font-variant-numeric:tabular-nums">'+G.pct+'%</div>'
        +'<div style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--txt3)">'+freshLabel(G.pct)+'</div></div>'
        +'</div>';
    }).join('')+'</div>';
  });

  // --- guidance -------------------------------------------------------------
  if(fatigued.length){
    h+='<div style="margin:12px 16px 0;padding:12px 14px;background:rgba(227,80,80,.07);border:1px solid rgba(227,80,80,.2);border-radius:16px">'
     +'<div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--red)">STILL RECOVERING</div>'
     +'<div style="font-size:11px;color:var(--txt2);margin-top:3px;line-height:1.5">'
     +fatigued.slice(0,4).map(function(k){return MUSCLE_NAMES[k];}).join(', ')
     +'. Heavy work on these today will cut into adaptation rather than add to it.</div></div>';
  }else if(trained.length){
    h+='<div style="margin:12px 16px 0;padding:12px 14px;background:rgba(61,184,122,.07);border:1px solid rgba(61,184,122,.2);border-radius:16px">'
     +'<div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--green)">RECOVERED</div>'
     +'<div style="font-size:11px;color:var(--txt2);margin-top:3px;line-height:1.5">Every group is at or near full freshness. Good day to push intensity.</div></div>';
  }
  return h;
}
