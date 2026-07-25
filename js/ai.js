// Iron Protocol - ai.js
// Prompt builder and session analysis
// ASCII-ONLY: no byte above 0x7F may appear in this file.

function buildPrompt(){
  var sess=S.sessions[curSessDate],sd=SESSIONS[curSessType],comp=sessComp(curSessDate),ph=getPhase(),phWk=getPhaseWk();
  var lines='';
  sd.blocks.forEach(function(blk){blk.exs.forEach(function(ex){var ed=sess.exercises[ex.id]||{};if(ed.comp){lines+='DONE: '+ex.n;if(ed.sets&&ed.sets.length){var info=ed.sets.filter(function(s){return s.done;}).map(function(s,i){var p=['Set'+(i+1)];if(s.wt!=null)p.push(s.wt+'kg');if(s.rp!=null)p.push(s.rp+' reps');if(s.rpe!=null)p.push('RPE'+s.rpe);return p.join(' ');}).join(' | ');if(info)lines+=': '+info;}lines+='\n';}else{lines+='SKIP: '+ex.n+'\n';}});});
  return 'Elite fitness coach. Athlete: 40yo male, corporate worker, goals: ultra-trail endurance, explosive power, heavy carry.\nPhase '+(ph+1)+' ('+PHASES[ph].name+') Week '+phWk+'.\nSession '+curSessType+' '+today()+': '+comp.pct+'% complete.\n'+lines+'\nRespond in this format (under 200 words):\n\n&#128202; SESSION READ\n[1-2 sentences]\n\n&#128200; TREND\n[2 sentences]\n\n&#127919; NEXT SESSION\n1. [specific action]\n2. [specific action]\n3. [specific action]\n\n&#9888; WATCH\n[single flag]';
}

function analyzeSession(){
  var key=S.profile.apiKey;
  var el=document.getElementById('ai-resp-fc');
  if(!el)return;
  if(!key){el.innerHTML='<div style="padding:12px;background:rgba(227,80,80,.1);border-radius:10px;font-size:13px;color:var(--red)">No AI key. Add your Groq key (gsk_...) in Setup.</div>';return;}
  el.innerHTML='<div style="padding:14px;text-align:center;color:var(--txt2);font-size:14px">Analysing...</div>';
  callAI(key,buildPrompt(),function(txt){el.innerHTML='<div style="background:var(--bg3);border:1px solid rgba(155,141,232,.3);border-radius:12px;padding:14px;font-size:14px;color:var(--txt);line-height:1.75"><div style="font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--purple);margin-bottom:10px">AI COACH</div>'+txt.replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>')+'</div>';},function(err){el.innerHTML='<div style="padding:12px;background:rgba(227,80,80,.1);border-radius:10px;font-size:13px;color:var(--red)">Error: '+err+'</div>';});
}
