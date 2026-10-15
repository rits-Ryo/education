(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

function calculate(s){nonnegative(s.A,s.B,s.common);positive(s.Ksp);const Q=s.A*s.B,root=Math.hypot(s.A-s.B,2*Math.sqrt(s.Ksp)),precipitate=Q>s.Ksp?2*(Q-s.Ksp)/(s.A+s.B+root):0,equilibrium=precipitate>0?[s.A-precipitate,s.B-precipitate]:[s.A,s.B],solubility=Math.sqrt(s.Ksp),withCommon=2*s.Ksp/(s.common+Math.hypot(s.common,2*Math.sqrt(s.Ksp)));if(Q===0&&s.A>0&&s.B>0)throw new RangeError('イオン積が数値の表現範囲未満です');return {Q,precipitate,equilibrium,solubility,withCommon,condition:Q<s.Ksp?'未飽和':Q>s.Ksp?'沈殿の方向':'飽和'};}
const api={calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
