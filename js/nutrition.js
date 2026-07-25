// Iron Protocol - nutrition.js
// Body composition and calorie targeting.
//
// Formulas alone were overshooting badly, so the target self-corrects from
// logged bodyweight: if the scale disagrees with the model, the scale wins.
// ASCII-ONLY: no byte above 0x7F may appear in this file.

var BF_CUT_THRESHOLD=20;   // above this -> cutting phase
var CUT_DEFICIT=0.75;      // 25 per cent below maintenance
var KCAL_PER_KG=7700;      // energy in 1 kg of bodyweight
var DEFAULT_ACTIVITY=1.35; // desk job + 3 missions/week (was 1.60 - far too high)

// --- BODY FAT ESTIMATION -----------------------------------------------------
// Validated against this operator's DEXA (30.3% at 71.3kg / 164cm / 93.5cm waist):
//   RFM         28.9%   -1.4 pts
//   US Navy     25.7%   -4.6 pts
//   Deurenberg  24.8%   -5.5 pts
// Every formula under-reads, so RFM is the base (closest, and waist-driven so it
// tracks real fat loss) and a DEXA reference removes the remaining bias.

// Relative Fat Mass - Woolcott & Bergman. Male: 64 - 20*(height/waist)
function bodyFatRFM(waist,heightCm){
  if(!waist||!heightCm||waist<=0)return null;
  return Math.round((64-20*(heightCm/waist))*10)/10;
}
// US Navy - circumference based
function bodyFatNavy(waist,neck,heightCm){
  if(!waist||!neck||!heightCm||waist<=neck)return null;
  return Math.round((495/(1.0324-0.19077*Math.log10(waist-neck)
    +0.15456*Math.log10(heightCm))-450)*10)/10;
}
// Cedars-Sinai / Deurenberg - BMI based
function bodyFatCedars(weight,heightCm,age,sexMale){
  if(!weight||!heightCm)return null;
  var bmi=weight/Math.pow(heightCm/100,2);
  var s=(sexMale===false)?0:1;
  return Math.round((1.20*bmi+0.23*(age||40)-10.8*s-5.4)*10)/10;
}

// Raw (uncalibrated) estimate from a measurement record
function rawEstimate(m){
  if(!m)return null;
  var h=S.profile.height||164;
  var r=bodyFatRFM(m.waist,h);
  if(r!=null)return r;
  var n=bodyFatNavy(m.waist,m.neck,h);
  if(n!=null)return n;
  return bodyFatCedars(m.weight,h,S.profile.age||40,true);
}

// Calibration against gold-standard scans. One reference gives an offset; two or
// more fit a line, so the correction adapts across the range.
function bfCalibration(){
  var refs=(S.profile&&S.profile.bfReferences)||[];
  var pts=[];
  refs.forEach(function(r){
    if(!r||r.value==null)return;
    var est=(r.estimate!=null)?r.estimate
      :rawEstimate({waist:r.waist,neck:r.neck,weight:r.weight});
    if(est!=null)pts.push({est:est,ref:r.value,date:r.date,method:r.method||'DEXA'});
  });
  if(!pts.length)return {mode:'none',n:0};
  if(pts.length===1)return {mode:'offset',n:1,offset:Math.round((pts[0].ref-pts[0].est)*100)/100,
                            ref:pts[0]};
  var n=pts.length,sx=0,sy=0,sxx=0,sxy=0;
  pts.forEach(function(p){sx+=p.est;sy+=p.ref;sxx+=p.est*p.est;sxy+=p.est*p.ref;});
  var den=n*sxx-sx*sx;
  if(Math.abs(den)<1e-9)return {mode:'offset',n:n,offset:Math.round((sy/n-sx/n)*100)/100,ref:pts[n-1]};
  var slope=(n*sxy-sx*sy)/den, icpt=(sy-slope*sx)/n;
  return {mode:'linear',n:n,slope:slope,intercept:icpt,ref:pts[n-1]};
}

function applyCalibration(est){
  if(est==null)return null;
  var c=bfCalibration();
  if(c.mode==='offset')return Math.round((est+c.offset)*10)/10;
  if(c.mode==='linear')return Math.round((c.slope*est+c.intercept)*10)/10;
  return est;
}

// Latest measurement carrying a bodyweight
function latestWeighIn(){
  var ms=S.measurements||[];
  for(var i=ms.length-1;i>=0;i--)if(ms[i]&&ms[i].weight)return ms[i];
  return null;
}

