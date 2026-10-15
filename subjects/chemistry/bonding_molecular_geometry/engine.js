(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const tetra=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]],z=-Math.sqrt((Math.cos(107*Math.PI/180)+.5)/1.5),nh=Array.from({length:3},(_,i)=>[Math.sqrt(1-z*z)*Math.cos(i*2*Math.PI/3),Math.sqrt(1-z*z)*Math.sin(i*2*Math.PI/3),z]);
const models={H2:{atoms:['H','H'],points:[[-1,0,0],[1,0,0]],bonds:[[0,1,1]],lone:[0,0],shape:'直線形',angle:null,polar:false},H2O:{atoms:['O','H','H'],points:[[0,0,0],[Math.sin(52.25*Math.PI/180),Math.cos(52.25*Math.PI/180),0],[-Math.sin(52.25*Math.PI/180),Math.cos(52.25*Math.PI/180),0]],bonds:[[0,1,1],[0,2,1]],lone:[2,0,0],shape:'折れ線形',angle:104.5,polar:true},NH3:{atoms:['N','H','H','H'],points:[[0,0,0],...nh],bonds:[[0,1,1],[0,2,1],[0,3,1]],lone:[1,0,0,0],shape:'三角錐形',angle:107,polar:true},CH4:{atoms:['C','H','H','H','H'],points:[[0,0,0],...tetra],bonds:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],lone:[0,0,0,0,0],shape:'正四面体形',angle:109.5,polar:false},CO2:{atoms:['C','O','O'],points:[[0,0,0],[-1.5,0,0],[1.5,0,0]],bonds:[[0,1,2],[0,2,2]],lone:[0,2,2],shape:'直線形',angle:180,polar:false},BF3:{atoms:['B','F','F','F'],points:[[0,0,0],...[0,1,2].map(i=>[Math.cos(i*2*Math.PI/3),Math.sin(i*2*Math.PI/3),0])],bonds:[[0,1,1],[0,2,1],[0,3,1]],lone:[0,3,3,3],shape:'平面三角形（Bは6電子）',angle:120,polar:false},NaCl:{atoms:Array.from({length:8},(_,i)=>((i&1)+((i>>1)&1)+((i>>2)&1))%2?'Cl−':'Na+'),points:Array.from({length:8},(_,i)=>[(i&1)*2-1,((i>>1)&1)*2-1,((i>>2)&1)*2-1]),bonds:[],lone:[],shape:'イオン結晶の一部分（分子ではない）',angle:null,polar:null}};
models.metal={atoms:Array(8).fill('M⁺'),points:models.NaCl.points,bonds:[],lone:[],shape:'金属陽イオンと広がった電子の概念模型',angle:null,polar:null,electrons:8};
function calculate(s){if(!models[s.kind])throw new RangeError('収録したモデルを選択してください');finite(s.phi,s.tilt);return models[s.kind];}
const api={models,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
