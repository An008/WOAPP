// Iron Protocol - ui-session.js
// Flash cards, rest timer, muscle maps, session flow
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// ===========================================================
function beginSession(){
  var td=today();
  curSessDate=td;
  curSessType=S.sessions[td]?S.sessions[td].type:S.next;
  getOrCreate(td,curSessType);saveS();
  var sd=SESSIONS[curSessType];
  document.getElementById('ov-ttl').textContent=sd.name;
  document.getElementById('ov-sub').textContent=sd.dur;
  var comp=sessComp(td);
  var html=comp.pct>0?'<div style="padding:10px 18px;display:flex;align-items:center;gap:10px;background:var(--bg3);border-bottom:1px solid var(--border)"><div class="h-bar"><div class="h-fill" style="width:'+comp.pct+'%;background:'+sd.col+'"></div></div><div style="font-size:13px;font-weight:800;color:'+sd.col+'">'+comp.pct+'%</div></div>':'';
  var sess=S.sessions[td];
  sd.blocks.forEach(function(blk){
    html+='<div class="blk-hdr"><div class="blk-n" style="color:'+blk.col+'">'+blk.n+'</div></div>';
    blk.exs.forEach(function(ex){
      var ed=sess.exercises[ex.id]||{};
      var isDone=ed.comp;
      var isPart=!isDone&&ed.sets&&ed.sets.some(function(s){return s.done;});
      var rowStyle=isDone?' style="border-left:3px solid var(--green);background:rgba(61,184,122,.03)"':isPart?' style="border-left:3px solid var(--amber);background:rgba(232,160,42,.03)"':'';
      html+='<div class="ex-row"'+rowStyle+' onclick="fcJumpTo(\''+blk.id+'\',\''+ex.id+'\')">'
        +'<div class="ex-st '+(isDone?'done':isPart?'part':'')+'">'+( isDone?'&#10003;':isPart?'&#9705;':'')+'</div>'
        +'<div><div class="ex-n">'+ex.n+'</div><div class="ex-v">'+(ex.t==='time'?ex.v:ex.s+' \xd7 '+(ex.rpp?ex.rpp+' reps':'Max'))+'</div></div>'
        +'<div style="font-size:18px;color:var(--txt3)">&#8250;</div></div>';
    });
  });
  document.getElementById('ov-body').innerHTML=html;
  openOv('v-overview');
}

// ===========================================================
// FLASH CARDS
// ===========================================================
function buildCards(){
  var sd=SESSIONS[curSessType],cards=[];
  var DL=isDeloadWeek();
  var WB=['B1','B2','B3','JUMP','SPRINT','BOX','CARRY','RUN'];
  sd.blocks.forEach(function(blk){
    blk.exs.forEach(function(ex){
      var fs=ex.t==='time'?1:ex.s;
      var ns=DL&&WB.indexOf(blk.id)>=0?Math.max(1,fs-1):fs;
      for(var i=0;i<ns;i++)cards.push({blkId:blk.id,blkName:blk.n,blkCol:blk.col,exId:ex.id,ex:ex,si:i,totalSets:ns,dl:DL&&WB.indexOf(blk.id)>=0});
    });
  });
  return cards;
}

function startFC(){
  closeOv('v-overview');
  FC_CARDS=buildCards();
  // find first incomplete
  var sess=S.sessions[curSessDate]||{exercises:{}};
  FC_IDX=0;
  for(var i=0;i<FC_CARDS.length;i++){
    var c=FC_CARDS[i],ed=sess.exercises[c.exId]||{};
    if(c.ex.t==='time'){if(!ed.comp){FC_IDX=i;break;}}
    else{var sd2=ed.sets&&ed.sets[c.si];if(!sd2||!sd2.done){FC_IDX=i;break;}}
    if(i===FC_CARDS.length-1)FC_IDX=i;
  }
  document.getElementById('fc-ttl').textContent=SESSIONS[curSessType].name;
  openOv('v-flashcard');
  renderFC();
}

