// Iron Protocol - rpe.js
// RPE audit: detects sustained under-loading and drives AI recalibration
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var RPE_FLOOR=5;      // below this = not challenging enough
var RPE_STREAK=3;     // "more than 2 sessions" -> 3 consecutive

// Mean RPE for one exercise within one session record
function sessionRpe(key,exId){
  var s=S.sessions[key];if(!s||!s.exercises)return null;
  var ed=s.exercises[exId];if(!ed||!ed.sets)return null;
  var r=ed.sets.filter(function(x){return x.done&&x.rpe!=null;});
  if(!r.length)return null;
  var sum=r.reduce(function(a,x){return a+x.rpe;},0);
  var wt=null;
  for(var i=0;i<r.length;i++){if(r[i].wt!=null){wt=r[i].wt;break;}}
  return {avg:sum/r.length,wt:wt};
}

// Walk back through sessions of a type, newest first, counting the consecutive
// run where this exercise came in under RPE_FLOOR. Any session at or above the
// floor breaks the streak.
function rpeStreak(type,exId){
  var keys=Object.keys(S.sessions)
    .filter(function(k){return S.sessions[k]&&S.sessions[k].type===type;})
    .sort().reverse();
  var streak=0,sum=0,lastWt=null;
  for(var i=0;i<keys.length;i++){
    var r=sessionRpe(keys[i],exId);
    if(!r)continue;                 // no RPE logged: skip, don't break
    if(r.avg>=RPE_FLOOR)break;      // hard enough: streak ends
    streak++;sum+=r.avg;
    if(lastWt===null&&r.wt!=null)lastWt=r.wt;
  }
  return {streak:streak,avg:streak?Math.round(sum/streak*10)/10:null,lastWt:lastWt};
}

// Every exercise currently sitting below the floor for RPE_STREAK sessions
function rpeAudit(){
  var out=[];
  ['A','B','C'].forEach(function(type){
    var sd=SESSIONS[type];if(!sd)return;
    sd.blocks.forEach(function(blk){
      blk.exs.forEach(function(ex){
        var r=rpeStreak(type,ex.id);
        if(r.streak>=RPE_STREAK){
          out.push({id:ex.id,name:ex.n,type:type,block:blk.n,
                    streak:r.streak,avg:r.avg,lastWt:r.lastWt,
                    suggest:r.lastWt?Math.round(r.lastWt*1.1*2)/2:null});
        }
      });
    });
  });
  return out;
}

// Suppress the banner once a review has covered the current evidence
function rpeReviewPending(){
  var f=rpeAudit();
  if(!f.length)return [];
  var last=S.profile&&S.profile.lastRpeReview;
  if(!last)return f;
  return f.filter(function(x){
    var prev=(last.exercises||{})[x.id];
    return prev===undefined||x.streak>prev;
  });
}

function buildRpeBanner(){
  var f=rpeReviewPending();
  if(!f.length)return '';
  var names=f.slice(0,3).map(function(x){return x.name;}).join(', ');
  var more=f.length>3?' +'+(f.length-3)+' more':'';
  return '<div style="margin:10px 16px 0;padding:12px 14px;background:rgba(61,184,122,.08);border:1px solid rgba(61,184,122,.25);border-radius:14px">'
    +'<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:9px">'
    +'<div><div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--green)">INTENSITY REVIEW DUE</div>'
    +'<div style="font-size:12px;color:var(--txt2);margin-top:3px;line-height:1.5">'
    +f.length+' exercise'+(f.length!==1?'s':'')+' under RPE '+RPE_FLOOR+' for '+RPE_STREAK+'+ sessions: '
    +'<span style="color:var(--txt)">'+names+more+'</span>. You are adapting faster than the plan.</div></div></div>'
    +'<button onclick="runRpeReview()" style="width:100%;padding:10px;border-radius:11px;border:1px solid rgba(61,184,122,.35);background:rgba(61,184,122,.12);color:var(--green);font-size:12px;font-weight:800;letter-spacing:.03em;cursor:pointer">RECALIBRATE WITH AI</button>'
    +'<div id="rpe-resp" style="margin-top:9px"></div></div>';
}

