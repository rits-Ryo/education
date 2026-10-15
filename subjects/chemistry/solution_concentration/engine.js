(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

function calculate(s){if(!['nV','cV','nc'].includes(s.mode)||!['L','mL'].includes(s.unit))throw new RangeError('換算方法・単位を選んでください');nonnegative(s.n,s.c,s.c1,s.c2);positive(s.V,s.Vfinal,s.V1,s.V2);const inputV=s.V*(s.unit==='mL'?.001:1);let n=s.n,V=inputV,c=s.c;if(s.mode==='nV')c=n/V;else if(s.mode==='cV')n=c*V;else{positive(c);if(n===0)throw new RangeError('nとcから求める体積は正でなければなりません');V=n/c;}if(s.Vfinal<V)throw new RangeError('希釈後の体積は希釈前以上にしてください');return {n,V,c,diluted:n/s.Vfinal,mixed:(s.c1*s.V1+s.c2*s.V2)/(s.V1+s.V2),mixMol:s.c1*s.V1+s.c2*s.V2};}
const api={calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
