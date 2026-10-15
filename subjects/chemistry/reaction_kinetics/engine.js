(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const R=8.314462618;
function concentration(order,c0,k,t){nonnegative(c0,k,t);if(![0,1,2].includes(order))throw new RangeError('反応次数は0・1・2です');return order===0?Math.max(0,c0-k*t):order===1?c0*Math.exp(-k*t):c0/(1+k*c0*t);}
function calculate(s){nonnegative(s.c0,s.k,s.t,s.Ea);positive(s.T);if(s.T<200||s.T>800||s.Ea>150)throw new RangeError('モデル範囲：200〜800 K、Eaは0〜150 kJ/mol');const c=concentration(s.order,s.c0,s.k,s.t),ratio=Math.exp(-s.Ea*1000/R*(1/s.T-1/298.15));return {c,rate:s.order===0&&c===0?0:s.k*Math.pow(c,s.order),ratio,half:s.order===1&&s.k>0?Math.LN2/s.k:null};}
function energy(x,Ea,factor=1){finite(x);nonnegative(Ea);positive(factor);const barrier=Ea*factor;return x<=.5?barrier*Math.sin(Math.PI*x)**2:-20+(barrier+20)*Math.sin(Math.PI*x)**2;}
const api={R,concentration,calculate,energy};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
