// Iron Protocol - patterns.js
// THE MODEL. Training is defined by movement PATTERNS, not exercises.
// Every pattern has two expression ladders - BASE (facility) and FIELD
// (bodyweight) - both indexed by the same currency: Relative Load Index.
//
//   RLI = effective load at the working limb / bodyweight
//
// This is what makes the loadouts genuinely equivalent. FIELD is not an easier
// fallback: it is the SAME stimulus delivered without equipment, selected by
// matching the athlete's current BASE load.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var PATTERNS={

 'h-press':{name:'Horizontal Press',primary:['chest','triceps'],secondary:['shoulders','abs'],
   base:[{n:'DB Bench Press',unit:'kg',perSide:true},
         {n:'Barbell Bench Press',unit:'kg'},
         {n:'Machine Chest Press',unit:'kg'}],
   field:[{n:'Wall Push-up',rli:0.15,v:'3 \u00d7 15'},
          {n:'Incline Push-up (bench height)',rli:0.35,v:'3 \u00d7 12'},
          {n:'Knee Push-up',rli:0.45,v:'3 \u00d7 12'},
          {n:'Standard Push-up',rli:0.64,v:'4 \u00d7 8-12'},
          {n:'Feet-Elevated Push-up (30cm)',rli:0.70,v:'4 \u00d7 8'},
          {n:'Feet-Elevated Push-up (60cm)',rli:0.75,v:'4 \u00d7 6-8'},
          {n:'Archer Push-up',rli:0.80,v:'4 \u00d7 5/side'},
          {n:'Deep Push-up, 3s pause',rli:0.85,v:'4 \u00d7 5'},
          {n:'One-Arm Push-up Eccentric',rli:1.00,v:'4 \u00d7 3/side'}]},

 'v-press':{name:'Vertical Press',primary:['shoulders','triceps'],secondary:['traps','abs'],
   base:[{n:'Machine Overhead Press',unit:'kg'},
         {n:'DB Overhead Press',unit:'kg',perSide:true},
         {n:'Landmine Press',unit:'kg'}],
   field:[{n:'Seated Pike Press',rli:0.30,v:'3 \u00d7 12'},
          {n:'Pike Push-up',rli:0.47,v:'3 \u00d7 8-10'},
          {n:'Elevated Pike Push-up',rli:0.60,v:'3 \u00d7 8'},
          {n:'Wall Handstand Push-up (partial)',rli:0.75,v:'3 \u00d7 5'},
          {n:'Wall Handstand Push-up',rli:0.90,v:'3 \u00d7 3-5'},
          {n:'Freestanding HSPU',rli:1.05,v:'3 \u00d7 2-3'}]},

 'h-pull':{name:'Horizontal Pull',primary:['lats','rhomboids'],secondary:['biceps','rear_delt','forearms'],
   base:[{n:'Chest-Supported Row',unit:'kg'},
         {n:'DB Row',unit:'kg',perSide:true},
         {n:'Seated Cable Row',unit:'kg'}],
   field:[{n:'Prone Swimmer Pull',rli:0.20,v:'3 \u00d7 10'},
          {n:'Inverted Row, feet under',rli:0.40,v:'4 \u00d7 10'},
          {n:'Inverted Row, feet forward',rli:0.55,v:'4 \u00d7 8-10'},
          {n:'Inverted Row, feet elevated',rli:0.70,v:'4 \u00d7 8'},
          {n:'Archer Inverted Row',rli:0.85,v:'4 \u00d7 5/side'},
          {n:'One-Arm Inverted Row',rli:1.00,v:'4 \u00d7 4/side'}]},

 'v-pull':{name:'Vertical Pull',primary:['lats','biceps'],secondary:['forearms','rhomboids'],
   base:[{n:'Lat Pulldown',unit:'kg'},
         {n:'Assisted Pull-up',unit:'kg'},
         {n:'Weighted Pull-up',unit:'kg'}],
   field:[{n:'Scapular Pull-up',rli:0.20,v:'3 \u00d7 10'},
          {n:'Band-Assisted Pull-up',rli:0.55,v:'4 \u00d7 6'},
          {n:'Negative Pull-up, 5s lower',rli:0.95,v:'4 \u00d7 4'},
          {n:'Pull-up',rli:1.00,v:'4 \u00d7 max'},
          {n:'Weighted Pull-up',rli:1.15,v:'4 \u00d7 5'}]},

 'squat':{name:'Squat',primary:['quads','glutes'],secondary:['abs','calves'],
   base:[{n:'Leg Press',unit:'kg'},
         {n:'Goblet Squat',unit:'kg'},
         {n:'Barbell Back Squat',unit:'kg'},
         {n:'Trap Bar Squat',unit:'kg'}],
   field:[{n:'Bodyweight Squat',rli:0.65,v:'3 \u00d7 20'},
          {n:'Tempo Squat, 5s down',rli:0.72,v:'3 \u00d7 12'},
          {n:'Split Squat',rli:0.85,v:'3 \u00d7 10/side'},
          {n:'Bulgarian Split Squat',rli:0.95,v:'3 \u00d7 8/side'},
          {n:'Shrimp Squat',rli:1.10,v:'3 \u00d7 5/side'},
          {n:'Pistol Squat',rli:1.30,v:'3 \u00d7 3/side'}]},

 'hinge':{name:'Hinge',primary:['hamstrings','glutes'],secondary:['lats','forearms'],
   base:[{n:'Trap Bar Deadlift',unit:'kg'},
         {n:'Romanian Deadlift',unit:'kg'},
         {n:'Kettlebell Swing',unit:'kg'},
         {n:'Hip Thrust',unit:'kg'}],
   field:[{n:'Bodyweight Good Morning',rli:0.30,v:'3 \u00d7 15'},
          {n:'Single-Leg Hip Thrust',rli:0.65,v:'3 \u00d7 12/side'},
          {n:'Single-Leg RDL',rli:0.75,v:'3 \u00d7 10/side'},
          {n:'Sliding Leg Curl',rli:0.95,v:'3 \u00d7 8'},
          {n:'Nordic Curl Negative',rli:1.20,v:'3 \u00d7 5'}]},

 'carry':{name:'Loaded Carry',primary:['abs','traps','forearms'],secondary:['glutes','quads'],
   base:[{n:'Suitcase Carry',unit:'kg'},
         {n:'Farmer Carry',unit:'kg',perSide:true},
         {n:'Rucksack March',unit:'kg'}],
   field:[{n:'Side Plank',rli:0.35,v:'3 \u00d7 45s/side'},
          {n:'Side Plank, top leg raised',rli:0.50,v:'3 \u00d7 30s/side'},
          {n:'Suitcase Hold, loaded pack',rli:0.70,v:'3 \u00d7 60s/side'},
          {n:'Single-Arm Overhead Hold',rli:0.85,v:'3 \u00d7 40s/side'}]},

 'grip':{name:'Grip',primary:['forearms'],secondary:[],
   base:[{n:'Plate Pinch',unit:'kg'},{n:'Farmer Hold',unit:'kg'},{n:'Dead Hang',unit:'kg'}],
   field:[{n:'Fingertip Plank',rli:0.55,v:'3 \u00d7 max'},
          {n:'Dead Hang',rli:1.00,v:'3 \u00d7 max'},
          {n:'One-Arm Hang Assist',rli:1.40,v:'3 \u00d7 15s/side'}]},

 'power':{name:'Explosive',primary:['quads','glutes'],secondary:['calves','hamstrings'],
   base:[{n:'Trap Bar Jump',unit:'kg'},{n:'Kettlebell Swing',unit:'kg'},{n:'Box Jump',unit:'kg'}],
   field:[{n:'Squat Jump',rli:0.65,v:'5 \u00d7 3'},
          {n:'Split Squat Jump',rli:0.85,v:'5 \u00d7 4/side'},
          {n:'Broad Jump',rli:0.90,v:'5 \u00d7 3'},
          {n:'Tuck Jump',rli:1.00,v:'5 \u00d7 5'},
          {n:'Depth Jump (30cm)',rli:1.30,v:'5 \u00d7 3'}]}
};

