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
  field:{id:'field',name:'FIELD', label:'Expedient', col:'#4A9EDB',
         note:'Bodyweight and improvised load only.'}
};

// id -> overrides applied on top of the base exercise
var FIELD={

  // --- MISSION A ------------------------------------------------------------
  'scap-pu':{n:'Doorframe Scapular Pull',v:'3 \u00d7 10',s:3,rpp:10,rest:45,wt:false,
    cue:'Grip both sides of a doorframe at chest height, arms straight, lean back until your bodyweight is on your arms. Without bending the elbows, pull your shoulder blades down and together. Hold 2s. The further back you lean, the harder it gets. Same scapular control as the bar version, no bar required.',
    yt:'doorway scapular retraction bodyweight',
    feel:'The muscles between and below your shoulder blades switching on. Elbows stay locked \u2014 if they bend, you have turned it into a row.'},

  'band-pa':{n:'Prone Y-T-W Raise',v:'2 \u00d7 8 each position',s:2,rpp:8,rest:45,wt:false,
    cue:'Face down on the floor, forehead resting down. Arms out in a Y, lift them off the floor 8 times. Then a T, 8 times. Then a W (elbows bent, squeeze down and back), 8 times. No weight needed \u2014 gravity plus a dead-slow tempo is the resistance.',
    yt:'prone Y T W raises posterior shoulder',
    feel:'Deep burn across the rear shoulders and mid-back by the T position. If your neck is working, your forehead has come off the floor.'},

  'db-row':{n:'Inverted Row',v:'3 \u00d7 8\u201312',s:3,rpp:10,rest:75,wt:false,
    cue:'Under a sturdy table: grip the edge, body straight, heels on the floor, pull your chest to the underside. No table \u2014 use a loaded backpack held in one hand, hinged over a chair, same row pattern. Make it harder by walking your feet further out, not by rushing.',
    yt:'inverted row under table bodyweight',
    feel:'Same deep pull through the lat as the dumbbell version. Body stays in one rigid line \u2014 if your hips sag, reset.'},

  'dead-hang':{n:'Towel Door Hang',v:'3 \u00d7 max hold',s:3,rpp:0,rest:90,wt:false,
    cue:'Throw a strong towel over the top of a solidly hung door, grip both ends, sink into a squat so your arms take the load. Feet stay lightly down for support. Towel grip is HARDER than a bar \u2014 expect shorter holds and take that as the point. No door: bent-arm hang from a table edge.',
    yt:'towel hang grip strength no bar',
    feel:'Forearms loading fast because the towel gives you nothing to hook onto. Fingers wanting to open is the signal you are training the right thing.'},

  'goblet':{n:'Bulgarian Split Squat',v:'3 \u00d7 8/side',s:3,rpp:8,rest:90,wt:false,
    cue:'Rear foot on a chair or sofa edge, front foot far enough forward that the front shin stays near vertical. Sink straight down, drive up through the front heel. Splitting the stance loads one leg with roughly 85 per cent of bodyweight \u2014 that is what replaces the kettlebell. Add a loaded backpack once 8 reps get easy.',
    yt:'bulgarian split squat form',
    feel:'Front quad and glute under real load, plus a stretch through the rear hip flexor. Far harder than it looks \u2014 start without the backpack.'},

  'rev-curl':{n:'Towel Wring',v:'2 \u00d7 30s each direction',s:2,rpp:1,rest:30,wt:false,
    cue:'Take a damp towel in both hands and wring it as hard as you can, one direction for 30s, then reverse. This loads the wrist extensors and brachioradialis \u2014 the same muscles the reverse curl targets and the ones that failed before your back did.',
    yt:'towel wring forearm grip exercise',
    feel:'Deep burn through the outer forearm and the back of the wrist. Both forearms working simultaneously, unlike the curl.'},

  // --- MISSION B ------------------------------------------------------------
  'suitcase':{n:'Backpack Suitcase Carry',v:'3 \u00d7 150m per side \u2014 ONE hand',s:3,rpp:1,rest:120,wt:false,
    cue:'Load a backpack with books, water bottles or sand and carry it by the TOP HANDLE in ONE hand \u2014 not on your back, not one in each hand. Walk 75m, switch, walk 75m. Identical anti-lateral-flexion demand as the dumbbell version. Add weight to the pack every two weeks.',
    yt:'suitcase carry loaded backpack',
    feel:'Oblique tension on the UNLOADED side \u2014 the side not holding the bag works hardest. If you lean toward the load, lighten the pack.'},

  'plate-pinch':{n:'Book Pinch Carry',v:'2 \u00d7 30s per hand',s:2,rpp:1,rest:60,wt:false,
    cue:'Pinch a thick hardback book (or two stacked) between thumb and four fingers by its flat covers \u2014 no spine, no handle. Hold or walk 30s, switch hands. Any smooth-faced heavy object works. This trains the exact pinch grip the plate version does.',
    yt:'pinch grip training no equipment',
    feel:'Burning through all four fingers and the thumb pad by 15 seconds. If you reach 30s easily, add a second book.'},

  'foam-t':{n:'Tennis Ball Thoracic Release',v:'2 min',s:1,rest:0,wt:false,
    cue:'Two tennis balls taped together, or a single ball, placed either side of the spine at mid-back. Lie on them, arms crossed over your chest, breathe into the tight spots for 20\u201330s each. A tightly rolled towel works if you have no ball.',
    yt:'tennis ball thoracic mobilisation',
    feel:'Localised release either side of the spine. Do not roll directly on the bone \u2014 stay on the muscle beside it.'},

  // --- MISSION C ------------------------------------------------------------
  'box-step':{n:'Stair Step-up (COMPLEX PRIMER)',v:'3 \u00d7 6/side',s:3,rpp:6,rest:30,wt:false,
    cue:'COMPLEX PAIR: use the second or third stair \u2014 whatever puts your thigh near parallel. Drive through the top-leg heel, control the way down. Take ONLY 30 seconds rest, then go straight into Broad Jumps while the hip extensors are still primed.',
    yt:'stair step up power primer',
    feel:'Quad and glute of the stepping leg loading hard. The jump straight after should feel noticeably more explosive.'},

  'dead-hang-c':{n:'Towel Door Hang (fatigued finisher)',v:'3 \u00d7 max hold',s:3,rpp:0,rest:90,wt:false,
    cue:'Same towel-over-door hang, executed after the explosive work. Grip is already taxed and that is deliberate \u2014 holding under fatigue is what builds pulling endurance. Sink into a squat, let the arms take the load, breathe through it.',
    yt:'towel hang grip endurance',
    feel:'Grip fails faster than in Mission A. Correct. Push to the same threshold: fingers opening ends the serial.'},

  // --- REST -----------------------------------------------------------------
  'foam-full':{n:'Tennis Ball Full Body Release',v:'10 min',s:1,rest:0,wt:false,
    cue:'Work a tennis ball against the floor or a wall: calves, glutes, mid-back, lats, and the soles of the feet. 45\u201360s per area, breathing into anything tight. A rolled towel or a water bottle covers the larger areas.',
    yt:'tennis ball self massage recovery',
    feel:'Sharp at first, easing as the tissue releases. Breathe out into the tight spot rather than bracing against it.'}
};

// Current loadout: the mission record wins, otherwise the profile default
var MISSION_MODE='base';

function loadoutFor(date,type){
  var s=S.sessions[sessKey(date,type)];
  if(s&&s.mode)return s.mode;
  return (S.profile&&S.profile.loadout)||'base';
}
function setLoadout(m){
  if(!LOADOUTS[m])return;
  if(!S.profile)S.profile={};
  S.profile.loadout=m;
  var k=sessKey(today(),(planToday().mode==='train'?planToday().type:'REST'));
  var s=S.sessions[k];
  if(s&&sessComp(k).pct===0)s.mode=m;   // not started yet: retag it
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
