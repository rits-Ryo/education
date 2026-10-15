(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const R=8.314462618,F=96485.33212,T=298.15,metals={Zn:-.76,Fe:-.44,Mg:-2.37};
function calculate(s){if(!Object.hasOwn(metals,s.metal))throw new RangeError('収録した金属を選択してください');positive(s.anodeC,s.cathodeC);if(!['standard','nernst'].includes(s.mode))throw new RangeError('標準状態または濃度近似を選択してください');const E0=.34-metals[s.metal],Q=s.anodeC/s.cathodeC,E=s.mode==='standard'?E0:E0-R*T/(2*F)*Math.log(Q);return {E0,E,Q,electrons:2,anode:s.metal,cathode:'Cu'};}
const api={R,F,T,metals,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
