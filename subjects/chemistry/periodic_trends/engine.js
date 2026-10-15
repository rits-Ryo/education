(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const symbols='H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr'.split(' ');
const en=[2.20,null,.98,1.57,2.04,2.55,3.04,3.44,3.98,null,.93,1.31,1.61,1.90,2.19,2.58,3.16,null,.82,1,1.36,1.54,1.63,1.66,1.55,1.83,1.88,1.91,1.90,1.65,1.81,2.01,2.18,2.55,2.96,3];
function element(Z){if(!Number.isInteger(Z)||Z<1||Z>36)throw new RangeError('原子番号は1〜36です');const period=Z<=2?1:Z<=10?2:Z<=18?3:4;let group=period===1?(Z===1?1:18):period===2?(Z<=4?Z-2:Z+8):period===3?(Z<=12?Z-10:Z):Z-18;
 const noble=[2,10,18,36].includes(Z),halogen=[9,17,35].includes(Z),dblock=Z>=21&&Z<=30;
 let config;if(Z<=2)config='1s^{'+Z+'}';else if(Z<=10)config='[\\mathrm{He}]2s^{'+Math.min(2,Z-2)+'}'+(Z>4?'2p^{'+(Z-4)+'}':'');else if(Z<=18)config='[\\mathrm{Ne}]3s^{'+Math.min(2,Z-10)+'}'+(Z>12?'3p^{'+(Z-12)+'}':'');else if(Z<=20)config='[\\mathrm{Ar}]4s^{'+(Z-18)+'}';else if(Z<=30)config='[\\mathrm{Ar}]3d^{'+(Z===24?5:Z===29?10:Z-20)+'}4s^{'+([24,29].includes(Z)?1:2)+'}';else config='[\\mathrm{Ar}]3d^{10}4s^24p^{'+(Z-30)+'}';
 return {Z,symbol:symbols[Z-1],period,group,classification:noble?'希ガス':halogen?'ハロゲン':dblock?(Z===30?'dブロック（Zn）':'遷移元素'):[3,11,19].includes(Z)?'アルカリ金属':[4,12,20].includes(Z)?'2族元素':'典型元素',en:en[Z-1],config,valence:dblock?null:Z===2?2:group<=2?group:group-10};}
function calculate(s){const selected=element(s.Z);if(!Number.isInteger(s.period)||s.period<1||s.period>4)throw new RangeError('比較周期は1〜4です');return {...selected,comparison:symbols.map((_,i)=>element(i+1)).filter(e=>e.period===s.period)};}
const api={symbols,element,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