function bodyComp(){
  var m=latestWeighIn();
  if(!m)return null;
  var h=S.profile.height||164, age=S.profile.age||40;
  var manual=(m.bodyFat!=null&&m.bodyFat>0);
  var raw=rawEstimate(m);
  var cal=bfCalibration();
  var bf=manual?m.bodyFat:applyCalibration(raw);
  if(bf==null)bf=bodyFatCedars(m.weight,h,age,true);
  var lbm=Math.round(m.weight*(1-bf/100)*10)/10;
  return {date:m.date,weight:m.weight,bf:bf,lbm:lbm,raw:raw,
          bmi:Math.round(m.weight/Math.pow(h/100,2)*10)/10,
          manual:manual,calibrated:(!manual&&cal.mode!=='none'),cal:cal,
          navy:bodyFatNavy(m.waist,m.neck,h),
          cedars:bodyFatCedars(m.weight,h,age,true),
          phase:bf>BF_CUT_THRESHOLD?'cut':'maintain'};
}

// Katch-McArdle - uses lean mass, so it is not fooled by body composition
function bmrFrom(comp){
  if(!comp)return null;
  return Math.round(370+21.6*comp.lbm);
}

// Measured rate of weight change, kg per week, from the widest usable span
function weightTrend(){
  var ms=(S.measurements||[]).filter(function(m){return m&&m.weight;});
  if(ms.length<2)return null;
  var last=ms[ms.length-1];
  for(var i=ms.length-2;i>=0;i--){
    var days=Math.round((new Date(last.date+'T12:00:00')-new Date(ms[i].date+'T12:00:00'))/86400000);
    if(days>=10){
      return {kgPerWeek:Math.round((last.weight-ms[i].weight)/days*7*100)/100,
              days:days,from:ms[i].date,to:last.date,
              fromW:ms[i].weight,toW:last.weight};
    }
  }
  return null;
}

// The correction that makes this work: compare intended rate against measured
// rate and shift the target by the difference.
function adaptiveOffset(comp,intendedKcal,tdee){
  var t=weightTrend();
  if(!t||!comp)return {kcal:0,trend:t,note:'Need two weigh-ins 10+ days apart'};
  var intendedKgWeek=(intendedKcal-tdee)*7/KCAL_PER_KG;
  var errKgWeek=t.kgPerWeek-intendedKgWeek;
  var kcal=Math.round(-errKgWeek*KCAL_PER_KG/7/10)*10;
  if(kcal>500)kcal=500;
  if(kcal<-500)kcal=-500;
  return {kcal:kcal,trend:t,intended:Math.round(intendedKgWeek*100)/100,
          actual:t.kgPerWeek,note:null};
}

function macroTargets(type){
  type=type||'A';
  var comp=bodyComp();
  var base=MACRO_TARGETS[type]||MACRO_TARGETS.REST;
  if(!comp){var o={};for(var k in base)o[k]=base[k];o.derived=false;
            o.reason='Log a bodyweight in the Body tab to derive targets';return o;}

  var bmr=bmrFrom(comp);
  var act=(S.profile&&S.profile.activity)||DEFAULT_ACTIVITY;
  // training days cost a little more than recovery days
  var dayMod=(type==='REST')?0.94:(type==='B'?1.05:1.0);
  var tdee=Math.round(bmr*act*dayMod);

  var cutting=comp.phase==='cut';
  var target=Math.round(tdee*(cutting?CUT_DEFICIT:1.0));

  var adapt=adaptiveOffset(comp,target,tdee);
  target+=adapt.kcal;

  // never prescribe below resting metabolic rate
  var floored=false;
  if(target<bmr){target=bmr;floored=true;}
  target=Math.round(target/10)*10;

  // protein scales off LEAN mass, higher while cutting to protect it
  var protein=Math.round(comp.lbm*(cutting?3.0:2.2));
  var fat=Math.round(comp.weight*0.8);
  var carbs=Math.max(0,Math.round((target-protein*4-fat*9)/4));

  return {kcal:target,protein:protein,carbs:carbs,fat:fat,
          derived:true,phase:comp.phase,cutting:cutting,
          bmr:bmr,tdee:tdee,activity:act,adapt:adapt,floored:floored,
          comp:comp,basis:comp.date};
}
