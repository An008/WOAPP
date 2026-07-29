// Iron Protocol - field.js
// BASE vs FIELD loadout. BASE assumes a facility. FIELD assumes a room, a
// doorway, a chair, a towel and a loaded backpack - nothing else.
//
// Field variants keep the SAME exercise id as their base counterpart. That is
// deliberate: RPE history, muscle maps, development volume, assessment loads
// and mission completion all continue to resolve against one id, so switching
// loadout never fragments the record.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var LOADOUTS={
  base :{id:'base', name:'BASE',  label:'Facility',  col:'#E8A02A',
         note:'Full equipment available.'},
  field:{id:'field',name:'FIELD', label:'Body + floor', col:'#4A9EDB',
         note:'Bodyweight only. A body and a floor.'}
};

// id -> overrides applied on top of the base exercise
var FIELD={

  // --- MISSION A ------------------------------------------------------------
  
  
  
  
  
  
  // --- MISSION B ------------------------------------------------------------
  
  
  'foam-t':{n:'Floor Thoracic Extension',v:'2 min',s:1,rest:0,wt:false,
    cue:'Lie on your back, knees bent, hands behind the head. Press the mid-back into the floor, then arch gently over that point and breathe into it for 20\u201330 seconds. Work a few different spots up and down the mid-back. Follow with cat-cow on all fours.',
    yt:'thoracic extension floor mobility no equipment',
    feel:'Opening through the mid-back. Keep the ribs down \u2014 the movement should come from the upper back, not the lower.'},

  // --- MISSION C ------------------------------------------------------------
  
  
  // --- REST -----------------------------------------------------------------
  'foam-full':{n:'Floor Mobility Flow',v:'10 min',s:1,rest:0,wt:false,
    cue:'Continuous slow flow on the floor: cat-cow, thread-the-needle each side, 90/90 hip switches, deep squat hold, couch stretch against the floor, supine twist. 45\u201360 seconds per position, breathing out into whatever is tight.',
    yt:'floor mobility flow no equipment',
    feel:'Gradual easing rather than sharp stretch. Breathe out into the tight spot instead of bracing against it.'}
};

// Current loadout: the mission record wins, otherwise the profile default
var MISSION_MODE='base';

function missionStarted(key){
  var s=S.sessions[key];
  if(!s||!s.exercises)return false;
  var any=false;
  Object.keys(s.exercises).forEach(function(id){
    var e=s.exercises[id];
    if(e&&(e.comp||(e.sets||[]).some(function(x){return x&&x.done;})))any=true;
  });
  return any;
}
function loadoutFor(date,type){
  var k=sessKey(date,type), s=S.sessions[k];
  // Only honour a stamped mode once real work exists. Before that the toggle
  // must always win, or simply opening the mission would lock you in.
  if(s&&s.mode&&missionStarted(k))return s.mode;
  return (S.profile&&S.profile.loadout)||'base';
}
function setLoadout(m){
  if(!LOADOUTS[m])return;
  if(!S.profile)S.profile={};
  S.profile.loadout=m;
  // Retag every unstarted mission record for today so nothing is left stale
  Object.keys(S.sessions).forEach(function(k){
    if(k.indexOf(today()+'|')!==0)return;
    if(!missionStarted(k))S.sessions[k].mode=m;
  });
  saveS();
  if(typeof renderToday==='function')renderToday();
}

// Merge a field override onto a base exercise. Same id, different prescription.
function resolveEx(ex,mode){
  mode=mode||MISSION_MODE;
  var out={};
  for(var k in ex)if(ex.hasOwnProperty(k))out[k]=ex[k];
  // layer 0: pattern-driven objectives resolve name, volume and load from the
  // athlete's current RLI, so BASE and FIELD deliver the same stimulus
  if(ex.pattern&&typeof prescribe==='function'){
    var rli=(S&&S.profile&&S.profile.rli&&S.profile.rli[ex.id]!=null)?S.profile.rli[ex.id]:(ex.rli||0.5);
    var pr=prescribe(ex.pattern,rli,mode,ex.s,ex.rpp);
    if(pr){
      out.n=pr.name; out.v=pr.v; out.wt=pr.weighted;
      out.s=pr.sets; out.rpp=pr.reps; out.rli=pr.rli;
      out.patternName=pr.patternName; out.ladder=pr.ladder;
      if(pr.load!=null)out.recLoad=pr.load;
    }
  }
  // layer 1: field variant (fixed swaps for non-pattern objectives)
  if(mode==='field'){
    var f=FIELD[ex.id];
    if(f){for(var k2 in f)if(f.hasOwnProperty(k2))out[k2]=f[k2];out.fieldVariant=true;}
  }
  // layer 2: AI replacement from a mission debrief - always wins
  var ov=S&&S.profile&&S.profile.overrides&&S.profile.overrides[ex.id];
  if(ov){
    for(var k3 in ov)if(ov.hasOwnProperty(k3)&&ov[k3]!==undefined&&k3!=='replacedOn')out[k3]=ov[k3];
    out.aiReplaced=true;
  }
  return out;
}

// How much of a mission actually changes in field loadout
function fieldSwapCount(type){
  var sd=SESSIONS[type];
  if(!sd)return 0;
  var n=0;
  sd.blocks.forEach(function(b){b.exs.forEach(function(e){if(FIELD[e.id])n++;});});
  return n;
}
