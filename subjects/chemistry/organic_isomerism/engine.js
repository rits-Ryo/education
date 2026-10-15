(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const models={butane:{name:'n-ブタン',atoms:['C','C','C','C'],bonds:[[0,1,1],[1,2,1],[2,3,1]],points:[[-1.5,-.5,0],[-.5,.5,0],[.5,-.5,0],[1.5,.5,0]],group:'アルカン'},isobutane:{name:'2-メチルプロパン',atoms:['C','C','C','C'],bonds:[[0,1,1],[1,2,1],[1,3,1]],points:[[-1.2,-.7,0],[0,0,0],[1.2,-.7,0],[0,1.4,0]],group:'アルカン'},ethanol:{name:'エタノール',atoms:['C','C','O'],bonds:[[0,1,1],[1,2,1]],points:[[-1,-.4,0],[0,.4,0],[1,-.4,0]],group:'ヒドロキシ基'},ether:{name:'ジメチルエーテル',atoms:['C','O','C'],bonds:[[0,1,1],[1,2,1]],points:[[-1,-.4,0],[0,.4,0],[1,-.4,0]],group:'エーテル結合'},propanal:{name:'プロパナール',atoms:['C','C','C','O'],bonds:[[0,1,1],[1,2,1],[2,3,2]],points:[[-1.5,-.5,0],[-.5,.5,0],[.5,-.5,0],[1.5,.5,0]],group:'アルデヒド基'},acetone:{name:'プロパノン（アセトン）',atoms:['C','C','C','O'],bonds:[[0,1,1],[1,2,1],[1,3,2]],points:[[-1.2,-.7,0],[0,0,0],[1.2,-.7,0],[0,1.4,0]],group:'カルボニル基（ケトン）'}};
function analyze(model){const valence={C:4,O:2},bondSum=model.atoms.map(()=>0);for(const [a,b,order] of model.bonds){bondSum[a]+=order;bondSum[b]+=order;}const hydrogens=model.atoms.map((a,i)=>valence[a]-bondSum[i]);if(hydrogens.some(n=>!Number.isInteger(n)||n<0))throw new RangeError('結合価に矛盾があります');const counts={C:model.atoms.filter(a=>a==='C').length,H:hydrogens.reduce((a,b)=>a+b,0),O:model.atoms.filter(a=>a==='O').length};return {...model,hydrogens,counts,formula:'\\mathrm C_{'+counts.C+'}\\mathrm H_{'+counts.H+'}'+(counts.O?'\\mathrm O'+(counts.O>1?'_{'+counts.O+'}':''):''),total:counts.C+counts.H+counts.O};}
function calculate(s){if(!models[s.kind]||!['structure','skeleton','model'].includes(s.display))throw new RangeError('収録した構造と表示方法を選択してください');finite(s.phi,s.tilt);return analyze(models[s.kind]);}
const api={models,analyze,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
