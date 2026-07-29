// Iron Protocol - ui-assessment.js
// Assessment cards, JSON extraction, calibration
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// -- ASSESSMENT -----------------------------------------------------------------
function openAssessment(){AS_IDX=0;AS_RES={};renderAsCard();openOv('v-assessment');}
function renderAsCard(){
  var el=document.getElementById('as-body');
  if(AS_IDX>=ASSESS_EXES.length){renderAsComplete();return;}
  var ex=ASSESS_EXES[AS_IDX],r=AS_RES[ex.id]||{},pct=Math.round(AS_IDX/ASSESS_EXES.length*100);
  var rpeB=[1,2,3,4,5,6,7,8,9,10].map(function(v){return '<div class="rpe-b '+(r.rpe===v?'on':'')+'" data-v="'+v+'" onclick="asRpe('+v+')">'+v+'</div>';}).join('');
  el.innerHTML='<div style="padding:10px 18px;border-bottom:1px solid var(--border);background:var(--bg3)"><div class="pc-bar"><div class="pc-fill" style="width:'+pct+'%"></div></div><div style="display:flex;justify-content:space-between;margin-top:5px"><span style="font-size:11px;color:var(--purple);font-weight:800">'+pct+'%</span><span style="font-size:11px;color:var(--txt3)">'+(AS_IDX+1)+' of '+ASSESS_EXES.length+'</span></div></div>'
  +'<div style="padding:16px 18px;padding-bottom:100px">'
  +'<div style="font-size:26px;font-weight:900;color:var(--white);margin-bottom:5px">'+ex.n+'</div>'
  +'<div style="font-size:14px;color:var(--txt2);margin-bottom:12px">'+ex.v+'</div>'
  +(ex.yt?'<a class="fc-yt" href="https://www.youtube.com/results?search_query='+encodeURIComponent(ex.yt)+'" target="_blank" rel="noopener">&#9654; Watch</a><br>':'')
  +'<div class="fc-cue" style="margin-bottom:12px">'+ex.cue+'</div>'
  +'<div class="fc-inp-box">'
  +(ex.id!=='as-sq'?'<div class="fc-ig" style="margin-bottom:10px"><div class="fc-il">'+(ex.t==='time'?'Hold time (seconds)':'Reps achieved')+'</div><input class="fc-if" type="number" inputmode="numeric" id="as-val" value="'+(r.val||'')+'" oninput="asVal(this.value)"></div>':'')
  +'<div style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3);margin-bottom:5px">Effort (RPE)</div><div class="rpe-g">'+rpeB+'</div>'
  +'</div></div>'
  +'<div style="position:fixed;bottom:0;left:0;right:0;padding:14px 18px;background:var(--bg);border-top:1px solid var(--border)"><button class="fc-done" onclick="asNext()">&#10003; Logged \u2014 Next Test</button></div>';
}
function asVal(v){if(!AS_RES[ASSESS_EXES[AS_IDX].id])AS_RES[ASSESS_EXES[AS_IDX].id]={};AS_RES[ASSESS_EXES[AS_IDX].id].val=v?parseFloat(v):null;}
function asRpe(v){if(!AS_RES[ASSESS_EXES[AS_IDX].id])AS_RES[ASSESS_EXES[AS_IDX].id]={};AS_RES[ASSESS_EXES[AS_IDX].id].rpe=v;var g=document.querySelector('#as-body .rpe-g');if(g)g.querySelectorAll('.rpe-b').forEach(function(b){b.classList.toggle('on',parseInt(b.dataset.v)===v);});}
function asNext(){AS_IDX++;renderAsCard();}
function renderAsComplete(){
  var el=document.getElementById('as-body');
  el.innerHTML='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px 20px;text-align:center">'
    +'<div style="font-size:48px;margin-bottom:14px">&#128202;</div>'
    +'<div style="font-size:20px;font-weight:900;color:var(--white);margin-bottom:6px">Assessment Complete</div>'
    +'<div style="font-size:14px;color:var(--txt2);margin-bottom:24px;line-height:1.6">Tap below to get personalised starting loads from your AI Coach.</div>'
    +'<button class="btn btn-g" onclick="submitAssessment()" style="max-width:280px">&#129504; Submit to AI Coach</button>'
    +'<button class="btn" style="margin-top:10px;max-width:280px;background:transparent;border:1px solid var(--border);color:var(--txt2)" onclick="closeOv(\'v-assessment\')">Skip</button>'
    +'<div id="as-ai-resp" style="margin-top:16px;width:100%;max-width:360px;text-align:left"></div></div>';
}
// --- ASSESSMENT HELPERS ----------------------------------------------------
function addDays(dateStr,n){var d=new Date(dateStr+'T12:00:00');d.setDate(d.getDate()+n);return d.toISOString().split('T')[0];}
function daysUntil(dateStr){return Math.ceil((new Date(dateStr+'T12:00:00')-new Date())/86400000);}
function extractJSON(txt){
  if(!txt)return null;
  var trunc=txt.indexOf('[[TRUNCATED]]')>-1;
  txt=txt.replace('[[TRUNCATED]]','').replace(/```json\s*/g,'').replace(/```\s*/g,'');
  try{return JSON.parse(txt.trim());}catch(e){}
  var start=txt.indexOf('{');
  if(start===-1)return null;
  // Walk with string awareness - braces inside quoted values must not count
  var depth=0,inStr=false,esc=false;
  for(var i=start;i<txt.length;i++){
    var ch=txt[i];
    if(esc){esc=false;continue;}
    if(ch==='\\'){esc=true;continue;}
    if(ch==='"'){inStr=!inStr;continue;}
    if(inStr)continue;
    if(ch==='{')depth++;
    else if(ch==='}'){
      depth--;
      if(depth===0){try{return JSON.parse(txt.substring(start,i+1));}catch(e2){break;}}
    }
  }
  // Truncated mid-object: close what is still open and salvage the complete keys
  var frag=txt.substring(start);
  if(inStr)frag+='"';
  var d2=0,s2=false,e2b=false;
  for(var j=0;j<frag.length;j++){
    var c2=frag[j];
    if(e2b){e2b=false;continue;}
    if(c2==='\\'){e2b=true;continue;}
    if(c2==='"'){s2=!s2;continue;}
    if(s2)continue;
    if(c2==='{')d2++; else if(c2==='}')d2--;
  }
  frag=frag.replace(/,\s*$/,'');
  for(var k=0;k<d2;k++)frag+='}';
  try{return JSON.parse(frag);}catch(e3){}
  // Last resort: cut back to the final complete top-level entry
  var cut=frag.lastIndexOf('},');
  if(cut>0){
    var head=frag.substring(0,cut+1);
    var d3=0,s3=false,e3b=false;
    for(var m=0;m<head.length;m++){
      var c3=head[m];
      if(e3b){e3b=false;continue;}
      if(c3==='\\'){e3b=true;continue;}
      if(c3==='"'){s3=!s3;continue;}
      if(s3)continue;
      if(c3==='{')d3++; else if(c3==='}')d3--;
    }
    for(var n=0;n<d3;n++)head+='}';
    try{return JSON.parse(head);}catch(e4){}
  }
  return null;
}


