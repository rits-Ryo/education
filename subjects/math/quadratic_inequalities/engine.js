(function(root){
'use strict';

function solve(a,b,c,op){
 if(![a,b,c].every(Number.isFinite)||a===0||![">",">=","<","<="].includes(op))throw new RangeError('有限の係数、a≠0、有効な不等号が必要です');
 const D=b*b-4*a*c;if(!Number.isFinite(D))throw new RangeError('判別式が計算範囲を超えました');
 const scale=Math.max(Math.abs(a),Math.abs(b),Math.abs(c)),scaledD=(b/scale)**2-4*(a/scale)*(c/scale);
 if(D===0&&scaledD!==0)throw new RangeError('判別式が数値の表現範囲外、または数値的に判別しにくい状態です。係数の尺度を調整してください');
 let roots=[];
 if(D===0)roots=[-b/(2*a)];else if(D>0){const q=-.5*(b+(b>=0?1:-1)*Math.sqrt(D));roots=[q/a,c/q].sort((x,y)=>x-y);}
 if(!roots.every(Number.isFinite))throw new RangeError('実根が数値の表現範囲を超えました');
 const positive=op.startsWith('>'),closed=op.length===2,signWanted=positive?1:-1,signA=Math.sign(a);
 let intervals=[];
 if(!roots.length){if(signA===signWanted)intervals=[{lo:-Infinity,hi:Infinity,lc:false,hc:false}];}
 else if(roots.length===1){const r=roots[0];if(signA===signWanted)intervals=closed?[{lo:-Infinity,hi:Infinity,lc:false,hc:false}]:[{lo:-Infinity,hi:r,lc:false,hc:false},{lo:r,hi:Infinity,lc:false,hc:false}];else if(closed)intervals=[{lo:r,hi:r,lc:true,hc:true}];}
 else{const [l,r]=roots;intervals=signA===signWanted?[{lo:-Infinity,hi:l,lc:false,hc:closed},{lo:r,hi:Infinity,lc:closed,hc:false}]:[{lo:l,hi:r,lc:closed,hc:closed}];}
 return {D,roots,intervals};
}
function contains(intervals,x){return intervals.some(i=>(x>i.lo||i.lc&&x===i.lo)&&(x<i.hi||i.hc&&x===i.hi));}
const api={solve,contains,value:(a,b,c,x)=>(a*x+b)*x+c};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
