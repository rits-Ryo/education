(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const paths={exothermic:{levels:[0,-40,-100],name:'教育用発熱モデル'},endothermic:{levels:[0,30,80],name:'教育用吸熱モデル'}};
function calculate(s){if(!paths[s.kind]||![1,-1].includes(s.direction))throw new RangeError('反応モデル・方向が不正です');positive(s.multiple);const levels=paths[s.kind].levels.map(x=>x*s.multiple);if(s.direction===-1)levels.reverse();return {levels,steps:[levels[1]-levels[0],levels[2]-levels[1]],delta:levels[2]-levels[0]};}
const api={paths,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
