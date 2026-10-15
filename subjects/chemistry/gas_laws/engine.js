(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const R=8.314462618;
function calculate(s){positive(s.n,s.V,s.P);finite(s.temperature);if(!['K','C'].includes(s.unit)||!['boyle','charles','pressure'].includes(s.law))throw new RangeError('温度単位と法則を選択してください');const T=s.temperature+(s.unit==='C'?273.15:0);positive(T);let V=s.V/1000,P=s.P*1000;if(s.law==='boyle')P=s.n*R*T/V;else if(s.law==='charles')V=s.n*R*T/P;else P=s.n*R*T/V;return {P,V,T,n:s.n,speed:Math.sqrt(T/298.15),fixed:s.law==='boyle'?'n・T一定':s.law==='charles'?'n・P一定':'n・V一定'};}
const api={R,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
