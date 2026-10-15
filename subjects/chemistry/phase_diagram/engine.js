(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

// Dimensionless illustrative substance: triple point (T=0,P=1), not water data.
function heating(Q){nonnegative(Q);if(Q<10)return {T:-20+2*Q,phase:'固体'};if(Q<=30)return {T:0,phase:Q===10?'固体／融解開始':Q===30?'融解終了／液体':'固体・液体共存'};if(Q<80)return {T:2*(Q-30),phase:'液体'};if(Q<=180)return {T:100,phase:'液体・気体共存'};return {T:100+(Q-180),phase:'気体'};}
function phase(T,P){finite(T);positive(P);const melt=P-1,vapor=Math.exp(T/100);if(T===0&&P===1)return '三重点（3相共存）';if(T<0){const sublimation=Math.exp(T/50);return P===sublimation?'固体・気体共存':P>sublimation?'固体':'気体';}if(T===melt&&P>=1)return '固体・液体共存';if(P===vapor&&P>=1)return '液体・気体共存';return P< vapor?'気体':T<melt?'固体':'液体';}
function calculate(s){return {...heating(s.Q),region:phase(s.pointT,s.pointP),pointT:s.pointT,pointP:s.pointP};}
const api={heating,phase,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
