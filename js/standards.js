// Iron Protocol - standards.js
// Goals as TIERED TRACKS, not a fixed list.
//
// The old model held 11 goals, five per phase. Clearing Phase 1's five left
// nothing until the programme week advanced - which needs 32 training missions.
// Standards ran dry after a month.
//
// Each track is an open ladder: clear a tier, the next appears. Tracks build
// toward the stated objective - Finland X and a 30kg x 5km carry.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var TRACKS=[
 {id:'push',i:'&#128170;',p:'Strength',name:'Push-ups',tiers:[
   {g:'20 consecutive push-ups, full ROM'},
   {g:'30 consecutive push-ups'},
   {g:'40 consecutive push-ups'},
   {g:'50 consecutive push-ups'},
   {g:'20 feet-elevated push-ups'},
   {g:'5 archer push-ups per side'},
   {g:'1 one-arm push-up negative'}]},

 {id:'pull',i:'&#128170;',p:'Strength',name:'Pull-ups',tiers:[
   {g:'First dead-hang pull-up'},
   {g:'3 consecutive pull-ups'},
   {g:'5 consecutive pull-ups'},
   {g:'8 consecutive pull-ups'},
   {g:'10 consecutive pull-ups'},
   {g:'15 consecutive pull-ups'},
   {g:'Pull-up with 10kg added'}]},

 {id:'legs',i:'&#129461;',p:'Strength',name:'Lower Body',tiers:[
   {g:'20 bodyweight squats, full depth'},
   {g:'10 split squats per side'},
   {g:'10 Bulgarian split squats per side'},
   {g:'5 shrimp squats per side'},
   {g:'First pistol squat'},
   {g:'5 pistol squats per side'},
   {g:'Trap bar deadlift at bodyweight'}]},

 {id:'run',i:'&#127939;',p:'Aerobic',name:'Distance',tiers:[
   {g:'Run 5km non-stop (any pace)'},
   {g:'Run 10km non-stop'},
   {g:'Run 15km non-stop'},
   {g:'Run 21km (half marathon)'},
   {g:'Run 30km'},
   {g:'Run 42km (marathon distance)'}]},

 {id:'z2',i:'&#127939;',p:'Aerobic',name:'Zone 2 Duration',tiers:[
   {g:'Run 45 min non-stop Zone 2'},
   {g:'Run 60 min non-stop Zone 2'},
   {g:'Run 90 min continuous'},
   {g:'Run 2 hours continuous'},
   {g:'Run 3 hours continuous'},
   {g:'Run 4 hours continuous'}]},

 {id:'vert',i:'&#127956;',p:'Vertical',name:'Vertical Gain',tiers:[
   {g:'300m vertical gain in one session'},
   {g:'600m vertical gain in one session'},
   {g:'1000m vertical gain in one session'},
   {g:'1500m vertical gain in one session'},
   {g:'2000m vertical gain in one session'},
   {g:'Back-to-back 1000m days'}]},

 {id:'carry',i:'&#127947;',p:'Carry',name:'Loaded Carry',tiers:[
   {g:'Carry 15kg \\u00d7 1km non-stop'},
   {g:'Carry 20kg \\u00d7 2km non-stop'},
   {g:'Carry 25kg \\u00d7 3km non-stop'},
   {g:'Carry 30kg \\u00d7 3km non-stop'},
   {g:'Carry 30kg \\u00d7 5km non-stop'},
   {g:'Carry 30kg \\u00d7 10km non-stop'}]},

 {id:'grip',i:'&#9994;',p:'Grip',name:'Hang',tiers:[
   {g:'30s dead hang'},
   {g:'60s dead hang'},
   {g:'90s dead hang'},
   {g:'2 min dead hang'},
   {g:'30s single-arm hang per side'},
   {g:'60s single-arm hang per side'}]},

 {id:'power',i:'&#9889;',p:'Power',name:'Explosive',tiers:[
   {g:'6 \\u00d7 40m sprint, full 4 min rest'},
   {g:'Broad jump your own height'},
   {g:'10 \\u00d7 40m sprint, full recovery'},
   {g:'Broad jump 1.2 \\u00d7 your height'},
   {g:'8 \\u00d7 20s hill sprint, full recovery'},
   {g:'Depth jump from 40cm, soft landing'}]},

 {id:'breath',i:'&#127756;',p:'Fortitude',name:'CO2 Tolerance',tiers:[
   {g:'60s exhale breath hold, 3 rounds'},
   {g:'75s exhale breath hold, 3 rounds'},
   {g:'90s exhale breath hold, 3 rounds'},
   {g:'2 min exhale breath hold, 3 rounds'},
   {g:'5 min cold exposure, controlled breathing'},
   {g:'10 min cold exposure, controlled breathing'}]},

 {id:'trail',i:'&#127958;',p:'Mission',name:'Trail',tiers:[
   {g:'Trail run 90 min continuous'},
   {g:'Trail run 3 hours continuous'},
   {g:'Trail run 5 hours continuous'},
   {g:'Back-to-back long trail days'},
   {g:'Finland X completion'}]}
];

