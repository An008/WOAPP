// Iron Protocol - ui-metrics.js
// Measurements, Navy BF, BMI, achievements
// ASCII-ONLY: no byte above 0x7F may appear in this file.

function navyBF(waist, neck, height){
  // US Navy formula (cm inputs) for male
  if(!waist||!neck||!height||waist<=neck)return null;
  return Math.round((495/(1.0324-0.19077*Math.log10(waist-neck)+0.15456*Math.log10(height))-450)*10)/10;
}

function calcBMI(weight,height){
  if(!weight||!height)return null;
  return Math.round(weight/Math.pow(height/100,2)*10)/10;
}

var METRICS_MODE='recovery';
function setMetricsMode(m){METRICS_MODE=m;renderMetrics();}

function metricsToggle(){
  return '<div style="padding:0 16px 14px"><div style="display:flex;gap:1px;background:var(--border);border-radius:12px;overflow:hidden">'
    +[['recovery','Readiness'],['development','Operator'],['composition','Body']].map(function(x){
      var on=METRICS_MODE===x[0];
      return '<div onclick="setMetricsMode(\''+x[0]+'\')" style="flex:1;padding:10px;text-align:center;cursor:pointer;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;background:'
        +(on?'var(--bg3)':'var(--card)')+';color:'+(on?'var(--amber)':'var(--txt3)')+'">'+x[1]+'</div>';
    }).join('')+'</div></div>';
}

