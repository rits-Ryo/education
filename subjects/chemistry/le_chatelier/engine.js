(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const R=8.314462618,Kref=.2,Href=57000,Tref=298.15;
function equilibrium(total,K){positive(K);nonnegative(total);const B=2*K*total/(Math.sqrt(K*K+8*K*total)+K);return {A:(total-B)/2,B};}
function calculate(s){positive(s.V,s.T);nonnegative(s.add);if(s.T<250||s.T>500||!['A','B','inert'].includes(s.kind))throw new RangeError('250〜500 K、有効な添加物が必要です');const base=equilibrium(2,Kref),nA=base.A+(s.kind==='A'?s.add:0),nB=base.B+(s.kind==='B'?s.add:0),A=nA/s.V,B=nB/s.V,K=Kref*Math.exp(-Href/R*(1/s.T-1/Tref)),Q=A===0?null:B*B/A,eq=equilibrium((2*nA+nB)/s.V,K);return {A,B,K,Q,equilibrium:eq,direction:s.V===1&&s.T===Tref&&(s.kind==='inert'||s.add===0)?'平衡（初期条件）':Q===null?'比較不能':Math.abs(Q-K)<=8*Number.EPSILON*Math.max(Q,K)?'QとKが数値的に極近傍（方向を断定しない）':Q<K?'右へ':Q>K?'左へ':'平衡',inventory:2*nA+nB};}
const api={Kref,Href,Tref,equilibrium,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
