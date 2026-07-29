// Iron Protocol - debrief.js
// Post-mission AI analysis. Packages what was PRESCRIBED against what was
// ACTUALLY logged, and returns adjusted loads, replacement objectives, and
// cross-mission corrections for the same muscle groups.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

// Blocks where escalating load is appropriate. Warm-up, prehab, mobility and
// mental work are deliberately excluded - RPE 2 on Shoulder CARs is correct,
// not a signal to add weight.
var WORK_BLOCKS_AI=['B1','B2','B3','JUMP','SPRINT','BOX','CARRY','RUN','COMPLEX'];

function equipmentList(){
  var e=(S.profile&&S.profile.equipment)||{};
  var have=Object.keys(e).filter(function(k){return e[k];});
  return have.length?have.join(', '):'none declared';
}

// Everything the coach needs: prescription, reality, and the gap between them
function missionReport(date,type){
  var key=sessKey(date,type), sess=S.sessions[key];
  if(!sess)return null;
  var sd=SESSIONS[type];
  var mode=sess.mode||'base';
  var rows=[];
  sd.blocks.forEach(function(blk){
    blk.exs.forEach(function(ex0){
      var ex=resolveEx(ex0,mode);
      var ed=(sess.exercises||{})[ex.id]||{};
      var sets=(ed.sets||[]).filter(function(x){return x.done;});
      var rated=sets.filter(function(x){return x.rpe!=null;});
      var avgRpe=rated.length?Math.round(rated.reduce(function(a,x){return a+x.rpe;},0)/rated.length*10)/10:null;
      var loads=sets.filter(function(x){return x.wt!=null;}).map(function(x){return x.wt;});
      var reps=sets.filter(function(x){return x.rp!=null;}).map(function(x){return x.rp;});
      rows.push({
        id:ex.id,name:ex.n,block:blk.id,blockName:blk.n,
        work:WORK_BLOCKS_AI.indexOf(blk.id)>=0,
        prescribed:ex.v,targetSets:ex.s||1,targetReps:ex.rpp||null,weighted:!!ex.wt,
        skipped:!!ed.skipped,completed:!!ed.comp,
        setsLogged:sets.length,setsRated:rated.length,
        avgRpe:avgRpe,loads:loads,reps:reps,
        unverified:(sets.length>0&&rated.length===0)
      });
    });
  });
  return {date:date,type:type,name:sd.name,mode:mode,
          phase:getPhase()+1,phaseWeek:getPhaseWk(),deload:isDeloadWeek(),
          equipment:equipmentList(),rows:rows,
          completed:sessComp(key).pct,resolved:sessResolved(key).pct};
}

