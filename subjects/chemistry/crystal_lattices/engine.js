(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const corners=Array.from({length:8},(_,i)=>[(i&1),((i>>1)&1),((i>>2)&1)]),faces=[[.5,.5,0],[.5,.5,1],[.5,0,.5],[.5,1,.5],[0,.5,.5],[1,.5,.5]];
function calculate(s){positive(s.r);if(!['SC','BCC','FCC'].includes(s.kind))throw new RangeError('単位格子を選択してください');const N=s.kind==='SC'?1:s.kind==='BCC'?2:4,coord=s.kind==='SC'?6:s.kind==='BCC'?8:12,a=s.kind==='SC'?2*s.r:s.kind==='BCC'?4*s.r/Math.sqrt(3):4*s.r/Math.sqrt(2);return {N,coord,a,r:s.r,packing:N*4*Math.PI*s.r**3/(3*a**3),points:[...corners,...(s.kind==='BCC'?[[.5,.5,.5]]:s.kind==='FCC'?faces:[])],cornerContribution:1,otherContribution:N-1};}
const api={corners,faces,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
