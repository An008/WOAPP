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
  'scap-pu':{n:'Prone Scapular Retraction',v:'3 \u00d7 10 (2s hold)',s:3,rpp:10,rest:45,wt:false,
    cue:'Face down, forehead on the floor, arms out to the sides at shoulder height, palms down. Without bending the elbows, lift the arms by squeezing the shoulder blades down and together. Hold 2 seconds at the top. Elbows stay locked \u2014 the moment they bend you have turned it into a row and lost the scapular work.',
    yt:'prone scapular retraction floor',
    feel:'A tight squeeze between and below the shoulder blades. Your neck should be doing nothing \u2014 keep the forehead down.'},

  'band-pa':{n:'Reverse Snow Angel',v:'2 \u00d7 12',s:2,rpp:12,rest:45,wt:false,
    cue:'Face down, arms by your sides, palms down. Lift both arms off the floor and sweep them slowly overhead in a wide arc, keeping them off the floor the whole way, then sweep back. Dead slow. Gravity plus the long lever is the whole resistance.',
    yt:'reverse snow angel prone shoulder',
    feel:'Deep burn across the rear shoulders and mid-back, worst around the halfway point. If the arms touch down mid-rep, slow the sweep and shorten the range.'},

  'db-row':{n:'Prone Swimmer Pull',v:'3 \u00d7 10 (3s per rep)',s:3,rpp:10,rest:75,wt:false,
    cue:'Face down, arms extended overhead off the floor. Pull the elbows down and back toward your ribs, driving the shoulder blades together, ending with hands beside your chest. Squeeze hard for 1 second, then extend slowly back overhead. Keep everything off the floor for the whole set \u2014 that constant tension is what creates the load.',
    yt:'prone swimmer pull back exercise',
    feel:'The lats and mid-back working continuously, never resting. By rep 7 the arms will want to drop \u2014 holding them up is the set.'},

  'dead-hang':{n:'Fingertip Plank Hold',v:'3 \u00d7 max hold',s:3,rpp:0,rest:90,wt:false,
    cue:'Plank position but on your FINGERTIPS rather than flat palms, fingers spread wide, knuckles slightly bent and strong. Body in one straight line. Regress to knees if the wrists complain. This loads the finger flexors under bodyweight \u2014 the same tissue a hang trains, using only the floor.',
    yt:'fingertip plank grip strength',
    feel:'Fingers and forearms burning hard within 20 seconds. The set ends when a finger buckles, not when your core gives out \u2014 drop to knees to keep loading the hands.'},

  'goblet':{n:'Tempo Split Squat',v:'3 \u00d7 8/side (5s down, 2s pause)',s:3,rpp:8,rest:90,wt:false,
    cue:'Long split stance, both feet flat on the floor, rear knee tracking toward the ground. Lower for a full 5 seconds, pause 2 seconds at the bottom, drive up through the front heel. Tempo is what replaces load: 8 reps at this speed is roughly 60 seconds of tension per leg. Front shin stays near vertical.',
    yt:'tempo split squat bodyweight',
    feel:'Front quad and glute under sustained tension, and a real stretch through the rear hip. The pause at the bottom removes all bounce \u2014 that is the point.'},

  'rev-curl':{n:'Self-Resisted Wrist Extension',v:'2 \u00d7 15/side',s:2,rpp:15,rest:30,wt:false,
    cue:'Rest one forearm across your thigh, palm down, hand hanging past the knee. Place the opposite palm over the back of that hand and press down. Lift the hand against your own resistance, then lower slowly against it. You control the load entirely \u2014 push hard enough that rep 15 is a struggle.',
    yt:'self resisted wrist extension forearm',
    feel:'The outer forearm and the back of the wrist working \u2014 the exact tissue that failed before your back did.'},

  // --- MISSION B ------------------------------------------------------------
  'suitcase':{n:'Side Plank',v:'3 \u00d7 45s/side',s:3,rpp:1,rest:75,wt:false,
    cue:'On your side, elbow under the shoulder, body in one straight line, hips lifted and HELD. This is the purest anti-lateral-flexion exercise there is \u2014 identical training quality to the suitcase carry, which is only ever about resisting sideways collapse. Regress to bent knees, progress by lifting the top leg.',
    yt:'side plank form anti lateral flexion',
    feel:'The underside obliques and the hip working to stop your midsection sagging toward the floor. The moment the hip drops, the set is over.'},

  'plate-pinch':{n:'Fingertip Hold',v:'2 \u00d7 30s per hand',s:2,rpp:1,rest:60,wt:false,
    cue:'Kneel and place ONE hand on the floor on fingertips, fingers spread, then shift weight over that arm until the hand is carrying real load. Hold 30 seconds, switch. Progress by walking the knees back so more bodyweight goes through the hand.',
    yt:'fingertip hold grip training floor',
    feel:'Burning through all four fingers and the thumb pad by 15 seconds. If 30 seconds is easy, shift more weight forward.'},

  'foam-t':{n:'Floor Thoracic Extension',v:'2 min',s:1,rest:0,wt:false,
    cue:'Lie on your back, knees bent, hands behind the head. Press the mid-back into the floor, then arch gently over that point and breathe into it for 20\u201330 seconds. Work a few different spots up and down the mid-back. Follow with cat-cow on all fours.',
    yt:'thoracic extension floor mobility no equipment',
    feel:'Opening through the mid-back. Keep the ribs down \u2014 the movement should come from the upper back, not the lower.'},

  // --- MISSION C ------------------------------------------------------------
  'box-step':{n:'Split Squat (COMPLEX PRIMER)',v:'3 \u00d7 8/side',s:3,rpp:8,rest:30,wt:false,
    cue:'COMPLEX PAIR: split stance, both feet on the floor, drive up hard and fast through the front heel \u2014 explosive on the way up, controlled down. Take ONLY 30 seconds rest, then straight into jumps while the hip extensors are still primed.',
    yt:'split squat explosive bodyweight',
    feel:'Front quad and glute loading hard. The jump immediately after should feel noticeably springier.'},

  'dead-hang-c':{n:'Fingertip Plank (fatigued finisher)',v:'3 \u00d7 max hold',s:3,rpp:0,rest:90,wt:false,
    cue:'Same fingertip plank, executed after the explosive work. Grip is already taxed and that is deliberate \u2014 holding under fatigue is what builds pulling endurance. Drop to knees to keep the hands loaded once the core fades.',
    yt:'fingertip plank grip endurance',
    feel:'Fingers fail faster than in Mission A. Correct. Push to the same threshold.'},

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
  if(mode!=='field')return ex;
  var f=FIELD[ex.id];
  if(!f)return ex;
  var out={};
  for(var k in ex)if(ex.hasOwnProperty(k))out[k]=ex[k];
  for(var k2 in f)if(f.hasOwnProperty(k2))out[k2]=f[k2];
  out.fieldVariant=true;
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
