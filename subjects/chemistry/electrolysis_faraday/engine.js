(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const F=96485,M=63.55;
function calculate(s){nonnegative(s.I,s.t);if(!['copper','water'].includes(s.kind))throw new RangeError('理想化した電解モデルを選択してください');const Q=s.I*s.t,ne=Q/F;if(!Number.isFinite(Q)||!Number.isFinite(ne)||(s.I>0&&s.t>0&&(Q===0||ne===0)))throw new RangeError('電荷または電子molが数値の表現範囲外です');return {Q,ne,nCu:ne/2,mass:ne/2*M,nH2:ne/2,nO2:ne/4};}
const api={F,M,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
