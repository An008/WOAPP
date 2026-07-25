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
var RS_INT=null, RS_TOTAL=60, RS_LEFT=60, RS_CB=null;
var _brInt=null;
var AS_IDX=0, AS_RES={};

function today(){return new Date().toISOString().split('T')[0];}
function fmtDate(s){var d=new Date(s+'T12:00:00');return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});}
function getPhase(){var w=Math.floor((new Date()-new Date(S.profile.start))/604800000);return w<8?0:w<20?1:w<36?2:3;}
function getPhaseWk(){var w=Math.floor((new Date()-new Date(S.profile.start))/604800000),ph=getPhase(),off=0;for(var i=0;i<ph;i++)off+=PHASES[i].weeks;return Math.max(1,w-off+1);}
function isDeloadWeek(){return S&&S.profile&&S.profile.start&&(getPhaseWk()%4===0);}
function totalSess(){return Object.keys(S.sessions).filter(function(d){return sessComp(d).pct>0;}).length;}
function sessComp(date){
  var sess=S.sessions[date];if(!sess)return{pct:0,done:0,total:0};
  var sd=SESSIONS[sess.type];if(!sd)return{pct:0,done:0,total:0};
  var tot=0,dn=0;
  sd.blocks.forEach(function(b){b.exs.forEach(function(e){tot++;var ed=sess.exercises[e.id];if(ed&&ed.comp)dn++;});});
  return{pct:tot?Math.round(dn/tot*100):0,done:dn,total:tot};
}
function getOrCreate(date,type){if(!S.sessions[date])S.sessions[date]={type:type,exercises:{},started:new Date().toISOString()};return S.sessions[date];}
function defaultState(){return{profile:{name:'',start:today(),apiKey:'',height:164},next:'A',sessions:{},journal:{},landmarks:LM.map(function(l){return Object.assign({},l,{done:false});}),measurements:[]};}

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

function loadS(){var d=localStorage.getItem(SK+'-'+(CUR_USER?CUR_USER.name:''));S=d?JSON.parse(d):defaultState();syncLandmarks();if(!S.profile)S.profile={};if(!S.profile.apiKey)S.profile.apiKey=localStorage.getItem(AI_KEY_STORE)||'';if(CUR_USER&&!S.profile.name)S.profile.name=CUR_USER.name;if(!S.profile.start)S.profile.start=today();
  if(!S.profile.height)S.profile.height=164;
  if(!S.measurements)S.measurements=[];}
function saveS(){try{localStorage.setItem(SK+'-'+(CUR_USER?CUR_USER.name:''),JSON.stringify(S));}catch(e){}}

// ===========================================================
// LOGIN & GITHUB
// ===========================================================
function _gh_url(path){return 'https://api.github.com/repos/'+GH_REPO+'/contents/'+path;}
function _gh_raw(path){return 'https://raw.githubusercontent.com/'+GH_REPO+'/main/'+path;}