function fcJumpTo(blkId,exId){
  closeOv('v-overview');
  FC_CARDS=buildCards();
  var idx=FC_CARDS.findIndex(function(c){return c.blkId===blkId&&c.exId===exId;});
  FC_IDX=idx>=0?idx:0;
  document.getElementById('fc-ttl').textContent=SESSIONS[curSessType].name;
  openOv('v-flashcard');
  renderFC();
}

function renderFC(){
  if(FC_IDX>=FC_CARDS.length){showComplete();return;}
  var card=FC_CARDS[FC_IDX],ex=card.ex;
  var sess=getOrCreate(curSessDate,curSessType);
  if(!sess.exercises[ex.id])sess.exercises[ex.id]={sets:[],comp:false};
  var ed=sess.exercises[ex.id];
  var isTimed=ex.t==='time';
  var isDone=isTimed?ed.comp:(ed.sets&&ed.sets[card.si]&&ed.sets[card.si].done)||false;
  var setData=(ed.sets&&ed.sets[card.si])||{done:false,wt:null,rp:null,rpe:null};
  var pct=Math.round(FC_IDX/FC_CARDS.length*100);
  document.getElementById('fc-pf').style.width=pct+'%';
  document.getElementById('fc-pct').textContent=pct+'%';
  document.getElementById('fc-pos').textContent='Card '+(FC_IDX+1)+' of '+FC_CARDS.length;
  document.getElementById('fc-hdr-r').textContent=card.blkName;
  var prevEx=FC_IDX>0?FC_CARDS[FC_IDX-1].ex:null;
  var nextEx=FC_IDX<FC_CARDS.length-1?FC_CARDS[FC_IDX+1].ex:null;
  var rpiHtml='';
  var rpi=getRPEInd(ex.id);
  if(rpi)rpiHtml='<div style="background:'+rpi.bg+';border:1px solid '+rpi.c+'44;border-radius:8px;padding:10px 12px;margin-bottom:10px"><div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:'+rpi.c+';margin-bottom:3px">LOAD GUIDANCE</div><div style="font-size:15px;font-weight:800;color:var(--white)">'+rpi.icon+' '+rpi.label+'</div><div style="font-size:12px;color:'+rpi.c+';margin-top:3px">'+rpi.detail+'</div>'+(rpi.suggestion?'<div style="font-size:13px;font-weight:700;color:'+rpi.c+';margin-top:4px">&#8594; '+rpi.suggestion+'</div>':'')+'</div>';
  var alHtml='';
  var al=S.profile&&S.profile.assessmentLoads&&S.profile.assessmentLoads[ex.id];
  if(al){var alLoad=al.weight?al.weight+' kg':al.bandLevel?al.bandLevel+' band':al.duration?al.duration+' min':'bodyweight';alHtml='<div style="background:rgba(155,141,232,.1);border:1px solid rgba(155,141,232,.3);border-radius:8px;padding:10px 12px;margin-bottom:10px"><div style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--purple);margin-bottom:3px">&#128202; AI CALIBRATED TARGET</div><div style="font-size:16px;font-weight:800;color:var(--white)">'+alLoad+(al.sets?' \xb7 '+al.sets+' \xd7 '+(al.reps||ex.rpp||'max')+' reps':'')+'</div>'+(al.note?'<div style="font-size:12px;color:var(--txt2);margin-top:3px">'+al.note+'</div>':'')+'</div>';}
  var mmHtml=buildMuscleThumb(ex.id);
  var ytHtml=ex.yt?'<a class="fc-yt" href="https://www.youtube.com/results?search_query='+encodeURIComponent(ex.yt)+'" target="_blank" rel="noopener">&#9654; Watch on YouTube</a>':'';
  var feelHtml=FEEL[ex.id]?'<div class="fc-feel"><strong>What you should feel</strong>'+FEEL[ex.id]+'</div>':'';
  var msg=MSGS[FC_MSG%MSGS.length];
  var inputsHtml='';
  if(!isTimed){
    var rpeB=[1,2,3,4,5,6,7,8,9,10].map(function(v){return '<div class="rpe-b '+(setData.rpe===v?'on':'')+'" data-v="'+v+'" onclick="fcRpe('+v+')">'+v+'</div>';}).join('');
    var prefill=(setData.wt!=null?setData.wt:(al&&al.weight?al.weight:''));
    inputsHtml='<div class="fc-inp-box"><div style="display:flex;gap:10px;align-items:flex-end;margin-bottom:10px">'
      +(ex.wt?'<div class="fc-ig"><div class="fc-il">Weight (kg)</div><input class="fc-if" type="number" inputmode="decimal" id="fc-wt" placeholder="'+(al&&al.weight?al.weight+' kg (AI rec)':'BW')+'" value="'+prefill+'" oninput="fcWt(this.value)"></div>':'<div class="fc-ig"><div class="fc-il">Reps done'+(ex.rpp?' / '+ex.rpp:'')+'</div><input class="fc-if" type="number" inputmode="numeric" id="fc-rp" placeholder="'+(ex.rpp||'Max')+'" value="'+(setData.rp!=null?setData.rp:'')+'" oninput="fcRp(this.value)"></div>')
      +'</div><div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3);margin-bottom:5px">Effort (RPE)</div>'
      +'<div class="rpe-g" id="fc-rpe">'+rpeB+'</div></div>';
  }
  var html='<div class="fc-blk" style="color:'+card.blkCol+'">'+card.blkName+'</div>'
    +'<div class="fc-name">'+ex.n+'</div>'
    +(card.dl?'<div style="display:inline-block;padding:2px 8px;background:rgba(74,158,219,.15);border:1px solid rgba(74,158,219,.3);border-radius:4px;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);margin-bottom:6px">DELOAD WEEK \u2014 same weight, 1 fewer set</div>':'')
  +'<div class="fc-set">'+(isTimed?ex.v:'Set '+(card.si+1)+' of '+card.totalSets+' \xb7 '+(ex.rpp?ex.rpp+' reps':'Max')+(ex.rest>0?' \xb7 '+ex.rest+'s rest':''))+'</div>'
    +alHtml+rpiHtml
    +mmHtml
    +(ytHtml?ytHtml+'<br>':'')
    +'<div class="fc-cue">'+ex.cue+'</div>'
    +feelHtml
    +inputsHtml
    +'<div class="fc-msg">'+msg+'</div>'
    +'<div class="fc-np">'
    +(prevEx?'<div class="fc-np-item"><div class="fc-np-l">&#8592; Prev</div><div class="fc-np-n">'+prevEx.n+'</div></div>':'<div class="fc-np-item" style="opacity:.3"><div class="fc-np-l">Start</div><div class="fc-np-n">Beginning</div></div>')
    +(nextEx?'<div class="fc-np-item"><div class="fc-np-l">Next &#8594;</div><div class="fc-np-n">'+nextEx.n+'</div></div>':'<div class="fc-np-item" style="opacity:.3"><div class="fc-np-l">Next</div><div class="fc-np-n">Session done</div></div>')
    +'</div>';
  document.getElementById('fc-body').innerHTML=html;
  document.getElementById('fc-body').scrollTop=0;
  var btn=document.getElementById('fc-done-btn');
  btn.textContent=isDone?'&#10003; Done \u2014 Next Exercise':'&#10003; Done \u2014 Log '+(isTimed?'Activity':'Set '+(card.si+1));
  btn.style.background=isDone?'rgba(61,184,122,.25)':'var(--green)';
  btn.style.border=isDone?'1px solid rgba(61,184,122,.4)':'none';
}

