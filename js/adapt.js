// Iron Protocol - adapt.js
// THE AUTOREGULATION ENGINE. Russian structure, Western regulation.
//
//   Matveyev      -> phases and wave loading (3 build weeks, 1 deload)
//   Verkhoshansky -> concentrated blocks, PAP pairing, shock method by phase
//   Western        -> RPE autoregulation, double progression, polarised endurance
//
// The trainee's own RPE and rep performance move them along the RLI scale. The
// programme is a set of targets; this file decides what those targets become.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// Target effort by block intent. Support work is never escalated.
var RPE_TARGET={
  strength:{lo:7,hi:9},      // 1-3 reps in reserve
  hypertrophy:{lo:7,hi:8},
  power:{lo:6,hi:7},         // speed is the metric, never grind
  endurance:{lo:3,hi:5},     // zone driven
  support:{lo:2,hi:5}        // warm-up, mobility, prehab - correct when easy
};

// How far the RLI moves for a given miss. Deliberately asymmetric: back off
// faster than you push on.
function rliDelta(achieved,target){
  if(achieved==null)return 0;
  var gap=target.lo-achieved;
  if(gap>=4)return 0.14;      // trivially easy - large jump
  if(gap>=2)return 0.08;
  if(gap>=1)return 0.04;
  if(achieved<target.hi)return 0.02;    // strictly inside band - creep up
  if(achieved<=target.hi+1)return 0;    // at or just past ceiling - hold
  return -0.07;                          // over the ceiling - reduce
}

// Mean RPE and reps for one objective across the most recent sessions of a type
function objectiveHistory(exId,type,limit){
  var keys=Object.keys(S.sessions||{})
    .filter(function(k){return S.sessions[k]&&S.sessions[k].type===type;})
    .sort().reverse().slice(0,limit||3);
  var out=[];
  keys.forEach(function(k){
    var ed=(S.sessions[k].exercises||{})[exId];
    if(!ed)return;
    var sets=(ed.sets||[]).filter(function(x){return x.done&&x.rpe!=null;});
    if(!sets.length)return;
    out.push({
      key:k,date:S.sessions[k].date||k.split('|')[0],
      rpe:sets.reduce(function(a,x){return a+x.rpe;},0)/sets.length,
      reps:sets.reduce(function(a,x){return a+(x.rp||0);},0)/sets.length,
      load:sets.filter(function(x){return x.wt!=null;}).map(function(x){return x.wt;})[0]||null,
      sets:sets.length
    });
  });
  return out;
}

// Where an objective's RLI should sit for the next mission
function nextRLI(exId,patternId,type,intent,currentRLI){
  var t=RPE_TARGET[intent||'strength'];
  if(intent==='support')return {rli:currentRLI,reason:'Support work - held by design',delta:0};
  var h=objectiveHistory(exId,type,3);
  if(!h.length)return {rli:currentRLI,reason:'No rated history yet',delta:0};
  var recent=h[0];
  var d=rliDelta(recent.rpe,t);
  // two easy sessions in a row compounds the correction
  if(h.length>1&&h[1].rpe<t.lo-1&&recent.rpe<t.lo-1)d*=1.5;
  // deload weeks hold load and cut volume instead
  if(typeof isDeloadWeek==='function'&&isDeloadWeek())d=0;
  var next=Math.max(0.1,Math.round((currentRLI+d)*100)/100);
  var reason= d>0.10?'Far below target RPE - large increase'
            : d>0.03?'Below target RPE - increase'
            : d>0    ?'In band - progressive creep'
            : d===0  ?(isDeloadWeek&&isDeloadWeek()?'Deload week - load held':'At ceiling - hold')
            :         'Above target RPE - reduce';
  return {rli:next,reason:reason,delta:Math.round(d*100)/100,
          lastRpe:Math.round(recent.rpe*10)/10,target:t};
}

// Double progression: add actions before adding load
function nextPrescription(obj){
  var cur=(S.profile&&S.profile.rli&&S.profile.rli[obj.id])||obj.rli||0.5;
  var adj=nextRLI(obj.id,obj.pattern,obj.type,obj.intent,cur);
  var loadout=(S.profile&&S.profile.loadout)||'base';
  var p=prescribe(obj.pattern,adj.rli,loadout);
  return {exId:obj.id,pattern:obj.pattern,rli:adj.rli,prescription:p,
          reason:adj.reason,delta:adj.delta,lastRpe:adj.lastRpe};
}

// Commit the new RLI after a mission debrief
function commitRLI(exId,rli){
  if(!S.profile.rli)S.profile.rli={};
  S.profile.rli[exId]=Math.round(rli*100)/100;
  saveS();
}

// Run every work objective in a mission through the engine
function adaptMission(type){
  var sd=SESSIONS[type];
  if(!sd)return [];
  var out=[];
  sd.blocks.forEach(function(blk){
    (blk.exs||[]).forEach(function(ex){
      if(!ex.pattern)return;
      var r=nextPrescription({id:ex.id,pattern:ex.pattern,type:type,
                              intent:ex.intent||'strength',rli:ex.rli});
      if(r.delta!==0||r.lastRpe!=null)out.push(r);
    });
  });
  return out;
}
