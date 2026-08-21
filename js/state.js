// Iron Protocol - state.js
// Global state, persistence, phase/date maths, API key
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// ===========================================================
var SK='iron-v2';
// --- API KEY \u2014 persists independently of profile data ------------------------
var AI_KEY_STORE='iron-ai-key';
function getApiKey(){return localStorage.getItem(AI_KEY_STORE)||(S&&S.profile&&S.profile.apiKey)||'';}
function setApiKey(k){localStorage.setItem(AI_KEY_STORE,k);if(S&&S.profile){S.profile.apiKey=k;saveS();}}

var S=null;
var CUR_USER=null;
var curSessType='A', curSessDate='';
var FC_CARDS=[], FC_IDX=0, FC_MSG=0;
var RS_INT=null, RS_TOTAL=60, RS_LEFT=60, RS_CB=null, RS_END=0;
var _brInt=null;
var AS_IDX=0, AS_RES={};

function today(){return new Date().toISOString().split('T')[0];}
function fmtDate(s){var d=new Date(s+'T12:00:00');return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});}
// --- PROGRAMME PROGRESSION ---------------------------------------------------
// Progression is EARNED, not elapsed. The programme week is the lesser of the
// calendar week and the week your completed missions have paid for, so:
//   - it cannot run ahead of you during a hiatus
//   - it cannot be rushed faster than the body adapts
// A detraining hiatus walks the earned week backwards, so returning after a
// long break puts you at a difficulty you can actually meet.
var MISSIONS_PER_WEEK=4;

function calendarWeeks(){
  if(!S||!S.profile||!S.profile.start)return 0;
  return Math.max(0,Math.floor((new Date()-new Date(S.profile.start))/604800000));
}
function earnedWeeks(){
  var done=(typeof completedSessions==='function')?completedSessions():0;
  return done/MISSIONS_PER_WEEK;
}
function programmeWeeks(){
  var e=earnedWeeks();
  var d=(typeof meritDecay==='function')?meritDecay():{pct:0,active:false};
  if(d.active)e=e*(1-(d.pct||0));      // detraining regresses the programme
  return Math.max(0,Math.min(calendarWeeks(),Math.floor(e)));
}
function getPhase(){var w=programmeWeeks();return w<8?0:w<20?1:w<36?2:3;}
function getPhaseWk(){
  var w=programmeWeeks(),ph=getPhase(),off=0;
  for(var i=0;i<ph;i++)off+=PHASES[i].weeks;
  return Math.max(1,w-off+1);
}
// Deload only makes sense once there is real accumulated work to unload from
function isDeloadWeek(){
  if(!S||!S.profile||!S.profile.start)return false;
  if(completedSessions()<MISSIONS_PER_WEEK*3)return false;
  return getPhaseWk()%4===0;
}
// True when the calendar has run ahead of the work actually done
function progressionStalled(){
  return calendarWeeks()>programmeWeeks()+1;
}
// --- SESSION KEYS -------------------------------------------------------------
// Sessions are keyed "YYYY-MM-DD|TYPE" so every session type stays reachable on
// any day. Keying by date alone locked the type once a record existed, which is
// why only Session A was ever offered and the Setup override did nothing.
function sessKey(date,type){return date+'|'+type;}

function migrateSessions(){
  var out={};
  Object.keys(S.sessions||{}).forEach(function(k){
    var s=S.sessions[k];
    if(!s||typeof s!=='object')return;
    if(k.indexOf('|')>-1){out[k]=s;return;}
    var t=s.type||'A';
    s.date=s.date||k;
    out[sessKey(k,t)]=s;
  });
  S.sessions=out;
}

function sessComp(key){
  var sess=S.sessions[key];if(!sess)return{pct:0,done:0,total:0};
  var sd=SESSIONS[sess.type];if(!sd)return{pct:0,done:0,total:0};
  var tot=0,dn=0;
  sd.blocks.forEach(function(b){b.exs.forEach(function(e){tot++;var ed=sess.exercises[e.id];if(ed&&ed.comp)dn++;});});
  return{pct:tot?Math.round(dn/tot*100):0,done:dn,total:tot};
}
function compFor(date,type){return sessComp(sessKey(date,type));}