function fcWt(v){var c=FC_CARDS[FC_IDX];ensureSet(c.exId,c.si).wt=v?parseFloat(v):null;saveS();}
function fcRp(v){var c=FC_CARDS[FC_IDX];ensureSet(c.exId,c.si).rp=v?parseInt(v):null;saveS();}
function fcRpe(v){
  var c=FC_CARDS[FC_IDX];ensureSet(c.exId,c.si).rpe=v;saveS();
  var g=document.getElementById('fc-rpe');
  if(g)g.querySelectorAll('.rpe-b').forEach(function(b){b.classList.toggle('on',parseInt(b.dataset.v)===v);});
}
function ensureSet(exId,si){
  var sess=getOrCreate(curSessDate,curSessType);
  if(!sess.exercises[exId])sess.exercises[exId]={sets:[],comp:false};
  while(sess.exercises[exId].sets.length<=si)sess.exercises[exId].sets.push({done:false,wt:null,rp:null,rpe:null});
  return sess.exercises[exId].sets[si];
}
function fcDone(){
  var card=FC_CARDS[FC_IDX],ex=card.ex,isTimed=ex.t==='time';
  var sess=getOrCreate(curSessDate,curSessType);
  if(!sess.exercises[ex.id])sess.exercises[ex.id]={sets:[],comp:false};
  var ed=sess.exercises[ex.id];
  if(isTimed){ed.comp=!ed.comp;}
  else{
    ensureSet(ex.id,card.si);
    ed.sets[card.si].done=!ed.sets[card.si].done;
    if(ed.sets.slice(0,ex.s).every(function(s){return s.done;}))ed.comp=true;
  }
  saveS();FC_MSG++;
  var nowDone=isTimed?ed.comp:(ed.sets&&ed.sets[card.si]&&ed.sets[card.si].done);
  if(nowDone){
    if(FC_IDX<FC_CARDS.length-1){
      var rest=ex.rest||0;
      if(rest>0){showRest(rest,ex.n,(FC_CARDS[FC_IDX+1].ex.n),function(){FC_IDX++;renderFC();});}
      else{FC_IDX++;renderFC();}
    } else {
      var o=['A','B','C'];S.next=o[(o.indexOf(curSessType)+1)%3];saveS();
      autoSyncToGH();
      showComplete();
    }
  } else {renderFC();}
}
function confirmExit(){if(confirm('Exit session? Your logged sets are saved.'))closeOv('v-flashcard');}
function showComplete(){
  var sd=SESSIONS[curSessType];
  document.getElementById('fc-done-wrap').style.display='none';
  document.getElementById('fc-pf').style.width='100%';
  document.getElementById('fc-pct').textContent='100%';
  document.getElementById('fc-body').innerHTML='<div class="sc-screen">'
    +'<div style="font-size:60px;margin-bottom:14px">&#127942;</div>'
    +'<div style="font-size:22px;font-weight:900;color:var(--white);margin-bottom:6px">Session Complete!</div>'
    +'<div style="font-size:14px;color:var(--txt2);margin-bottom:28px">'+sd.name+' done</div>'
    +'<div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:300px">'
    +(sd.after==='breathing'?'<button class="btn" style="background:rgba(74,158,219,.15);border:1px solid rgba(74,158,219,.25)" onclick="openBreath()">&#127756; Breathing Protocol</button>':'')
    +(sd.after==='journal'?'<button class="btn" style="background:rgba(155,141,232,.15);border:1px solid rgba(155,141,232,.25)" onclick="openJournalEntry();closeOv(\'v-flashcard\')">&#128214; Session Journal</button>':'')
    +'<button class="btn" style="background:rgba(155,141,232,.12);border:1px solid rgba(155,141,232,.2);color:var(--purple)" onclick="analyzeSession()">&#129504; Analyse with AI Coach</button>'
    +'<button class="btn" style="background:transparent;border:1px solid var(--border);color:var(--txt2)" onclick="closeOv(\'v-flashcard\');showTab(\'today\')">&#8592; Back to Today</button>'
    +'</div><div id="ai-resp-fc" style="margin-top:16px;width:100%;max-width:360px;text-align:left"></div></div>';
}

