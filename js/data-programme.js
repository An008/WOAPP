// Iron Protocol - data-programme.js
// SESSIONS, ASSESS_EXES, PHASES, MACRO_TARGETS, LM, MSGS, FEEL
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// EXERCISE DATA \u2014 3 sessions, no landmine
// ===========================================================
var SESSIONS={
A:{id:'A',name:'STRUCTURAL STRENGTH',icon:'&#128170;',col:'#E8A02A',hero:'hero-A',dur:'~45 min',after:'breathing',
blocks:[
{id:'WU',n:'WARM-UP',col:'#4A9EDB',exs:[
{id:'wu1',n:'Shoulder CARs',v:'2 \u00d7 5/arm',t:'r',s:2,rpp:5,rest:0,wt:false,cue:'Full shoulder circumduction \u2014 biggest circle possible. Zero speed. Directly addresses shoulder-spine junction stiffness.',yt:'shoulder CARs tutorial',feel:'A smooth, controlled range of motion around the shoulder joint. Should feel like greasing the joint, not straining it.'},
{id:'wu2',n:'Wall Slide',v:'2 \u00d7 10',t:'r',s:2,rpp:10,rest:0,wt:false,cue:'Forearms flat on wall, elbows 90\u00b0. Slide up keeping contact. Lift off at top. Activates lower trapezius.',yt:'wall slide scapular exercise',feel:'A gentle squeeze behind the shoulder blades at the top. No pain \u2014 just activation.'},
{id:'wu3',n:'Hip CARs',v:'2 \u00d7 5/side',t:'r',s:2,rpp:5,rest:0,wt:false,cue:'Standing. Biggest hip circle possible. Stabilising leg planted and braced.',yt:'hip CARs tutorial',feel:'Controlled range of motion in the hip socket. Stability leg should feel firm throughout.'}
]},
{id:'B1',n:'FOUNDATION PULL',col:'#E8A02A',exs:[
{id:'scap-pu',n:'Scapular Pull-up',v:'3 \u00d7 8',t:'r',s:3,rpp:8,rest:60,wt:false,cue:'Dead hang. Without bending elbows \u2014 squeeze lats to lift body 3\u20135 cm. 3s lower. Gateway to your first full pull-up.',yt:'scapular pull up tutorial',feel:'A squeeze and lift sensation behind the shoulder blades without the arms bending. Lats engaging \u2014 like putting your shoulder blades into your back pockets.'},
{id:'band-pa',n:'Band Pull-Apart',v:'3 \u00d7 15',t:'r',s:3,rpp:15,rest:45,wt:true,cue:'Arms at shoulder height. Pull apart until band touches chest. External rotation at end range. Builds posterior shoulder health.',yt:'band pull apart form tutorial',feel:'Tension across the back of your shoulders at end range. External rotation burn. If you only feel traps: slow down and pull lower.'},
{id:'db-row',n:'Dumbbell Row',v:'3 \u00d7 10/side',t:'r',s:3,rpp:10,rest:60,wt:true,cue:'Brace on bench. Drive elbow back past torso. Full scapular retraction at end. Left side first each set.',yt:'dumbbell row form',feel:'A deep pull through the side of your back (lat) as the elbow passes your torso. Bicep assist is normal but should not dominate.'},
{id:'dead-hang',n:'Dead Hang',v:'3 \u00d7 max hold (target: 20s \u2192 60s \u2192 2min over Phase 1)',t:'r',s:3,rpp:0,rest:90,wt:false,cue:'Jump to bar. Grip firmly, shoulders ACTIVE (slight engagement, not passive shrug). Breathe through the hold. Let the forearm pump accumulate \u2014 the moment your fingers want to open is the training stimulus. This is the direct fix for grip failing before your back during rows. Also decompresses your spine after the pressing and pulling.',yt:'dead hang grip strength endurance',feel:'Forearm pump building steadily. At the limit you feel the fingers wanting to open \u2014 that moment is the training. Gentle spinal traction throughout \u2014 the back should feel lengthened.'}
]},
{id:'B2',n:'PUSH',col:'#E35050',exs:[
{id:'pushup',n:'Push-up',v:'3 \u00d7 max (stop before form breaks)',t:'r',s:3,rpp:0,rest:90,wt:false,cue:'Hands just outside shoulders. Chest to 1 cm from floor. Stop when hips drop. Week 1 target: 15. Week 8 target: 25+.',yt:'push up perfect form',feel:'Chest burn and tricep fatigue from rep 8 onwards. Core should feel braced throughout \u2014 if your lower back arches, stop the set.'},
{id:'pike-pu',n:'Pike Push-up',v:'2 \u00d7 8',t:'r',s:2,rpp:8,rest:60,wt:false,cue:'Inverted V. Lower head toward floor between hands. Builds shoulder pressing strength without overhead load.',yt:'pike push up tutorial',feel:'Shoulder burn straight down through the front deltoid. Harder than it looks because all weight is forward.'}
]},
{id:'B3',n:'LOWER BODY',col:'#3DB87A',exs:[
{id:'goblet',n:'Goblet Squat',v:'3 \u00d7 10',t:'r',s:3,rpp:10,rest:60,wt:true,cue:'Hold KB/DB at chest. Squat deep \u2014 elbows inside knees at bottom. Drive through heels. Back tall.',yt:'goblet squat tutorial',feel:'Burning across the front of your thighs as reps accumulate. Glutes fire on the drive up \u2014 if you only feel your lower back, check hip hinge.'},
{id:'sl-hip',n:'Single-Leg Hip Thrust',v:'3 \u00d7 8/side',t:'r',s:3,rpp:8,rest:45,wt:false,cue:'Shoulders on bench, one foot on floor. Drive hips up through heel. 2s hold at top. Glute should burn.',yt:'single leg hip thrust tutorial',feel:'Intense glute contraction at the top. If you feel your lower back: squeeze glutes harder and tuck pelvis.'}
]},
{id:'PRE',n:'PREHAB',col:'#9B8DE8',exs:[
{id:'tib',n:'Tibialis Raise',v:'2 \u00d7 20',t:'r',s:2,rpp:20,rest:30,wt:false,cue:'Heels elevated 5 cm. Pull toes to shin. 2s up / 3s slow lower. Shin splint prevention. Do this forever.',yt:'tibialis raise tutorial',feel:'Burn and pump in the muscle running up your outer shin. Should feel like it\'s about to cramp. That\'s correct.'},
{id:'heel-d',n:'Eccentric Heel Drop',v:'2 \u00d7 12/leg',t:'r',s:2,rpp:12,rest:30,wt:false,cue:'On a step. Rise on BOTH feet. Lower on ONE \u2014 4 full seconds down. Achilles protection.',yt:'eccentric heel drop tutorial',feel:'Controlled eccentric stretch through the entire calf on the way down. The 4-second lowering is where adaptation happens.'},
{id:'rev-curl',n:'Reverse Curl',v:'2 \u00d7 15 \u2014 start light (5\u20136 kg)',t:'r',s:2,rpp:15,rest:30,wt:true,cue:'Palms FACING DOWN (pronated grip). Curl as normal. These are the forearm extensors and brachioradialis \u2014 the muscles that stabilise your wrist during rows and give out first. Start much lighter than you expect. 2s up, 3s slow lower. Keep wrists neutral at the top \u2014 do not curl the wrist.',yt:'reverse curl forearm brachioradialis form',feel:'The outer forearm (brachioradialis) and the top of the wrist working hard on every rep. Burns faster than expected. If you feel nothing: weight is too light. If you feel it in your bicep more than your forearm: check that palms are fully DOWN.'}
]},
{id:'MF',n:'MENTAL FORTITUDE',col:'#4A9EDB',exs:[
{id:'breath-mf',n:'Exhale Breath Hold',v:'3 rounds',t:'time',s:1,rest:0,wt:false,cue:'Breathe normally. Exhale all air. Hold on empty lungs until discomfort is real. 5 recovery breaths. \u00d7 3. Tap to open guided timer.',yt:'CO2 tolerance breathing',feel:'CO2 discomfort when holding. A tightness in the chest and urge to breathe. This is not dangerous. This is the point. Stay calm.'}
]}
]},
B:{id:'B',name:'AEROBIC ENGINE + CARRY',icon:'&#127939;',col:'#4A9EDB',hero:'hero-B',dur:'~55 min',after:'journal',
blocks:[
{id:'WU',n:'WARM-UP',col:'#4A9EDB',exs:[
{id:'easy-w',n:'Easy Walk',v:'5 min \u2014 HR under 110 bpm',t:'time',s:1,rest:0,wt:false,cue:'Easy walking pace. HR under 110 bpm. Nasal breathing only. This is not a warmup exercise \u2014 it is arrival at the session. Let your body settle before the run.',yt:null,feel:'Completely comfortable. Breathing unhurried. Heart rate dropping from commute/travel to baseline.'}
]},
{id:'RUN',n:'ZONE 2 RUN',col:'#3DB87A',exs:[
{id:'z2',n:'Zone 2 Run',v:'Phase target (see cue)',t:'time',s:1,rest:0,wt:false,cue:'Conversation pace. HR 130\u2013140. Mouth-breathing = slow down. Ph1: Wk1\u20132: 20min \u00b7 Wk3\u20134: 25min \u00b7 Wk5\u20136: 30min \u00b7 Wk7\u20138: 35min.',yt:'zone 2 running nasal breathing',feel:'Embarrassingly easy. You should be able to speak full sentences. This is correct. Zone 2 feels almost too slow.'},
{id:'walk-r',n:'Walk Recovery',v:'5 min \u2014 wait until HR is below 110 bpm',t:'time',s:1,rest:0,wt:false,cue:'Walk until HR drops below 110 bpm before starting the carries. Do not start the suitcase carry while still breathing hard \u2014 it defeats the anti-lean cue.',yt:null,feel:'HR visibly dropping. Breathing returning to comfortable. You should feel ready before the carries, not rushed.'}
]},
{id:'CARRY',n:'LOADED CARRY',col:'#E8A02A',exs:[
{id:'suitcase',n:'Suitcase Carry',v:'3 \u00d7 150m/side',t:'r',s:3,rpp:1,rest:120,wt:true,cue:'One hand. Walk tall. Resist ALL lateral lean. Switch at 75m. Start: 10 kg. Add 2 kg every 2 weeks.',yt:'suitcase carry tutorial',feel:'Anti-lean tension through your obliques on the loaded side. Traps working isometrically. If you are tilting: reduce weight.'},
{id:'plate-pinch',n:'Plate Pinch',v:'2 \u00d7 30s per hand (no rest between hands)',t:'r',s:2,rpp:1,rest:60,wt:true,cue:'Pinch a weight plate (5\u201310kg) between thumb and all four fingers by the SMOOTH face \u2014 not the rim. Walk slowly or stand. Switch hands after 30s. No plate: grip a rolled gym towel loaded with weight. This trains exactly the muscles that failed before your back did.',yt:'plate pinch grip strength workout',feel:'Burning through all four fingers and the thumb pad by 15 seconds. Genuinely difficult to hold at 25\u201330s. If you make it to 30s easily: heavier plate next time.'}
]},
{id:'MOB',n:'MOBILITY CLOSE',col:'#4A9EDB',exs:[
{id:'hip-fl',n:'Hip Flexor Stretch',v:'2 \u00d7 60s/side',t:'time',s:2,rest:0,wt:false,cue:'Kneeling lunge. Posterior pelvic tilt. Lean forward. Running shortens hip flexors.',yt:'kneeling hip flexor stretch',feel:'A deep pull in the front of the hip and upper thigh. Not pain \u2014 sustained tension. Breathe into it.'},
{id:'foam-t',n:'Thoracic Foam Roll',v:'2 min',t:'time',s:1,rest:0,wt:false,cue:'Mid-back to shoulder blades only. 3 breaths at each tight spot.',yt:'thoracic foam rolling technique',feel:'Gentle release through the upper back. Should feel like relief, not pain.'}
]},
{id:'MFS',n:'MENTAL FORESIGHT',col:'#9B8DE8',exs:[
{id:'journal-b',n:'Post-Session Journal',v:'3 questions in Journal tab',t:'time',s:1,rest:0,wt:false,cue:'Open Journal tab. 3 questions. 5 minutes. How did I feel? What surprised me? What will I change?',yt:null,feel:'Clarity. The act of writing makes patterns visible.'}
]}
]},
C:{id:'C',name:'EXPLOSIVE POWER',icon:'&#9889;',col:'#E35050',hero:'hero-C',dur:'~45 min',after:'breathing',
blocks:[
{id:'WU',n:'WARM-UP',col:'#4A9EDB',exs:[
{id:'hip-sw',n:'Dynamic Hip Swings',v:'2 \u00d7 10/side',t:'r',s:2,rpp:10,rest:0,wt:false,cue:'Forward/back AND lateral. Full range. Wakes up hip joint before explosive loading.',yt:'hip swing warm up',feel:'Hip joint loosening. Fluid circular motion. No sharp sensations.'},
{id:'gb-act',n:'Glute Bridge Activation',v:'2 \u00d7 15',t:'r',s:2,rpp:15,rest:0,wt:false,cue:'Squeeze glutes at top. 2s hold. Activates posterior chain before sprinting.',yt:'glute bridge activation',feel:'Glute contraction at the top. If you feel your lower back: squeeze harder through the heel.'},
{id:'a-march',n:'A-March',v:'2 \u00d7 20m',t:'r',s:2,rpp:1,rest:0,wt:false,cue:'Exaggerated marching. Knee to hip height. Arms pump opposite. Teaches sprint mechanics.',yt:'A march sprint drill',feel:'Hip flexor driving the knee up. Arms counterbalancing. Coordination building.'}
]},
{id:'JUMP',n:'COMPLEX PAIRS \u2014 JUMP',col:'#E35050',exs:[
{id:'box-step',n:'Box Step-up',v:'3 \u00d7 6/side',t:'r',s:3,rpp:6,rest:30,wt:false,cue:'COMPLEX PRIMER: Take ONLY 30 seconds rest after this set, then go immediately to Broad Jumps. The post-activation potentiation (PAP) window is 30\u201360 seconds \u2014 longer and the effect is lost. Full control up, drive knee to 90\u00b0, slow eccentric. The hip extensors fire hard here \u2014 that\'s the neural prime.',yt:'box step up complex training PAP',feel:'Front thigh and glute working together. The stepping leg does all the work.'},
{id:'broad-j',n:'Broad Jump',v:'3 \u00d7 3',t:'r',s:3,rpp:3,rest:240,wt:false,cue:'COMPLEX POWER: Execute within 30 seconds of the Box Step-up set \u2014 your hip extensors are post-activated. Full arm swing, aggressive hip hinge, explode. Land soft, knees bent absorbing. After jumping: 4 FULL minutes before the next complex (CNS needs full recovery to express the same power again). If you don\'t feel more explosive than usual: rest after step-up was too long.',yt:'broad jump PAP complex training',feel:'Explosive hip extension \u2014 glutes and thighs firing simultaneously. Land soft \u2014 if you land stiff, too much effort and not enough hip.'}
]},
{id:'SPRINT',n:'SPRINT MECHANICS',col:'#E8A02A',exs:[
{id:'a-skip',n:'A-Skip',v:'4 \u00d7 20m',t:'r',s:4,rpp:1,rest:90,wt:false,cue:'Rhythmic skip with exaggerated knee drive. Arm drives opposite. Master this before worrying about speed.',yt:'A skip sprint drill',feel:'Rhythmic hip flexor pull on each knee drive. Calves helping on the push-off. Stay light.'},
{id:'accel',n:'Acceleration Run \u2014 40m',v:'4 \u00d7 40m @ 70\u201380%',t:'r',s:4,rpp:1,rest:240,wt:false,cue:'Gradual acceleration over 40m. 70\u201380% effort. FOUR FULL MINUTES between sets. Nervous system work \u2014 not cardio.',yt:'acceleration run mechanics',feel:'Hip drive and front knee lift. Controlled, not maximal. If your shins hurt: slow down and fix mechanics first.'}
]},
{id:'BOX',n:'BOXING POWER',col:'#9B8DE8',exs:[
{id:'shadow',n:'Shadow Boxing',v:'3 \u00d7 2 min',t:'time',s:3,rest:60,wt:false,cue:'Jab-cross-hook. Hip rotation drives the punch \u2014 not arm strength. Stay light on feet.',yt:'shadow boxing beginners hip rotation',feel:'Hip rotation initiating each cross \u2014 obliques twisting, not just arms swinging. Stay loose.'}
]},
{id:'MF',n:'MENTAL FORTITUDE',col:'#4A9EDB',exs:[
{id:'dead-hang-c',n:'Dead Hang (grip finisher \u2014 fatigued)',v:'3 \u00d7 max hold',t:'r',s:3,rpp:0,rest:90,wt:false,cue:'Dead hang AFTER the explosive session. Your grip is already taxed from the sprints and carries \u2014 this is deliberate. Training grip under CNS and neuromuscular fatigue builds endurance that controlled fresh-grip training cannot. Also decompresses the spine after impact work.',yt:'dead hang grip training',feel:'Grip fatigue arrives faster than in Session A because of accumulated session fatigue. This is the point. Push to the same threshold: fingers opening = set done.'},
{id:'cold-s',n:'Cold Shower / CO2 Protocol',v:'Log completion',t:'time',s:1,rest:0,wt:false,cue:'Cold shower: 30s cold after normal shower. Build to 90s. OR: CO2 table \u00d7 5 rounds. Tap for breathing timer.',yt:'cold shower protocol',feel:'Cold shock: gasp, then settle. Consciously slow your breathing. After 10 seconds the shock fades. Nervous system learning.'}
]}
]},
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