function trackById(id){
  for(var i=0;i<TRACKS.length;i++)if(TRACKS[i].id===id)return TRACKS[i];
  return null;
}

// S.standards = {trackId: number of tiers cleared}
function ensureStandards(){
  if(!S.standards)S.standards={};
  TRACKS.forEach(function(t){if(S.standards[t.id]==null)S.standards[t.id]=0;});
  return S.standards;
}

// One-time migration from the old fixed landmark list
var LM_TO_TRACK={l1:['run',1],l2:['push',1],l3:['pull',1],l4:['carry',1],
                 l5:['power',1],l6:['breath',1],l7:['z2',1],l8:['carry',3],
                 l9:['pull',5],l10:['trail',1],l11:['trail',5]};
function migrateStandards(){
  ensureStandards();
  if(S.__stdMigrated)return 0;
  var n=0;
  (S.landmarks||[]).forEach(function(lm){
    if(!lm||!lm.done)return;
    var m=LM_TO_TRACK[lm.id];
    if(!m)return;
    if(S.standards[m[0]]<m[1]){S.standards[m[0]]=m[1];n++;}
  });
  S.__stdMigrated=true;
  saveS();
  return n;
}

function totalTiers(){
  var n=0;TRACKS.forEach(function(t){n+=t.tiers.length;});return n;
}
function clearedTiers(){
  ensureStandards();
  var n=0;TRACKS.forEach(function(t){n+=Math.min(S.standards[t.id]||0,t.tiers.length);});
  return n;
}

// The next unclaimed tier on every track that still has one
function openStandards(){
  ensureStandards();
  var out=[];
  TRACKS.forEach(function(t){
    var done=S.standards[t.id]||0;
    if(done>=t.tiers.length)return;
    out.push({trackId:t.id,i:t.i,p:t.p,track:t.name,
              tier:done,total:t.tiers.length,
              g:t.tiers[done].g,id:t.id+':'+done});
  });
  // earliest tiers first, so progression stays ordered rather than scattered
  return out.sort(function(a,b){return a.tier-b.tier;});
}

function achievedStandards(){
  ensureStandards();
  var out=[];
  TRACKS.forEach(function(t){
    var done=Math.min(S.standards[t.id]||0,t.tiers.length);
    for(var i=0;i<done;i++)
      out.push({trackId:t.id,i:t.i,p:t.p,track:t.name,tier:i,
                g:t.tiers[i].g,id:t.id+':'+i});
  });
  return out;
}

// Claim the next tier on a track
function claimStandard(trackId){
  ensureStandards();
  var t=trackById(trackId);
  if(!t)return false;
  var done=S.standards[trackId]||0;
  if(done>=t.tiers.length)return false;
  S.standards[trackId]=done+1;
  if(!S.standardLog)S.standardLog=[];
  S.standardLog.push({track:trackId,tier:done,g:t.tiers[done].g,date:today()});
  saveS();
  if(typeof renderToday==='function')renderToday();
  return true;
}
