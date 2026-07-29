// Iron Protocol - plan.js
// THE PLAN OWNS THE SCHEDULE. The athlete does not choose what to train.
// Every day is prescribed: a training session, or Active Recovery. The training
// order advances only on completion, and rest between sessions is enforced.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var TRAIN_SEQ=['A','B','C','D'];
var MIN_REST_DAYS=1;   // clear days required between training sessions
var MAX_PER_WEEK=4;    // training missions per rolling 7 days

function isTraining(type){return TRAIN_SEQ.indexOf(type)>=0;}

// Dates of completed TRAINING sessions, oldest first
function trainingDates(){
  var out=[];
  Object.keys(S.sessions||{}).forEach(function(k){
    var s=S.sessions[k];
    if(!s||!isTraining(s.type))return;
    if(sessResolved(k).pct<100)return;
    out.push(s.date||k.split('|')[0]);
  });
  return out.sort();
}
function completedTraining(){return trainingDates().length;}

function daysBetween(a,b){
  return Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/86400000);
}
function lastTrainingDate(){
  var d=trainingDates();
  return d.length?d[d.length-1]:null;
}
function daysSinceTraining(){
  var l=lastTrainingDate();
  return l===null?999:daysBetween(l,today());
}
function trainingLast7(){
  var t=today();
  return trainingDates().filter(function(d){return daysBetween(d,t)<7;}).length;
}

// The next training session the plan owes you, regardless of calendar
function prescribedType(){return TRAIN_SEQ[completedTraining()%TRAIN_SEQ.length];}

// What today is. There is always exactly one answer.
function planToday(){
  var gap=daysSinceTraining();
  var type=prescribedType();
  if(gap===0){
    return {mode:'done',type:'REST',next:type,
            title:'Mission accomplished',
            reason:'Today\'s mission is executed. Recovery ops are optional and light.'};
  }
  if(gap<=MIN_REST_DAYS&&type!=='B'){
    return {mode:'recover',type:'REST',next:type,unlocks:1-gap+1,
            title:'Stand down',
            reason:'Adaptation happens between missions, not during them. '+
                   SESSIONS[type].name+' is authorised tomorrow.'};
  }
  if(trainingLast7()>=MAX_PER_WEEK){
    return {mode:'recover',type:'REST',next:type,
            title:'Operational tempo reached',
            reason:MAX_PER_WEEK+' missions in the last 7 days. Recovery ops are the task today.'};
  }
  return {mode:'train',type:type,next:null,
          title:'Mission authorised',
          reason:''};
}

// Kept in sync so notifications, RPE audit and AI prompts agree with the plan
function syncPlan(){
  var p=planToday();
  var want=p.mode==='train'?p.type:(p.next||p.type);
  if(S.next!==want){S.next=want;saveS();}
  return p;
}

// Sequence strip state: what came before, what is now, what is next
function planStrip(){
  var done=completedTraining();
  var p=planToday();
  return TRAIN_SEQ.map(function(t,i){
    var pos=done%TRAIN_SEQ.length;
    var state=i<pos?'done':(i===pos?(p.mode==='train'?'now':'queued'):'locked');
    return {type:t,state:state,name:SESSIONS[t].name,col:SESSIONS[t].col};
  });
}

// --- EXERCISE ORDER ----------------------------------------------------------
// The frontier is the first card not yet completed. Nothing past it is reachable.
function fcFrontier(){
  if(!FC_CARDS||!FC_CARDS.length)return 0;
  var sess=S.sessions[sessKey(curSessDate,curSessType)]||{exercises:{}};
  for(var i=0;i<FC_CARDS.length;i++){
    var c=FC_CARDS[i];
    var ed=sess.exercises[c.exId];
    if(ed&&ed.skipped)continue;                       // skipped: pass through
    if(c.ex.t==='time'){ if(!ed||!ed.comp)return i; continue; }
    var st=ed&&ed.sets?ed.sets[c.si]:null;            // timed objectives never
    if(!st||!st.done)return i;                        // create sets - that used
  }                                                   // to lock the whole run
  return FC_CARDS.length-1;
}
function cardLocked(i){return i>fcFrontier();}
