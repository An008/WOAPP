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

// Cedars-Sinai / Deurenberg. BMI-based, validated against this operator's DEXA.
function bodyFatCedars(weight,heightCm,age,sexMale){
  if(!weight||!heightCm)return null;
  var bmi=weight/Math.pow(heightCm/100,2);
  var s=(sexMale===false)?0:1;
  return Math.round((1.20*bmi+0.23*(age||40)-10.8*s-5.4)*10)/10;
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
  var bf=(m.bodyFat!=null&&m.bodyFat>0)?m.bodyFat:bodyFatCedars(m.weight,h,age,true);
  var lbm=Math.round(m.weight*(1-bf/100)*10)/10;
  return {date:m.date,weight:m.weight,bf:bf,lbm:lbm,
          bmi:Math.round(m.weight/Math.pow(h/100,2)*10)/10,
          manual:(m.bodyFat!=null&&m.bodyFat>0),
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
  var protein=Math.round(comp.lbm*(cutting?2.8:2.2));
  var fat=Math.round(comp.weight*0.8);
  var carbs=Math.max(0,Math.round((target-protein*4-fat*9)/4));

  return {kcal:target,protein:protein,carbs:carbs,fat:fat,
          derived:true,phase:comp.phase,cutting:cutting,
          bmr:bmr,tdee:tdee,activity:act,adapt:adapt,floored:floored,
          comp:comp,basis:comp.date};
}
