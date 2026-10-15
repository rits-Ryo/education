(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

function calculate(s){finite(s.pKa);nonnegative(s.HA,s.A,s.add);positive(s.V);if(!['acid','base'].includes(s.kind)||s.pKa<2||s.pKa>12)throw new RangeError('添加物は強酸または強塩基、pKaは2〜12');const consumed=Math.min(s.add,s.kind==='acid'?s.A:s.HA),HA=s.HA+(s.kind==='acid'?consumed:-consumed),A=s.A+(s.kind==='acid'?-consumed:consumed),ratio=HA>0?A/HA:null,valid=HA>0&&A>0&&ratio>=.1&&ratio<=10&&(HA+A)/s.V>=100*Math.pow(10,-s.pKa)&&s.add<=consumed;return {HA,A,consumed,excess:s.add-consumed,ratio,pH:valid?s.pKa+Math.log10(ratio):null,valid,total:HA+A};}
const api={calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
