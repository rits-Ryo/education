(function(root){
'use strict';

function multiply(z,w){return [z[0]*w[0]-z[1]*w[1],z[0]*w[1]+z[1]*w[0]];}
function argument(z){if(z[0]===0&&z[1]===0)return null;const v=Math.atan2(z[1],z[0]);return v===-Math.PI?Math.PI:v;}
function normalize(theta){let v=((theta+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;return v===-Math.PI?Math.PI:v;}
function analyze(z,w){if(![...z,...w].every(Number.isFinite))throw new RangeError('有限の実部・虚部が必要です');const product=multiply(z,w);if(!product.every(Number.isFinite)||(Math.hypot(...z)>0&&Math.hypot(...w)>0&&product.every(v=>v===0)))throw new RangeError('積が数値の表現範囲外です');return {sum:[z[0]+w[0],z[1]+w[1]],product,lengths:[Math.hypot(...z),Math.hypot(...w),Math.hypot(...product)],args:[argument(z),argument(w),argument(product)],conjugate:[z[0],-z[1]]};}
const api={multiply,argument,normalize,analyze};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