function renderMetrics(){
  var el=document.getElementById('v-metrics');
  var ms=S.measurements||[];
  var cur=ms.length>0?ms[ms.length-1]:null;
  var prev=ms.length>1?ms[ms.length-2]:null;
  var h=S.profile.height||164;

  function delta(cur,prev,key,unit,dec){
    if(!cur||!prev||cur[key]==null||prev[key]==null)return '';
    var d=((cur[key]-prev[key])*(dec?10:1)|0)/(dec?10:1);
    var sign=d>0?'+':'';
    var col=d<0?'var(--green)':d>0?'var(--red)':'var(--txt3)';
    return '<span style="font-size:11px;color:'+col+';margin-left:4px">'+sign+d+(unit||'')+'</span>';
  }

  // -- CURRENT SNAPSHOT BANNER ----------------------------------------------
  var banner='<div style="margin:0 18px 10px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px">';
  if(cur){
    var bmi=calcBMI(cur.weight,h);
    var whr=cur.waist&&cur.hip?(Math.round(cur.waist/cur.hip*100)/100):null;
    var lean=cur.bodyFat&&cur.weight?Math.round(cur.weight*(1-cur.bodyFat/100)*10)/10:null;
    var navy=navyBF(cur.waist,cur.neck,h);
    var cedars=bodyFatCedars(cur.weight,h,S.profile.age||40,true);
    banner+='<div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--txt3);margin-bottom:12px">CURRENT SNAPSHOT \u00b7 '+cur.date+'</div>';
    banner+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px">';
    var metrics=[
      ['Weight','weight','kg',cur.weight],
      ['Body Fat','bodyFat','%',cur.bodyFat],
      ['Lean Mass',null,null,lean],
      ['BMI',null,null,bmi],
      ['Waist','waist','cm',cur.waist],
      ['Resting HR','rhr','bpm',cur.rhr],
    ];
    metrics.forEach(function(m){
      var key=m[1],unit=m[2],val=m[3];
      if(val==null)return;
      banner+='<div style="background:var(--bg3);border-radius:8px;padding:10px 10px 8px"><div style="font-size:10px;color:var(--txt3);font-weight:700;text-transform:uppercase;letter-spacing:.08em">'+m[0]+'</div>'
        +'<div style="font-size:20px;font-weight:900;color:var(--white);font-variant-numeric:tabular-nums">'+val+'<span style="font-size:11px;color:var(--txt2)"> '+(unit||'')+'</span></div>'
        +(key&&prev?delta(cur,prev,key,unit,m[0]==='BMI'||m[0]==='Body Fat'):'')
        +'</div>';
    });
    banner+='</div>';
    if(whr)banner+='<div style="font-size:12px;color:var(--txt2)">WHR: <strong style="color:var(--white)">'+whr+'</strong>'+(whr<0.90?' \u2014 <span style="color:var(--green)">good</span>':' \u2014 <span style="color:var(--amber)">monitor</span>')+'</div>';
    if(!cur.bodyFat){
      banner+='<div style="font-size:12px;color:var(--txt2);margin-top:4px">Cedars-Sinai: <strong style="color:var(--amber)">'+cedars+'%</strong>'
        +(navy?' <span style="color:var(--txt3)">\u00b7 Navy '+navy+'%</span>':'')+'</div>';
    }
    if(prev)banner+='<div style="font-size:11px;color:var(--txt3);margin-top:6px">vs '+prev.date+(cur.weight&&prev.weight?delta(cur,prev,'weight','kg',true):'')+(cur.bodyFat&&prev.bodyFat?delta(cur,prev,'bodyFat','%',true):'')+(cur.waist&&prev.waist?delta(cur,prev,'waist','cm',false):'')+'</div>';
  } else {
    banner+='<div style="font-size:13px;color:var(--txt2)">No measurements yet. Record your first entry below.</div>';
  }
  banner+='</div>';

  // -- RECORD FORM ----------------------------------------------------------
  var fields=[
    {sh:'BODY COMPOSITION',rows:[
      {k:'weight',l:'Weight (kg)',t:'decimal'},
      {k:'bodyFat',l:'Body Fat % (manual)',t:'decimal'},
      {k:'neck',l:'Neck (cm)',t:'decimal'},
      {k:'waist',l:'Waist (cm)',t:'decimal'},
      {k:'hip',l:'Hip (cm)',t:'decimal'},
    ]},
    {sh:'CIRCUMFERENCES (cm)',rows:[
      {k:'chest',l:'Chest',t:'decimal'},
      {k:'shoulders',l:'Shoulders',t:'decimal'},
      {k:'armL',l:'Upper Arm \u2014 Left',t:'decimal'},
      {k:'armR',l:'Upper Arm \u2014 Right',t:'decimal'},
      {k:'forearmL',l:'Forearm \u2014 Left',t:'decimal'},
      {k:'forearmR',l:'Forearm \u2014 Right',t:'decimal'},
      {k:'thighL',l:'Thigh \u2014 Left',t:'decimal'},
      {k:'thighR',l:'Thigh \u2014 Right',t:'decimal'},
      {k:'calf',l:'Calf (avg)',t:'decimal'},
    ]},
    {sh:'VITALS',rows:[
      {k:'rhr',l:'Resting Heart Rate (bpm)',t:'integer'},
    ]},
  ];

  var form='<div class="sh">RECORD TODAY</div>';
  var prev_entry=cur||{};
  fields.forEach(function(sec){
    form+='<div class="sh" style="padding-top:10px">'+sec.sh+'</div>';
    sec.rows.forEach(function(row){
      var prev_val=prev_entry[row.k]||'';
      form+='<div class="sr"><div class="sr-l">'+row.l+'</div><input class="sr-i" type="number" inputmode="'+(row.t==='integer'?'numeric':'decimal')+'" id="mf-'+row.k+'" placeholder="'+prev_val+'" style="width:90px"></div>';
    });
    if(sec.sh==='BODY COMPOSITION'){
      form+='<div id="navy-est" style="padding:4px 18px 8px;font-size:12px;color:var(--blue)"></div>';
    }
  });
  form+='<div class="sh">NOTES</div>';
  form+='<div style="padding:0 18px 10px"><textarea id="mf-notes" class="jq-i" placeholder="Optional notes..."></textarea></div>';
  form+='<div style="padding:0 18px 14px"><button class="btn btn-g" onclick="saveMeasurement()">&#10003; Save Measurement</button></div>';
  form+='<div id="ms-confirm" style="padding:4px 18px;font-size:12px;color:var(--green);min-height:20px"></div>';

  // -- ACHIEVEMENTS ---------------------------------------------------------
  var achieved=S.landmarks.filter(function(l){return l.done;});
  var achHtml='<div class="sh">ACHIEVEMENTS</div>';
  if(achieved.length===0){
    achHtml+='<div style="padding:0 18px 10px;font-size:13px;color:var(--txt2)">No achievements yet. Complete goals on the Today screen.</div>';
  } else {
    achHtml+=achieved.map(function(lm){
      return '<div style="display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border)">'
        +'<div style="font-size:20px;flex-shrink:0">'+lm.i+'</div>'
        +'<div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--white)">'+lm.g+'</div>'
        +'<div style="font-size:11px;color:var(--txt2)">'+lm.p+'</div></div>'
        +'<div style="color:var(--green);font-size:18px;font-weight:900">&#10003;</div>'
        +'</div>';
    }).join('');
  }

  // -- HISTORY --------------------------------------------------------------
  var histHtml='<div class="sh">MEASUREMENT HISTORY ('+ms.length+')</div>';
  if(ms.length===0){
    histHtml+='<div style="padding:0 18px 10px;font-size:13px;color:var(--txt2)">Record your first measurement above.</div>';
  } else {
    histHtml+=ms.slice().reverse().map(function(m){
      var bmi=calcBMI(m.weight,h);
      return '<div style="padding:12px 18px;border-bottom:1px solid var(--border)">'
        +'<div style="display:flex;justify-content:space-between;margin-bottom:4px">'
        +'<span style="font-size:12px;font-weight:700;color:var(--white)">'+m.date+'</span>'
        +(m.rhr?'<span style="font-size:12px;color:var(--txt2)">&#10084;&#65039; '+m.rhr+' bpm</span>':'')
        +'</div>'
        +'<div style="display:flex;flex-wrap:wrap;gap:8px">'
        +(m.weight?'<span style="font-size:13px;font-weight:800;color:var(--white)">'+m.weight+'kg</span>':'')
        +(m.bodyFat?'<span style="font-size:12px;color:var(--txt2)">'+m.bodyFat+'% BF</span>':'')
        +(m.waist?'<span style="font-size:12px;color:var(--txt2)">W:'+m.waist+'cm</span>':'')
        +(m.hip?'<span style="font-size:12px;color:var(--txt2)">H:'+m.hip+'cm</span>':'')
        +(bmi?'<span style="font-size:12px;color:var(--txt2)">BMI:'+bmi+'</span>':'')
        +(m.notes?'<div style="width:100%;font-size:11px;color:var(--txt3);margin-top:2px">'+m.notes+'</div>':'')
        +'</div></div>';
    }).join('');
  }

  var body=METRICS_MODE==='recovery' ? renderRecovery()
    : METRICS_MODE==='development' ? renderDevelopment()
    : (banner+'<div style="height:4px"></div>'+achHtml+form+histHtml);
  el.innerHTML='<div class="hdr"><div class="hdr-ttl">Operator File</div></div>'
    +'<div style="padding-bottom:calc(var(--nav-h)+20px)">'
    +metricsToggle()+body+'</div>';

  // Live Navy BF estimation
  function updateNavy(){
    var w=parseFloat(document.getElementById('mf-waist')&&document.getElementById('mf-waist').value||cur&&cur.waist||0);
    var n=parseFloat(document.getElementById('mf-neck')&&document.getElementById('mf-neck').value||cur&&cur.neck||0);
    var est=navyBF(w,n,h);
    var ced=bodyFatCedars(parseFloat(document.getElementById('mf-weight')&&document.getElementById('mf-weight').value||cur&&cur.weight||0),h,S.profile.age||40,true);
    var el2=document.getElementById('navy-est');
    if(el2)el2.textContent=(ced?'Cedars-Sinai: '+ced+'%':'')+(est?'   Navy: '+est+'%':'');
  }
  if(METRICS_MODE!=='composition')return;
  setTimeout(function(){
    var wEl=document.getElementById('mf-waist'),nEl=document.getElementById('mf-neck');
    if(wEl)wEl.addEventListener('input',updateNavy);
    if(nEl)nEl.addEventListener('input',updateNavy);
    updateNavy();
  },50);
}