function buildRpePrompt(f){
  var ph=getPhase(),phWk=getPhaseWk();
  var lines=f.map(function(x){
    return '- '+x.name+' (session '+x.type+', id "'+x.id+'"): mean RPE '+x.avg
      +' across last '+x.streak+' sessions'
      +(x.lastWt!=null?', current load '+x.lastWt+'kg':', bodyweight');
  }).join('\n');
  return 'You are an elite physical preparation coach. Athlete: 40yo male, goals: ultra-trail endurance (Finland X), explosive power, 5km carry with 30kg. Phase '+(ph+1)+' ('+PHASES[ph].name+') Week '+phWk+'.\n\n'
    +'These exercises have been logged BELOW RPE '+RPE_FLOOR+' for '+RPE_STREAK+' or more consecutive sessions, meaning they are no longer producing adaptation:\n'+lines+'\n\n'
    +'Prescribe an increased load or progression for EACH so the next sessions sit at RPE 7-8. For bodyweight movements progress via reps, tempo, range or a harder variation. Respect the phase: do not jump more than one meaningful step. Flag any injury risk from the jump.\n\n'
    +'Return ONLY raw JSON, nothing outside the braces:\n'
    +'{"loads":{"EXERCISE_ID":{"weight":N_or_null,"sets":N,"reps":N,"note":"what changed and the cue"}},'
    +'"summary":"2 sentences on the adaptation trend","priority":"the single biggest progression","watch":"the main injury risk"}\n\n'
    +'Use the exact exercise ids given above as keys. Weights in kg as integers.';
}

function runRpeReview(){
  var el=document.getElementById('rpe-resp');
  var key=getApiKey();
  if(!key){if(el)el.innerHTML='<div style="padding:9px;background:rgba(227,80,80,.1);border-radius:9px;font-size:12px;color:var(--red)">No AI key. Add it in Setup.</div>';return;}
  var f=rpeReviewPending();
  if(!f.length)return;
  if(el)el.innerHTML='<div style="padding:11px;text-align:center;color:var(--txt2);font-size:12px">Reviewing intensity...</div>';
  callAI(key,buildRpePrompt(f),function(txt){
    var d=extractJSON(txt);
    if(!d||!d.loads){
      if(el)el.innerHTML='<div style="background:var(--bg3);border-radius:10px;padding:11px;font-size:12px;color:var(--txt);line-height:1.6">'+txt.replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</div>';
      return;
    }
    // Merge into the same store the flash cards already read from
    if(!S.profile.assessmentLoads)S.profile.assessmentLoads={};
    Object.keys(d.loads).forEach(function(k){S.profile.assessmentLoads[k]=d.loads[k];});
    var marks={};
    f.forEach(function(x){marks[x.id]=x.streak;});
    S.profile.lastRpeReview={date:today(),exercises:marks,summary:d.summary||''};
    if(!S.rpeReviewHistory)S.rpeReviewHistory=[];
    S.rpeReviewHistory.push({date:today(),phase:getPhase()+1,flagged:f.length,
                             loads:d.loads,summary:d.summary||'',
                             priority:d.priority||'',watch:d.watch||''});
    saveS();
    if(el)el.innerHTML='<div style="background:var(--bg3);border:1px solid rgba(61,184,122,.25);border-radius:11px;padding:12px">'
      +'<div style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--green);margin-bottom:6px">LOADS UPDATED</div>'
      +(d.summary?'<div style="font-size:12px;color:var(--txt);line-height:1.6;margin-bottom:8px">'+d.summary+'</div>':'')
      +(d.priority?'<div style="font-size:11px;color:var(--amber);margin-bottom:4px"><strong>Priority:</strong> '+d.priority+'</div>':'')
      +(d.watch?'<div style="font-size:11px;color:var(--red);margin-bottom:8px"><strong>Watch:</strong> '+d.watch+'</div>':'')
      +getLoadsHTML(d.loads)
      +'<div style="font-size:11px;color:var(--green);margin-top:8px">Applied to your flash cards.</div></div>';
    setTimeout(renderToday,2500);
  },function(err){
    if(el)el.innerHTML='<div style="padding:9px;background:rgba(227,80,80,.1);border-radius:9px;font-size:12px;color:var(--red)">Error: '+err+'</div>';
  });
}