function buildDebriefPrompt(rep){
  var lines=rep.rows.map(function(r){
    var actual = r.skipped ? 'SKIPPED - could not execute'
      : r.setsLogged===0 ? 'NOT PERFORMED - no data logged'
      : r.unverified ? 'logged without RPE - treat as unverified'
      : (r.setsLogged+' serials'
         +(r.loads.length?', load '+r.loads.join('/')+'kg':'')
         +(r.reps.length?', actions '+r.reps.join('/'):'')
         +', mean RPE '+r.avgRpe);
    return '- ['+(r.work?'WORK':'SUPPORT')+'] "'+r.id+'" '+r.name
      +' | prescribed '+r.prescribed+' | '+actual;
  }).join('\n');

  return 'You are an elite physical preparation coach debriefing a completed training mission.\n'
   +'Athlete: 40yo male. Goals: ultra-trail endurance, explosive power, 5km carry with 30kg.\n'
   +'Phase '+rep.phase+' week '+rep.phaseWeek+(rep.deload?' (DELOAD WEEK)':'')+'. Loadout: '+rep.mode.toUpperCase()+'.\n'
   +'EQUIPMENT ACTUALLY AVAILABLE: '+rep.equipment+'.\n\n'
   +'MISSION: '+rep.name+' on '+rep.date+' ('+rep.completed+'% completed, '+rep.resolved+'% resolved)\n'+lines+'\n\n'
   +'RULES:\n'
   +'1. Only adjust objectives marked [WORK]. [SUPPORT] items are warm-up, mobility, prehab or breathing - a low RPE there is CORRECT and must never trigger a load increase.\n'
   +'2. RPE guidance for [WORK]: below 3 = far too easy, make a large jump or replace the exercise with a harder variant. 4-5 = increase meaningfully. 6-8 = correct, progress slightly. 9-10 = reduce.\n'
   +'3. SKIPPED, NOT PERFORMED or unverified objectives: work out why and REPLACE them with something achievable using ONLY the equipment listed above. Never prescribe equipment that is not listed.\n'
   +'4. If an objective needs equipment the athlete lacks, replace it outright - do not restate it.\n'
   +'5. Apply the same correction to the SAME muscle group in the other missions where relevant, via crossMission.\n\n'
   +'Return ONLY raw JSON, nothing outside the braces:\n'
   +'{"loads":{"EXERCISE_ID":{"weight":N_or_null,"sets":N,"reps":N,"note":"why this changed"}},'
   +'"replacements":{"EXERCISE_ID":{"name":"New Exercise Name","v":"3 x 10","sets":N,"reps":N,"weighted":true_or_false,"cue":"how to perform it","reason":"why it replaces the original"}},'
   +'"crossMission":[{"mission":"A|B|C","exercise":"EXERCISE_ID","change":"what to adjust and why"}],'
   +'"summary":"2-3 sentences on how the mission actually went",'
   +'"priority":"the single most important correction",'
   +'"watch":"the main injury or overload risk"}\n\n'
   +'Use the exact ids given. Weights in kg as integers.\n'
   +'BE TERSE. Only include objectives that actually change - omit anything already correct. '
   +'Cap notes and cues at 12 words. Maximum 6 entries in loads, 4 in replacements, 3 in crossMission.';
}