// -- RPE Indicator -------------------------------------------------------------
function getRPEInd(exId){
  var dates=Object.keys(S.sessions).filter(function(d){return S.sessions[d].type===curSessType&&d!==curSessDate;}).sort().reverse().slice(0,2);
  if(!dates.length)return null;
  var rpes=[],lastWt=null;
  dates.forEach(function(d){var ed=S.sessions[d].exercises[exId];if(!ed||!ed.sets)return;ed.sets.forEach(function(s){if(s.done&&s.rpe)rpes.push(s.rpe);if(s.done&&s.wt!=null&&lastWt===null)lastWt=s.wt;});});
  if(!rpes.length)return null;
  var avg=rpes.reduce(function(a,b){return a+b;},0)/rpes.length;
  var d=Math.round(avg*10)/10;
  if(avg<=5.5){var nw=lastWt?Math.round(lastWt*1.1*2)/2:null;return{icon:'&#8679;',label:'Increase load',detail:'Avg RPE '+d+' \u2014 adapting',suggestion:nw?'Try '+nw+' kg':null,c:'var(--green)',bg:'rgba(61,184,122,.08)'};}
  if(avg<=8)return{icon:'=',label:'Hold load',detail:'Avg RPE '+d+' \u2014 consolidate',suggestion:lastWt?'Keep '+lastWt+' kg':null,c:'var(--amber)',bg:'rgba(232,160,42,.08)'};
  var rw=lastWt?Math.round(lastWt*.9*2)/2:null;
  return{icon:'&#8681;',label:'Reduce load',detail:'Avg RPE '+d+' \u2014 too heavy',suggestion:rw?'Try '+rw+' kg':null,c:'var(--red)',bg:'rgba(227,80,80,.08)'};
}