function submitAssessment(){
  var key=getApiKey(),el=document.getElementById('as-ai-resp');
  if(!el)return;
  if(!key){el.innerHTML='<div style="padding:12px;background:rgba(227,80,80,.1);border-radius:10px;font-size:13px;color:var(--red)">No AI key. Add your Groq key in Setup.</div>';return;}
  el.innerHTML='<div style="padding:14px;text-align:center;color:var(--txt2);font-size:14px">Calibrating programme...</div>';
  var lines=ASSESS_EXES.map(function(ex){var r=AS_RES[ex.id]||{};return ex.n+': '+(r.val!=null?r.val+'s/reps':'not recorded')+(r.rpe?' RPE '+r.rpe:'');}).join('\n');
  var ph=getPhase(),phWk=getPhaseWk();
    var prompt='Elite coach calibrating Iron Protocol. 40yo male. Phase '+(ph+1)+' Week '+phWk+'.\nASSESSMENT:\n'+lines+'\n\nReturn ONLY raw JSON, nothing outside {}:\n{\"loads\":{\"goblet\":{\"weight\":N,\"sets\":N,\"reps\":N,\"note\":\"coaching cue\"},\"db-row\":{\"weight\":N,\"sets\":N,\"reps\":N,\"note\":\"coaching cue\"},\"suitcase\":{\"weight\":N,\"sets\":N,\"reps\":N,\"note\":\"coaching cue\"},\"band-pa\":{\"weight\":null,\"bandLevel\":\"light|medium|heavy\",\"sets\":N,\"reps\":N,\"note\":\"coaching cue\"},\"pushup\":{\"weight\":null,\"sets\":N,\"reps\":N,\"note\":\"coaching cue\"},\"z2\":{\"weight\":null,\"sets\":1,\"reps\":null,\"duration\":N_MAX_35,\"note\":\"coaching cue\"}},\"summary\":\"2 sentences\",\"priority\":\"single gap\",\"watch\":\"single risk\"}\nWeights kg integers. Sets 2-4. Reps 6-20. z2 max 35min. Note must be real cue not placeholder.';

  callAI(key,prompt,function(txt){
    try{
      var d=extractJSON(txt);
      if(!d){
        if(el)el.innerHTML='<div style="background:var(--bg3);border:1px solid rgba(227,80,80,.3);border-radius:12px;padding:14px;font-size:13px;color:var(--txt);line-height:1.75"><div style="font-size:11px;font-weight:800;color:var(--red);margin-bottom:8px">Could not parse JSON \u2014 raw response:</div>'+txt.replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</div>';
        return;
      }
      if(!S.profile)S.profile={};
      if(!S.assessmentHistory)S.assessmentHistory=[];
      S.assessmentHistory.push({date:today(),phase:ph+1,phaseWeek:phWk,loads:d.loads||{},summary:d.summary||'',priority:d.priority||'',watch:d.watch||''});
      S.profile.nextAssessmentDate=addDays(today(),56);
      S.profile.assessmentLoads=d.loads||{};
      S.profile.assessmentSummary=d.summary||'';
      S.profile.assessmentDate=today();
      saveS();
      el.innerHTML='<div style="background:var(--bg3);border:1px solid rgba(155,141,232,.3);border-radius:12px;padding:14px;font-size:14px;color:var(--txt);line-height:1.75"><div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--purple);margin-bottom:8px">&#10003; PROGRAMME CALIBRATED</div><div style="font-size:15px;font-weight:700;color:var(--white);margin-bottom:8px">'+d.summary+'</div><div style="font-size:12px;color:var(--amber)">Priority: '+d.priority+'</div><div style="font-size:12px;color:var(--red);margin-top:4px">Watch: '+d.watch+'</div><div style="margin-top:10px;font-size:12px;color:var(--green)">&#10003; Programme updated. Next assessment: '+(S.profile.nextAssessmentDate||'in 8 weeks')+'</div>'
      +'<div style="margin-top:10px;">'+getLoadsHTML(d.loads)+'</div>';
    }catch(e){el.innerHTML='<div style="padding:12px;background:var(--bg3);border-radius:10px;font-size:13px;color:var(--txt);line-height:1.6">'+txt.replace(/\n/g,'<br>')+'</div>';}
  },function(err){el.innerHTML='<div style="padding:12px;background:rgba(227,80,80,.1);border-radius:10px;font-size:13px;color:var(--red)">Error: '+err+'</div>';});
}
