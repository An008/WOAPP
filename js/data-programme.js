// Iron Protocol - data-programme.js
// SESSIONS, ASSESS_EXES, PHASES, MACRO_TARGETS, LM, MSGS, FEEL
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// EXERCISE DATA \u2014 3 sessions, no landmine
// ===========================================================
var SESSIONS={
A:{id:'A',name:'STRENGTH',icon:'&#128170;',col:'#E8A02A',hero:'hero-A',dur:'~55 min',after:'breathing',
blocks:[
{id:'WU',n:'WARM-UP',col:'#4A9EDB',exs:[
{id:'wu1',n:'Shoulder CARs',v:'2 \u00d7 5/arm',t:'r',s:2,rpp:5,rest:0,wt:false,intent:'support',cue:'Full shoulder circumduction, biggest circle you can draw. Zero speed. Directly addresses the elbow-shoulder junction stiffness.',yt:'shoulder CARs tutorial',feel:'Grinding spots are information, not damage. Move through them slowly.'},
{id:'wu2',n:'Hip CARs',v:'2 \u00d7 5/side',t:'r',s:2,rpp:5,rest:0,wt:false,intent:'support',cue:'Stand tall, knee up, trace the largest circle the hip allows without the pelvis following.',yt:'hip CARs tutorial',feel:'Hip capsule working at end range. Pelvis stays still.'},
{id:'wu3',n:'Wall Slide',v:'2 \u00d7 10',t:'r',s:2,rpp:10,rest:0,wt:false,intent:'support',cue:'Back to wall, forearms flat, slide overhead keeping contact. If contact breaks, that is your current ceiling.',yt:'wall slide shoulder mobility',feel:'Mid-back and rear shoulders engaging to keep the arms on the wall.'},
{id:'wu4',n:'Glute Bridge',v:'2 \u00d7 12',t:'r',s:2,rpp:12,rest:0,wt:false,intent:'support',cue:'Drive through heels, squeeze at the top, ribs down. Wakes the glutes before they are asked to work.',yt:'glute bridge form',feel:'Glutes doing the work, not the lower back.'}]},
{id:'B1',n:'HINGE',col:'#E8A02A',exs:[
{id:'hinge',t:'r',s:3,rpp:8,rest:150,pattern:'hinge',intent:'strength',rli:0.55,cue:'THE PATTERN THE PROGRAMME WAS MISSING. Hips back, spine neutral, drive the floor away. BASE: trap bar or RDL. FIELD: single-leg RDL, slow and balanced. This is where posterior chain strength actually comes from.',yt:'trap bar deadlift form',feel:'Hamstrings loading on the way down, glutes finishing the lift. Lower back braced but not working.'},
{id:'squat',t:'r',s:3,rpp:8,rest:150,pattern:'squat',intent:'strength',rli:0.86,cue:'Full depth, knees tracking over toes, chest up. BASE: leg press or goblet. FIELD: split squat rung matched to your load.',yt:'squat depth form',feel:'Quads and glutes under real tension. Bottom position should be controlled, never dropped into.'}]},
{id:'B2',n:'PRESS',col:'#E35050',exs:[
{id:'h-press',t:'r',s:4,rpp:8,rest:120,pattern:'h-press',intent:'strength',rli:0.62,cue:'BASE: DB bench, elbows around 45 degrees, full stretch at the bottom. FIELD: the push-up rung that matches the same load.',yt:'dumbbell bench press form',feel:'Chest stretching at the bottom, triceps finishing the press. Shoulders stay back and down.'},
{id:'v-press',t:'r',s:3,rpp:8,rest:120,pattern:'v-press',intent:'strength',rli:0.45,cue:'BASE: machine overhead press, kinder to the shoulder junction than free weight. FIELD: pike push-up rung. Ribs down, no lower-back arch.',yt:'overhead press form',feel:'Shoulders and triceps. If it pinches at the top, reduce range before reducing load.'}]},
{id:'B3',n:'PULL',col:'#3DB87A',exs:[
{id:'h-pull',t:'r',s:4,rpp:10,rest:120,pattern:'h-pull',intent:'strength',rli:0.27,cue:'USE STRAPS on BASE so grip stops capping your back. Pull the elbow past the torso, squeeze, control the return.',yt:'chest supported row form',feel:'Deep pull through the lat. Bicep assists but should not dominate.'},
{id:'v-pull',t:'r',s:4,rpp:6,rest:120,pattern:'v-pull',intent:'strength',rli:0.7,cue:'Straps on BASE. Lead with the elbows, chest to the bar. FIELD: assisted or negative pull-up rung.',yt:'pull up progression',feel:'Lats loading from a full stretch. Shoulders active at the bottom, never hanging dead.'}]},
{id:'GRIP',n:'GRIP',col:'#9B8DE8',exs:[
{id:'grip',t:'r',s:3,rpp:0,rest:90,pattern:'grip',intent:'hypertrophy',rli:1.0,cue:'LAST, deliberately. Grip trained here never limits your pulling earlier in the mission.',yt:'dead hang grip strength',feel:'Forearm pump building. The set ends when the fingers start to open.'}]},
{id:'PRE',n:'PREHAB',col:'#4A9EDB',exs:[
{id:'tib',n:'Tibialis Raise',v:'2 \u00d7 20',t:'r',s:2,rpp:20,rest:45,wt:false,intent:'support',cue:'Heels planted, toes lifted toward the shins. Direct shin splint insurance before the vertical work.',yt:'tibialis raise tutorial',feel:'Burn along the front of the shin. Should feel preventative, never sharp.'},
{id:'heel-d',n:'Eccentric Heel Drop',v:'2 \u00d7 15',t:'r',s:2,rpp:15,rest:45,wt:false,intent:'support',cue:'Rise on both feet, lower on one over 4 slow seconds. The lowering is where the adaptation lives.',yt:'eccentric heel drop',feel:'Controlled stretch through the whole calf on the way down.'}]},
{id:'MF',n:'MENTAL FORTITUDE',col:'#9B8DE8',exs:[
{id:'breath-mf',n:'Exhale Breath Hold',v:'3 rounds',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Exhale fully, then hold. Sit with the urge to breathe. CO2 tolerance is trainable and transfers directly to composure under load.',yt:'CO2 tolerance breath hold',feel:'The urge arrives long before you actually need air. Sitting with it calmly is the skill.'}]}]},
B:{id:'B',name:'VERTICAL',icon:'&#128507;',col:'#4A9EDB',hero:'hero-B',dur:'~50 min',after:'journal',
blocks:[
{id:'WU',n:'WARM-UP',col:'#4A9EDB',exs:[
{id:'easy-w',n:'Easy Walk',v:'5 min \u2014 HR under 110',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Arrival, not a warm-up drill. Let the heart rate settle before you climb.',yt:null,feel:'Completely comfortable, breathing unhurried.'},
{id:'ankle-p',n:'Ankle Prep',v:'2 \u00d7 15',t:'r',s:2,rpp:15,rest:0,wt:false,intent:'support',cue:'Ankle circles both directions, then calf raises. The ankle takes everything on a descent.',yt:'ankle mobility prep running',feel:'Loosening through the ankle and calf. No sharp shin sensation.'}]},
{id:'CLIMB',n:'CLIMB INTERVALS',col:'#E8A02A',exs:[
{id:'climb',n:'Uphill Interval',v:'6 \u00d7 3 min @ RPE 7-8 / 2 min easy',t:'r',s:6,rpp:1,rest:120,wt:false,intent:'endurance',cue:'THE MISSING PATTERN. BASE: treadmill 10-12 percent, or a stair machine. FIELD: any hill or stairwell. Three minutes hard, two minutes walking recovery. Your event is climbing.',yt:'uphill interval training trail running',feel:'Heavy breathing, speech in fragments only. Legs burning by minute two. Recovery should feel genuinely easy.'}]},
{id:'DESC',n:'DESCENT',col:'#E35050',exs:[
{id:'desc',n:'Eccentric Step-Down',v:'3 \u00d7 8/leg (4s lower)',t:'r',s:3,rpp:8,rest:90,wt:false,intent:'strength',cue:'Stand on a step, one foot on the edge. Lower the other heel toward the floor over 4 slow seconds, tap, drive back up. START LOW AND DO NOT ADD HEIGHT THIS WEEK. Quad soreness at 24-48h is expected. Shin pain is not \u2014 stop the block if you feel it.',yt:'eccentric step down descent training',feel:'Quad of the standing leg controlling the whole descent. This is the tissue that fails on long downhills.'}]},
{id:'CARRY',n:'CARRY',col:'#9B8DE8',exs:[
{id:'carry',t:'r',s:3,rpp:1,rest:120,pattern:'carry',intent:'strength',rli:0.3,cue:'ONE hand, not one per hand. Walk 75m, switch, walk back. Stay vertical \u2014 leaning means too heavy. FIELD: the side plank rung trains the identical anti-lateral-flexion quality.',yt:'suitcase carry tutorial',feel:'Obliques on the UNLOADED side working hardest. Felt in the lower back means you are leaning.'},
{id:'grip-b',t:'r',s:2,rpp:0,rest:60,pattern:'grip',intent:'hypertrophy',rli:1.0,cue:'Straight after the carry, grip already taxed. That is the point.',yt:'dead hang grip endurance',feel:'Fails faster than in Mission 1. Correct.'}]},
{id:'FLUSH',n:'ZONE 2 FLUSH',col:'#3DB87A',exs:[
{id:'z2',n:'Zone 2 Flush',v:'10 min \u2014 HR 125-140',t:'time',s:1,rest:0,wt:false,intent:'endurance',cue:'Conversational pace. Full sentences without gasping. Max HR estimate 180, so Zone 2 is 126-140. Always after the hard work, never before.',yt:'zone 2 running nasal breathing',feel:'Embarrassingly easy. If it feels too slow it is probably correct.'}]},
{id:'MOB',n:'MOBILITY',col:'#4A9EDB',exs:[
{id:'hip-fs',n:'Hip Flexor Stretch',v:'2 \u00d7 45s/side',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Half-kneeling, tuck the pelvis, squeeze the back glute, then lean. The glute squeeze is what makes it work.',yt:'couch stretch hip flexor',feel:'Deep stretch at the front of the rear hip. Ribs stay down.'}]},
{id:'MFS',n:'MENTAL FORESIGHT',col:'#9B8DE8',exs:[
{id:'vis',n:'Journal',v:'3 questions',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Body scan, one surprise, one intention. Two minutes. Soviet debrief protocol, and the most skipped pillar in any programme.',yt:null,feel:'Clarity about what the session actually cost you.'}]}]},
C:{id:'C',name:'POWER',icon:'&#9889;',col:'#E35050',hero:'hero-C',dur:'~45 min',after:'breathing',
blocks:[
{id:'WU',n:'WARM-UP',col:'#4A9EDB',exs:[
{id:'hip-sw',n:'Hip Swings',v:'2 \u00d7 10/side',t:'r',s:2,rpp:10,rest:0,wt:false,intent:'support',cue:'Front-to-back then lateral. Loosen the hip before asking it to produce force.',yt:'leg swing warm up',feel:'Hip loosening, range increasing each rep.'},
{id:'a-march',n:'A-March',v:'2 \u00d7 20m',t:'r',s:2,rpp:1,rest:0,wt:false,intent:'support',cue:'Tall posture, drive the knee up, snap the foot down under the hip. Teaches the sprint mechanic slowly.',yt:'A march sprint drill',feel:'Hip flexors lifting, foot striking under you rather than in front.'}]},
{id:'COMPLEX',n:'COMPLEX PAIRS',col:'#E35050',exs:[
{id:'pap-primer',t:'r',s:3,rpp:5,rest:30,pattern:'squat',intent:'power',rli:0.86,cue:'COMPLEX PRIMER: drive up hard and fast. Then take ONLY 30 seconds before the jump \u2014 the post-activation window is 30-60s and closes fast.',yt:'post activation potentiation complex',feel:'Hip extensors loaded and primed. The jump straight after should feel springier.'},
{id:'pap-power',t:'r',s:3,rpp:3,rest:240,pattern:'power',intent:'power',rli:0.9,cue:'COMPLEX POWER: execute within 30 seconds of the primer. Maximum intent every rep. Land SOFT. Then 4 FULL minutes before the next pair \u2014 the CNS needs it to express the same power again.',yt:'broad jump post activation potentiation',feel:'Noticeably more explosive than a cold jump. If not, the rest after the primer was too long.'}]},
{id:'SPRINT',n:'SPRINT',col:'#E8A02A',exs:[
{id:'hill-sp',n:'Hill Sprint',v:'6 \u00d7 20s @ max / 90s walk down',t:'r',s:6,rpp:1,rest:90,wt:false,intent:'power',cue:'Steep hill, maximum effort for 20 seconds, walk down as recovery. Hills are safer than flat sprints for a shin splint history \u2014 shorter stride, softer landing, less eccentric load.',yt:'hill sprint training',feel:'Full-body effort. Legs heavy by rep four. Walk down fully recovered, never jog it.'}]},
{id:'BOX',n:'COMBAT',col:'#9B8DE8',exs:[
{id:'shadow',n:'Shadow Boxing',v:'3 \u00d7 2 min',t:'r',s:3,rpp:1,rest:60,wt:false,intent:'endurance',cue:'Hands up, move the feet, breathe out on every strike. Agility and coordination under fatigue.',yt:'shadow boxing footwork',feel:'Shoulders burning by round two. Feet should never stop moving.'}]},
{id:'GRIP',n:'GRIP',col:'#3DB87A',exs:[
{id:'grip-c',t:'r',s:3,rpp:0,rest:90,pattern:'grip',intent:'hypertrophy',rli:1.0,cue:'Fatigued finisher. Grip under CNS fatigue builds endurance fresh grip work cannot.',yt:'dead hang grip training',feel:'Fails faster than Mission 1. Push to the same threshold.'}]},
{id:'MF',n:'MENTAL FORTITUDE',col:'#9B8DE8',exs:[
{id:'cold-s',n:'Cold Shower',v:'2 min',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Cold as you can hold, 2 minutes, breathing slow and controlled. Deliberate discomfort with a clear purpose.',yt:'cold exposure protocol',feel:'The first 20 seconds are the fight. After that it is just cold.'}]}]},
D:{id:'D',name:'LONG RANGE',icon:'&#127956;',col:'#3DB87A',hero:'hero-D',dur:'75-120 min',after:'journal',
blocks:[
{id:'WU',n:'WARM-UP',col:'#4A9EDB',exs:[
{id:'easy-w2',n:'Easy Walk',v:'10 min',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Long day. Start slower than feels necessary.',yt:null,feel:'Unhurried. The pace should feel almost lazy at the start.'}]},
{id:'LONG',n:'LONG CLIMB',col:'#E8A02A',exs:[
{id:'long-climb',n:'Long Climb',v:'Phase 1: 45-60 min continuous',t:'time',s:1,rest:0,wt:false,intent:'endurance',cue:'THE MISSION THAT ACTUALLY PREPARES YOU FOR FINLAND X. Continuous climbing, Zone 2, HR 125-140. Builds 45 min in Phase 1 toward 3 hours by Phase 4. Practise fuelling here, not on race day.',yt:'long trail run training ultra',feel:'Sustainable for hours. If you cannot speak in sentences, slow down \u2014 this is duration, not intensity.'}]},
{id:'CARRY',n:'LOADED CARRY',col:'#9B8DE8',exs:[
{id:'carry-long',t:'r',s:1,rpp:1,rest:0,pattern:'carry',intent:'endurance',rli:0.3,cue:'Toward the 30kg x 5km goal. Build distance before load. BASE: pack or suitcase carry. FIELD: loaded pack, or extended side plank holds if nothing is available.',yt:'rucking training',feel:'Steady, sustainable. Shoulders and core, not the lower back.'}]},
{id:'FUEL',n:'RACE SKILLS',col:'#3DB87A',exs:[
{id:'fuel',n:'Fuelling Practice',v:'Log what you ate and when',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Eat and drink on the move at a set interval. The gut is trainable and race day is the wrong place to discover it is not.',yt:'ultra running nutrition strategy',feel:'Note any stomach discomfort. That is data for race day.'}]},
{id:'MOB',n:'MOBILITY',col:'#4A9EDB',exs:[
{id:'post-mob',n:'Post-Long Mobility',v:'8 min',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Calves, quads, hip flexors, glutes. 45-60s each, breathing out into what is tight.',yt:'post run mobility routine',feel:'Easing rather than stretching. Do not force anything after a long effort.'}]},
{id:'MFS',n:'MENTAL FORESIGHT',col:'#9B8DE8',exs:[
{id:'vis-d',n:'Visualisation',v:'5 min',t:'time',s:1,rest:0,wt:false,intent:'support',cue:'Eyes closed. Rehearse the hardest part of the event in detail \u2014 the climb that hurts, the descent when the quads are gone. Soviet sports psychology treated this as training, not decoration.',yt:'visualisation athletes mental training',feel:'Vivid enough to raise your heart rate slightly. That is the marker.'}]}]},
REST:{id:'REST',name:'ACTIVE RECOVERY',icon:'&#127807;',col:'#3A5570',hero:'hero-REST',dur:'25\u201340 min',after:null,
blocks:[
{id:'R',n:'RECOVERY',col:'#3A5570',exs:[
{id:'easy-walk',n:'Easy Walk',v:'20\u201330 min',t:'time',s:1,rest:0,wt:false,cue:'Flat. Easy. Under 100 BPM. Nasal breathing. Blood flow without CNS demand.',yt:null,feel:'Comfortable. Easy. This is not wasted time \u2014 it accelerates recovery.'},
{id:'foam-full',n:'Full Body Foam Roll',v:'10 min',t:'time',s:1,rest:0,wt:false,cue:'Calves 2min \u2192 hamstrings 2min \u2192 glutes 2min \u2192 upper back 2min \u2192 lats 2min.',yt:'full body foam rolling routine',feel:'Gradual release through each area. Tender spots are normal \u2014 hold and breathe.'},
{id:'box-br',n:'Box Breathing',v:'5 min',t:'time',s:1,rest:0,wt:false,cue:'4s in / 4s hold / 4s out / 4s hold. Supine. No phone. Nervous system resets here.',yt:'box breathing recovery',feel:'Gradual slowing of heart rate. Parasympathetic shift \u2014 calming.'},
{id:'grip-work',n:'Passive Grip Work',v:'3 \u00d7 30 squeezes each hand',t:'r',s:3,rpp:30,rest:0,wt:false,cue:'Squeeze a tennis ball, grip trainer, or rolled towel. 30 slow, controlled squeezes per hand. Do it while reading or watching TV \u2014 this is background volume, not a training session. No equipment: close your fist slowly against resistance from your other hand for 30 reps. This adds hundreds of reps of grip work per week that cost nothing in recovery.',yt:null,feel:'Mild forearm pump. Should not be taxing. The value is invisible accumulation over weeks \u2014 not the individual session.'}
]},
{id:'MFS',n:'MENTAL FORESIGHT',col:'#9B8DE8',exs:[
{id:'vis',n:'Visualization',v:'5 min',t:'time',s:1,rest:0,wt:false,cue:'Close eyes. Picture your next training session in detail. This is a trainable skill.',yt:'sports visualization technique',feel:'Mental clarity. Images forming. This gets easier with practice.'}
]}
]}
};

var ASSESS_EXES=[
{id:'as-pu',n:'Max Push-ups',v:'Max reps \u2014 stop at form break',t:'r',rpp:0,s:1,rest:120,wt:false,cue:'Hands outside shoulders. Chest to floor. Count every clean rep.',yt:'push up max test',feel:'Progressive chest and tricep burn. Stop at the first rep where form breaks.'},
{id:'as-ws',n:'Wall Sit Hold',v:'Max time (seconds)',t:'time',s:1,rest:120,wt:false,cue:'Back flat against wall. Knees at 90\u00b0. Hold until legs give.',yt:'wall sit test',feel:'Quad burn accumulating. This should feel like your thighs are on fire.'},
{id:'as-pl',n:'Plank Hold',v:'Max time (seconds)',t:'time',s:1,rest:120,wt:false,cue:'Forearms down. Rigid head-to-heels. Stop when hips drop.',yt:'plank hold test',feel:'Core tension throughout. Hips wanting to drop. Hold until form breaks.'},
{id:'as-sq',n:'20 Bodyweight Squats',v:'Rate effort only',t:'r',rpp:20,s:1,rest:90,wt:false,cue:'Continuous. Full depth. Rate RPE after 20 reps.',yt:'bodyweight squat form',feel:'Quad burn building. At RPE 8+ you are near your limit.'},
{id:'as-hang',n:'Dead Hang',v:'Max time (seconds)',t:'time',s:1,rest:120,wt:false,cue:'Jump to bar. Full hang. Breathe. Time until you drop. Enter 0 if no bar.',yt:'dead hang test',feel:'Grip fatigue and forearm pump. Gentle traction through the spine.'},
{id:'as-400',n:'400m Walk/Jog \u2014 Time',v:'Time in seconds',t:'time',s:1,rest:0,wt:false,cue:'400m flat. Walk or jog. Record time. Note breathing state after.',yt:null,feel:'Cardiovascular response at your current fitness level. No judgement \u2014 just data.'}
];

var PHASES=[
{num:1,name:'FOUNDATION',weeks:8,desc:'Build movement quality, address joint discomfort, establish aerobic base.'},
{num:2,name:'DEVELOPMENT',weeks:12,desc:'Strength builds, runs extend to 45 min, sprints become real.'},
{num:3,name:'INTEGRATION',weeks:16,desc:'All 5 pillars operating. Trail runs begin.'},
{num:4,name:'READINESS',weeks:12,desc:'Event-specific preparation. Long efforts. Heavy loads.'}
];

var MACRO_TARGETS={
  A:{kcal:2550,protein:175,carbs:278,fat:82},   // Strength day: 175*4+278*4+82*9=2550
  B:{kcal:2400,protein:170,carbs:250,fat:80},   // Aerobic day:  170*4+250*4+80*9=2400
  C:{kcal:2400,protein:168,carbs:250,fat:80},   // Explosive day:168*4+250*4+80*9=2392
  REST:{kcal:1850,protein:165,carbs:130,fat:75} // Recovery day: 165*4+130*4+75*9=1855
};

var LM=[
{id:'l1',i:'&#127939;',g:'Run 5km non-stop (any pace)',p:'Aerobic'},
{id:'l2',i:'&#128170;',g:'20 consecutive push-ups, full ROM',p:'Strength'},
{id:'l3',i:'&#127939;',g:'First dead-hang pull-up',p:'Strength'},
{id:'l4',i:'&#127947;',g:'Carry 15kg \u00d7 1km non-stop',p:'Carry'},
{id:'l5',i:'&#9889;',g:'6 \u00d7 40m sprint, full 4 min rest',p:'Power'},
{id:'l6',i:'&#127756;',g:'60s exhale breath hold, 3 rounds',p:'Fortitude'},
{id:'l7',i:'&#127939;',g:'Run 45 min non-stop Zone 2',p:'Aerobic'},
{id:'l8',i:'&#127947;',g:'Carry 20kg \u00d7 5km',p:'Carry'},
{id:'l9',i:'&#128170;',g:'10 consecutive pull-ups',p:'Strength'},
{id:'l10',i:'&#127944;',g:'Trail run 90 min continuous',p:'Aerobic'},
{id:'l11',i:'&#127942;',g:'Finland X completion',p:'All Pillars'}
];

var MSGS=['Strong work. One set closer.','Nobody felt like training. You showed up.','Consistency beats intensity every time.','Your future self is watching this rep.','Every set is a deposit in your health account.','This is the work. Everything else is just talking.','One more. Always one more.','Progress is always happening, even when invisible.','The discomfort you feel is adaptation in progress.','Better than yesterday. That\'s the only target.','Champions train when they don\'t feel like it.','Breathe. Brace. Execute.','The hardest rep is always the first one.','Effort is the only variable fully in your control.','Done beats perfect. Log it and move.','Finland X isn\'t a destination \u2014 it\'s who you\'re becoming.','Rest. Reset. Next set.','Your nervous system is learning. Trust the process.','Earned, not given. Every rep.','Show up. Do the work. Repeat.'];

// Muscle feel data
var FEEL={
'goblet':'Burning across the front thighs. Glutes fire on the drive up \u2014 if you only feel your lower back, check hip hinge.',
'pushup':'Chest burn, tricep fatigue from rep 8+. Core braced throughout. Hips drop = stop the set.',
'scap-pu':'Squeeze behind shoulder blades without bending elbows. Lats engaging.',
'band-pa':'Tension across the back of shoulders at end range. External rotation burn.',
'db-row':'Deep pull through the side of your back (lat) as elbow passes torso.',
'sl-hip':'Intense glute contraction at top. Lower back dominant = squeeze glutes harder.',
'pike-pu':'Shoulder burn through the front deltoid. All weight is forward \u2014 normal.',
'dead-hang':'Grip fatigue and forearm pump. Gentle spinal traction.',
'tib':'Burn in the outer shin muscle. Should feel like it\'s about to cramp. Correct.',
'heel-d':'Calf stretch on the controlled 4-second lowering. Adaptation happens here.',
'box-step':'Front thigh and glute together. Stepping leg does all the work.',
'broad-j':'Explosive hip extension \u2014 glutes and thighs together. Land soft, knees bent.',
'accel':'Controlled hip drive. At 70-80% it should feel managed, not maximal.',
'a-skip':'Rhythmic hip flexor pull. Calves assist on push-off. Stay light.',
'shadow':'Hip rotation initiates each punch. Obliques twisting, not just arms swinging.',
'suitcase':'Anti-lean tension through obliques on the loaded side. Traps isometric.',
'z2':'Embarrassingly easy \u2014 you should hold a full sentence. Correct.',
'breath-mf':'CO2 discomfort on the hold. Not dangerous. The point is learning to stay calm.',
'cold-s':'Gasp, then settle. Slow your breathing consciously. Shock fades after 10s.',
'co2':'CO2 accumulation creates urge to breathe. Recovery breaths feel disproportionately good.',
'dead-hang':'Forearm pump building steadily. Fingers wanting to open at the limit \u2014 that moment is the training. Gentle spinal traction throughout.',
'dead-hang-c':'Grip fatigue arrives faster after explosive work \u2014 this is deliberate. Same threshold: fingers opening = done.',
'rev-curl':'Outer forearm (brachioradialis) and wrist extensors. Burns faster than expected. Start lighter than you think.',
'plate-pinch':'Burning through all five digits and lower forearm by 15s. Genuinely hard by 25\u201330s. Easy = heavier plate.',
'grip-work':'Mild forearm pump. Should feel like nothing. The point is invisible accumulation over weeks.'
};

// ===========================================================
// STATE