// Resolved = completed OR deliberately skipped. Drives whether a mission can
// finish and whether the plan advances. Merit and volume still use sessComp,
// so skipping costs you credit rather than silently counting as work.
function sessResolved(key){
  var sess=S.sessions[key];if(!sess)return{pct:0,done:0,skipped:0,total:0};
  var sd=SESSIONS[sess.type];if(!sd)return{pct:0,done:0,skipped:0,total:0};
  var tot=0,dn=0,sk=0;
  sd.blocks.forEach(function(b){b.exs.forEach(function(e){
    tot++;var ed=sess.exercises[e.id];
    if(ed&&ed.comp)dn++;else if(ed&&ed.skipped)sk++;
  });});
  return{pct:tot?Math.round((dn+sk)/tot*100):0,done:dn,skipped:sk,total:tot};
}
function resolvedFor(date,type){return sessResolved(sessKey(date,type));}

function completedSessions(){
  return Object.keys(S.sessions).filter(function(k){return sessResolved(k).pct>=100;}).length;
}
// Missions finished with no skipped objectives - used for merit
function cleanSessions(){
  return Object.keys(S.sessions).filter(function(k){return sessComp(k).pct>=100;}).length;
}
function startedSessions(){
  return Object.keys(S.sessions).filter(function(k){return sessComp(k).pct>0;}).length;
}
function totalSess(){return startedSessions();}

// Total training sessions between day one and the goal (3 per week, all phases)
function totalPlannedSessions(){
  var w=0;PHASES.forEach(function(p){w+=p.weeks;});return w*4;
}
function goalPct(){
  var t=totalPlannedSessions();
  if(!t)return 0;
  // Progress toward the goal is a READINESS measure and erodes with inactivity.
  // Missions Run is the historical record and never changes.
  var d=(typeof meritDecay==='function')?meritDecay():{pct:0};
  return Math.min(100,Math.round(completedSessions()/t*(1-(d.pct||0))*1000)/10);
}
function goalPctRaw(){
  var t=totalPlannedSessions();
  return t?Math.min(100,Math.round(completedSessions()/t*1000)/10):0;
}
function isPhaseEnd(){return getPhaseWk()>=PHASES[getPhase()].weeks;}

function getOrCreate(date,type){
  var k=sessKey(date,type);
  if(!S.sessions[k])S.sessions[k]={type:type,date:date,exercises:{},started:new Date().toISOString()};
  return S.sessions[k];
}
function defaultState(){return{profile:{name:'',start:today(),apiKey:'',height:164,age:40},next:'A',sessions:{},journal:{},landmarks:LM.map(function(l){return Object.assign({},l,{done:false});}),measurements:[]};}

// --- LANDMARK SYNC ------------------------------------------------------------
// PERMANENT ENCODING FIX: display text (i/g/p) is NEVER trusted from storage.
// Saved profiles from older builds contain mojibake (e.g. "15kg A- 1km") because
// the text was persisted before the source was made ASCII-safe. We persist ONLY
// state (done, achievedDate) and always rebuild the labels from the LM
// definitions, so corrupted strings cannot survive a single load.
function syncLandmarks(){
  var saved={};
  (S.landmarks||[]).forEach(function(l){
    if(l&&l.id)saved[l.id]={done:!!l.done,achievedDate:l.achievedDate||null};
  });
  S.landmarks=LM.map(function(def){
    var st=saved[def.id]||{};
    return {id:def.id,i:def.i,g:def.g,p:def.p,
            done:!!st.done,achievedDate:st.achievedDate||null};
  });
}

function loadS(){var d=localStorage.getItem(SK+'-'+(CUR_USER?CUR_USER.name:''));S=d?JSON.parse(d):defaultState();if(!S.sessions)S.sessions={};migrateSessions();syncLandmarks();if(!S.profile)S.profile={};if(!S.profile.apiKey)S.profile.apiKey=localStorage.getItem(AI_KEY_STORE)||'';if(CUR_USER&&!S.profile.name)S.profile.name=CUR_USER.name;if(!S.profile.start)S.profile.start=today();
  if(!S.profile.height)S.profile.height=164;
  if(!S.profile.age)S.profile.age=40;
  if(!S.measurements)S.measurements=[];}
function saveS(){try{localStorage.setItem(SK+'-'+(CUR_USER?CUR_USER.name:''),JSON.stringify(S));}catch(e){}}

// ===========================================================
// LOGIN & GITHUB
// ===========================================================
function _gh_url(path){return 'https://api.github.com/repos/'+GH_REPO+'/contents/'+path;}
function _gh_raw(path){return 'https://raw.githubusercontent.com/'+GH_REPO+'/main/'+path;}
