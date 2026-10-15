(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const NA=6.02214076e23,reactions={water:{reactants:['H₂','O₂'],coeff:[2,1],product:'H₂O',productCoeff:2,M:[2.016,31.998,18.015]},ammonia:{reactants:['N₂','H₂'],coeff:[1,3],product:'NH₃',productCoeff:2,M:[28.014,2.016,17.031]}};
function calculate(s){const r=reactions[s.kind];if(!r||!['mol','mass','particles'].includes(s.mode))throw new RangeError('有効な反応と換算元を選んでください');nonnegative(s.value,s.n1,s.n2);positive(s.M);if(s.mode==='particles'&&!Number.isInteger(s.value))throw new RangeError('粒子数は0以上の整数で入力してください');const n=s.mode==='mol'?s.value:s.mode==='mass'?s.value/s.M:s.value/NA,extent=Math.min(s.n1/r.coeff[0],s.n2/r.coeff[1]);if(![n,n*NA,n*s.M].every(Number.isFinite)||(s.value>0&&(n===0||n*s.M===0)))throw new RangeError('換算値が数値の表現範囲外です');return {n,N:n*NA,m:n*s.M,extent,product:extent*r.productCoeff,left:[Math.max(0,s.n1-extent*r.coeff[0]),Math.max(0,s.n2-extent*r.coeff[1])],reaction:r};}
const api={NA,reactions,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