function runDebrief(date,type){
  var el=document.getElementById('ai-resp-fc')||document.getElementById('debrief-out');
  var key=getApiKey();
  if(!key){if(el)el.innerHTML='<div style="padding:11px;background:rgba(227,80,80,.1);border-radius:10px;font-size:12px;color:var(--red)">No AI key. Add one in Setup.</div>';return;}
  var rep=missionReport(date,type);
  if(!rep){if(el)el.innerHTML='<div style="font-size:12px;color:var(--red)">No mission record found.</div>';return;}
  if(el)el.innerHTML='<div style="padding:14px;text-align:center;color:var(--txt2);font-size:13px">Transmitting mission debrief...</div>';

  callAI(key,buildDebriefPrompt(rep),function(txt){
    var d=extractJSON(txt);
    if(!d){
      var cut=txt.indexOf('[[TRUNCATED]]')>-1;
      if(el)el.innerHTML='<div style="background:rgba(227,80,80,.08);border:1px solid rgba(227,80,80,.25);border-radius:11px;padding:13px">'
        +'<div style="font-size:12px;font-weight:800;color:var(--red);margin-bottom:5px">'
        +(cut?'Debrief was cut short by the model':'Could not read the debrief')+'</div>'
        +'<div style="font-size:11px;color:var(--txt2);line-height:1.55">'
        +(cut?'The response ran past its length limit. Tap again \u2014 the request now asks for a shorter reply.'
             :'The coach did not return usable structure. Tap again to retry.')+'</div>'
        +'<button onclick="runDebrief(\''+date+'\',\''+type+'\')" style="width:100%;margin-top:9px;padding:9px;border-radius:9px;border:1px solid rgba(155,141,232,.3);background:rgba(155,141,232,.1);color:var(--purple);font-size:12px;font-weight:800;cursor:pointer">Retry Debrief</button></div>';
      return;
    }
    // Autoregulation: move every work objective's RLI from its logged RPE.
    // This is what makes the programme adapt rather than merely record.
    if(typeof adaptMission==='function'&&typeof commitRLI==='function'){
      var moved=adaptMission(type);
      moved.forEach(function(m){if(m.delta!==0)commitRLI(m.exId,m.rli);});
      d.__rli=moved.filter(function(m){return m.delta!==0;});
    }
    if(!S.profile.assessmentLoads)S.profile.assessmentLoads={};
    if(!S.profile.overrides)S.profile.overrides={};
    var nLoads=0,nRepl=0;
    Object.keys(d.loads||{}).forEach(function(k){S.profile.assessmentLoads[k]=d.loads[k];nLoads++;});
    Object.keys(d.replacements||{}).forEach(function(k){
      var r=d.replacements[k];
      S.profile.overrides[k]={n:r.name,v:r.v||'',s:r.sets||undefined,rpp:r.reps||undefined,
                              wt:!!r.weighted,cue:(r.cue||'')+(r.reason?' ('+r.reason+')':''),
                              replacedOn:today()};
      nRepl++;
    });
    if(!S.debriefHistory)S.debriefHistory=[];
    S.debriefHistory.push({date:today(),mission:type,missionDate:date,
      summary:d.summary||'',priority:d.priority||'',watch:d.watch||'',
      loads:d.loads||{},replacements:d.replacements||{},crossMission:d.crossMission||[]});
    saveS();

    var h='<div style="background:var(--bg3);border:1px solid rgba(155,141,232,.3);border-radius:13px;padding:14px;text-align:left">'
      +'<div style="font-size:9px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--purple);margin-bottom:8px">DEBRIEF RECEIVED</div>'
      +(d.summary?'<div style="font-size:13px;color:var(--txt);line-height:1.65;margin-bottom:10px">'+d.summary+'</div>':'');
    if(d.priority)h+='<div style="font-size:11px;color:var(--amber);margin-bottom:4px"><strong>Priority:</strong> '+d.priority+'</div>';
    if(d.watch)h+='<div style="font-size:11px;color:var(--red);margin-bottom:10px"><strong>Watch:</strong> '+d.watch+'</div>';
    if(nRepl){
      h+='<div style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--txt3);margin:10px 0 6px">OBJECTIVES REPLACED</div>';
      Object.keys(d.replacements).forEach(function(k){
        var r=d.replacements[k];
        h+='<div style="padding:7px 0;border-bottom:1px solid var(--border)">'
          +'<div style="font-size:12px;font-weight:700;color:var(--white)">'+k+' \u2192 '+r.name+'</div>'
          +'<div style="font-size:11px;color:var(--txt2)">'+(r.v||'')+(r.reason?' \u00b7 '+r.reason:'')+'</div></div>';
      });
    }
    if(nLoads)h+='<div style="margin-top:10px">'+getLoadsHTML(d.loads)+'</div>';
    if((d.crossMission||[]).length){
      h+='<div style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--txt3);margin:12px 0 6px">CROSS-MISSION ADJUSTMENTS</div>';
      d.crossMission.forEach(function(c){
        h+='<div style="font-size:11px;color:var(--txt2);padding:4px 0;border-bottom:1px solid var(--border)">'
          +'<strong style="color:'+(SESSIONS[c.mission]?SESSIONS[c.mission].col:'var(--txt)')+'">Mission '+c.mission+'</strong> \u00b7 '
          +c.exercise+': '+c.change+'</div>';
      });
    }
    if(d.__rli&&d.__rli.length){
      h+='<div style="font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--txt3);margin:12px 0 6px">AUTOREGULATION</div>';
      d.__rli.forEach(function(m){
        var p2=m.prescription||{};
        h+='<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">'
          +'<div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:var(--white)">'+(p2.name||m.exId)+'</div>'
          +'<div style="font-size:10px;color:var(--txt3)">'+m.reason+(m.lastRpe!=null?' \u00b7 last RPE '+m.lastRpe:'')+'</div></div>'
          +'<div style="font-size:12px;font-weight:800;color:'+(m.delta>0?'var(--green)':'var(--amber)')+';white-space:nowrap">'
          +(m.delta>0?'+':'')+m.delta+' RLI</div></div>';
      });
    }
    h+='<div style="font-size:11px;color:var(--green);margin-top:11px">Applied to your future missions.</div></div>';
    if(el)el.innerHTML=h;
  },function(err){
    if(el)el.innerHTML='<div style="padding:11px;background:rgba(227,80,80,.1);border-radius:10px;font-size:12px;color:var(--red)">Error: '+err+'</div>';
  },3000);
}