// -- Muscle Thumbnails ----------------------------------------------------------
var MM={
  'goblet':{f:['quads','glutes'],b:['glutes','hamstrings']},
  'pushup':{f:['chest','shoulders'],b:['triceps']},
  'scap-pu':{f:[],b:['lats','rhomboids']},
  'band-pa':{f:[],b:['rear_delt','rhomboids']},
  'db-row':{f:['biceps'],b:['lats','rhomboids']},
  'sl-hip':{f:[],b:['glutes','hamstrings']},
  'pike-pu':{f:['shoulders'],b:['triceps']},
  'dead-hang':{f:['forearms'],b:['lats']},
  'tib':{f:['tibialis'],b:[]},
  'heel-d':{f:[],b:['calves']},
  'box-step':{f:['quads'],b:['glutes']},
  'broad-j':{f:['quads'],b:['glutes','hamstrings']},
  'accel':{f:['quads','hip_flex'],b:['glutes','hamstrings']},
  'a-skip':{f:['hip_flex'],b:['calves']},
  'shadow':{f:['chest','shoulders'],b:['triceps']},
  'suitcase':{f:['abs'],b:['traps']},
  'z2':{f:['quads'],b:['glutes','calves']},
  'breath-mf':{f:['abs'],b:[]},
  'easy-w':{f:['quads'],b:['glutes','calves']},'rev-curl':{f:['forearms','biceps'],b:[]},'plate-pinch':{f:['forearms'],b:[]},'dead-hang-c':{f:['forearms'],b:['lats']},'grip-work':{f:['forearms'],b:[]}
};

// SVG region definitions [x,y,w,h] for front body (46w \u00d7 100h) and back (44w \u00d7 100h)
var FG={'shoulders':[5,19,36,9],'chest':[12,18,22,13],'abs':[14,31,18,18],'biceps':[2,25,7,16],'forearms':[1,41,6,13],'hip_flex':[14,49,18,8],'quads':[10,57,26,22],'tibialis':[11,79,6,14]};
var BG={'traps':[[9,16,26,12]],'rear_delt':[[2,20,9,8],[33,20,9,8]],'lats':[[4,25,12,20],[28,25,12,20]],'rhomboids':[[15,24,14,13]],'triceps':[[2,25,7,15],[35,25,7,15]],'glutes':[[9,55,10,11],[25,55,10,11]],'hamstrings':[[9,65,11,20],[24,65,11,20]],'calves':[[10,84,8,13],[26,84,8,13]]};