function saveMeasurement(){
  var fields=['weight','bodyFat','neck','waist','hip','chest','shoulders','armL','armR','forearmL','forearmR','thighL','thighR','calf','rhr'];
  var entry={date:today()};
  var hasData=false;
  fields.forEach(function(k){
    var el=document.getElementById('mf-'+k);
    if(el&&el.value.trim()){
      entry[k]=parseFloat(el.value.trim());
      hasData=true;
    }
  });
  var notesEl=document.getElementById('mf-notes');
  if(notesEl&&notesEl.value.trim())entry.notes=notesEl.value.trim();

  if(!hasData){
    var c=document.getElementById('ms-confirm');
    if(c){c.style.color='var(--red)';c.textContent='Enter at least one measurement to save.';}
    return;
  }
  if(!S.measurements)S.measurements=[];
  // If entry for today exists, replace it
  var todayIdx=S.measurements.findIndex(function(m){return m.date===today();});
  if(todayIdx>=0)S.measurements[todayIdx]=entry;
  else S.measurements.push(entry);
  saveS();
  var c=document.getElementById('ms-confirm');
  if(c){c.style.color='var(--green)';c.textContent='\u2713 Saved '+today();}
  renderMetrics();
}

window.onload=function(){document.getElementById('ls-name').focus();};