// --- CONVERSION --------------------------------------------------------------
function athleteBW(){
  var c=(typeof bodyComp==='function')?bodyComp():null;
  return (c&&c.weight)?c.weight:(S&&S.profile&&S.profile.weight)||71.3;
}

// A BASE prescription in kg becomes an RLI. bwFraction is how much of the
// athlete's own mass the movement already carries (a squat carries most of it,
// a bench press carries none).
var BW_CARRIED={'squat':0.65,'hinge':0.15,'h-press':0,'v-press':0,
                'h-pull':0,'v-pull':0,'carry':0,'grip':0,'power':0.65};

function baseToRLI(patternId,loadKg){
  var bw=athleteBW();
  var carried=BW_CARRIED[patternId]||0;
  return Math.round(((Number(loadKg)||0)+carried*bw)/bw*100)/100;
}
function rliToBase(patternId,rli){
  var bw=athleteBW();
  var carried=BW_CARRIED[patternId]||0;
  return Math.max(0,Math.round((rli*bw-carried*bw)/2.5)*2.5);
}

// Closest field rung to a target RLI
function fieldRung(patternId,rli){
  var p=PATTERNS[patternId];
  if(!p)return null;
  var best=p.field[0],d=Infinity;
  p.field.forEach(function(r){
    var diff=Math.abs(r.rli-rli);
    if(diff<d){d=diff;best=r;}
  });
  return best;
}
function rungIndex(patternId,rli){
  var p=PATTERNS[patternId];if(!p)return 0;
  var idx=0,d=Infinity;
  p.field.forEach(function(r,i){var q=Math.abs(r.rli-rli);if(q<d){d=q;idx=i;}});
  return idx;
}
// Step a field rung up or down the ladder
function stepRung(patternId,rli,delta){
  var p=PATTERNS[patternId];if(!p)return rli;
  var i=Math.max(0,Math.min(p.field.length-1,rungIndex(patternId,rli)+delta));
  return p.field[i].rli;
}

// The single entry point: given a pattern and a target RLI, what do I do today?
function prescribe(patternId,rli,loadout){
  var p=PATTERNS[patternId];
  if(!p)return null;
  if(loadout==='field'){
    var r=fieldRung(patternId,rli);
    return {name:r.n,v:r.v,rli:r.rli,weighted:false,pattern:patternId,
            patternName:p.name,ladder:'field'};
  }
  var kg=rliToBase(patternId,rli);
  return {name:p.base[0].n,v:kg+'kg',rli:rli,weighted:true,load:kg,
          pattern:patternId,patternName:p.name,ladder:'base'};
}