function buildMuscleThumb(exId){
  var mm=MM[exId];if(!mm)return '';
  var AM='#E8A02A', DM='rgba(255,255,255,.07)';
  var f='<svg width="40" height="87" viewBox="0 0 46 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="23" cy="7" rx="8" ry="7" fill="'+DM+'"/><rect x="19" y="14" width="8" height="5" rx="2" fill="'+DM+'"/>';
  Object.keys(FG).forEach(function(k){var r=FG[k];f+='<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" rx="3" fill="'+(mm.f.indexOf(k)>=0?AM:DM)+'"/>';});
  f+='</svg>';
  var b='<svg width="38" height="87" viewBox="0 0 44 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="22" cy="7" rx="8" ry="7" fill="'+DM+'"/><rect x="18" y="14" width="8" height="5" rx="2" fill="'+DM+'"/>';
  Object.keys(BG).forEach(function(k){var rects=BG[k];var c=(mm.b.indexOf(k)>=0?AM:DM);rects.forEach(function(r){b+='<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" rx="3" fill="'+c+'"/>';});});
  b+='</svg>';
  return '<div class="mm-thumb"><div style="display:flex;gap:2px">'+f+b+'</div><div class="mm-thumb-txt">MUSCLES<br>WORKED</div></div>';
}

// -- REST TIMER -----------------------------------------------------------------
function showRest(secs,doneEx,nextEx,cb){
  clearInterval(RS_INT);RS_TOTAL=RS_LEFT=secs;RS_CB=cb;
  document.getElementById('rs-t').textContent=secs+'s';
  document.getElementById('rs-ex').textContent='&#10003; '+doneEx+' \u2014 Next: '+nextEx;
  document.getElementById('rs-bf').style.width='100%';
  document.getElementById('rest-screen').classList.add('show');
  RS_INT=setInterval(function(){
    RS_LEFT--;
    if(RS_LEFT<=0){clearInterval(RS_INT);document.getElementById('rest-screen').classList.remove('show');if(navigator.vibrate)navigator.vibrate([200,100,200]);if(RS_CB)RS_CB();}
    else{document.getElementById('rs-t').textContent=RS_LEFT+'s';var p=RS_LEFT/RS_TOTAL*100;var f=document.getElementById('rs-bf');f.style.width=p+'%';f.style.background=RS_LEFT>10?'var(--green)':'var(--red)';}
  },1000);
}
function skipRest(){clearInterval(RS_INT);document.getElementById('rest-screen').classList.remove('show');if(RS_CB)RS_CB();RS_CB=null;}

// -- AI COACH -------------------------------------------------------------------
async function callAI(key,prompt,onOK,onErr){
  try{
    var res,data,txt;
    if(key.startsWith('gsk_')){
      res=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model:'llama-3.1-8b-instant',messages:[{role:'user',content:prompt}],max_tokens:500,temperature:0.4})});
      if(!res.ok){var e=await res.json();throw new Error((e.error&&e.error.message)||'Groq error '+res.status);}
      data=await res.json();txt=data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content;
    } else {
      res=await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key='+encodeURIComponent(key),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:500,temperature:0.4}})});
      if(!res.ok){var e2=await res.json();throw new Error((e2.error&&e2.error.message)||'Gemini error '+res.status);}
      data=await res.json();txt=data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts&&data.candidates[0].content.parts[0]&&data.candidates[0].content.parts[0].text;
    }
    onOK(txt||'No response received.');
  }catch(e){onErr(e.message);}
}
