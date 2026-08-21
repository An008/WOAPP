// Iron Protocol - skips.js
// A skip is a signal, but an UNLABELLED skip is a useless one: "too easy" and
// "it hurt" demand opposite corrections. Every skip captures a reason, and each
// reason maps to a specific programming action.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var SKIP_REASONS=[
  {id:'equipment',label:'No equipment',    sub:'I do not have what this needs',
   col:'#4A9EDB',action:'replace'},
  {id:'too-easy', label:'Too easy',        sub:'Not worth doing at this load',
   col:'#E8A02A',action:'escalate'},
  {id:'too-hard', label:'Too hard',        sub:'Could not complete it',
   col:'#E35050',action:'reduce'},
  {id:'pain',     label:'Pain or niggle',  sub:'Something hurt',
   col:'#E35050',action:'freeze'},
  {id:'time',     label:'No time or space',sub:'Circumstances, not the exercise',
   col:'#8B95A6',action:'none'}
];
function skipReason(id){
  for(var i=0;i<SKIP_REASONS.length;i++)if(SKIP_REASONS[i].id===id)return SKIP_REASONS[i];
  return null;
}

// Per-objective tally across every logged mission
function skipAnalytics(){
  var out={};
  Object.keys(S.sessions||{}).forEach(function(k){
    var sess=S.sessions[k];
    if(!sess||!sess.exercises)return;
    var date=sess.date||k.split('|')[0];
    Object.keys(sess.exercises).forEach(function(exId){
      var ed=sess.exercises[exId];
      if(!ed||!ed.skipped)return;
      if(!out[exId])out[exId]={total:0,reasons:{},last:null,type:sess.type};
      var r=ed.skipReason||'unlabelled';
      out[exId].total++;
      out[exId].reasons[r]=(out[exId].reasons[r]||0)+1;
      if(!out[exId].last||date>out[exId].last)out[exId].last=date;
    });
  });
  return out;
}

// The dominant reason for one objective, and what it means for programming
function skipSignal(exId){
  var a=skipAnalytics()[exId];
  if(!a)return null;
  var top=null,n=0;
  Object.keys(a.reasons).forEach(function(r){if(a.reasons[r]>n){n=a.reasons[r];top=r;}});
  var def=skipReason(top);
  return {exId:exId,total:a.total,reason:top,count:n,last:a.last,
          action:def?def.action:'none',label:def?def.label:'Unlabelled'};
}

// Objectives skipped enough times to warrant acting on
var SKIP_TRIGGER=2;
function skipFlags(){
  var an=skipAnalytics(),out=[];
  Object.keys(an).forEach(function(id){
    var s=skipSignal(id);
    if(!s)return;
    // Pain is acted on immediately - it never needs to repeat to count
    if(s.count>=SKIP_TRIGGER||s.reason==='pain')out.push(s);
  });
  return out.sort(function(a,b){return b.total-a.total;});
}

// --- REASON SHEET ------------------------------------------------------------
function showSkipSheet(){
  var card=FC_CARDS[FC_IDX],ex=card.ex;
  var el=document.getElementById('skip-sheet');
  if(el)el.remove();
  var d=document.createElement('div');
  d.id='skip-sheet';
  d.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:700;background:var(--bg2);'
    +'border:1px solid var(--border);border-radius:18px 18px 0 0;padding:20px 18px 40px;'
    +'box-shadow:0 -8px 32px rgba(0,0,0,.45)';
  d.innerHTML='<div style="width:36px;height:4px;background:var(--bord2);border-radius:2px;margin:0 auto 16px"></div>'
    +'<div style="font-size:16px;font-weight:800;color:var(--white);margin-bottom:3px">Skip '+ex.n+'</div>'
    +'<div style="font-size:12px;color:var(--txt2);margin-bottom:16px">Why? This decides how the programme corrects itself.</div>'
    +SKIP_REASONS.map(function(r){
      return '<div onclick="confirmSkip(\''+r.id+'\')" style="display:flex;align-items:center;gap:12px;'
        +'padding:13px 14px;margin-bottom:8px;border-radius:12px;cursor:pointer;'
        +'background:var(--bg3);border:1px solid var(--border)">'
        +'<div style="width:3px;height:30px;border-radius:2px;background:'+r.col+';flex-shrink:0"></div>'
        +'<div style="flex:1"><div style="font-size:14px;font-weight:700;color:var(--white)">'+r.label+'</div>'
        +'<div style="font-size:11px;color:var(--txt3);margin-top:1px">'+r.sub+'</div></div></div>';
    }).join('')
    +'<button onclick="document.getElementById(\'skip-sheet\').remove()" class="btn" '
    +'style="background:transparent;border:1px solid var(--border);color:var(--txt2);margin-top:6px">Cancel</button>';
  document.body.appendChild(d);
}
