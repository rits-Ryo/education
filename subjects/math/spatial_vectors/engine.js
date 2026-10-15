(function(root){
'use strict';

function analyze(a,b){if(![...a,...b].every(Number.isFinite)||a.length!==3||b.length!==3)throw new RangeError('有限の3成分が必要です');const lengths=[Math.hypot(...a),Math.hypot(...b)],rawDot=a.reduce((s,x,i)=>s+x*b[i],0);
 const normalized=lengths[0]===0||lengths[1]===0?null:a.reduce((s,x,i)=>s+(x/lengths[0])*(b[i]/lengths[1]),0);
 const cos=normalized===null?null:Math.max(-1,Math.min(1,normalized));
 const outOfRange=!Number.isFinite(rawDot)||(rawDot===0&&cos!==null&&cos!==0),dot=outOfRange?null:rawDot;
 return {lengths,dot,cos,angle:cos===null?null:Math.acos(cos),orthogonal:!outOfRange&&dot===0&&cos===0,outOfRange};}

function project(p,azimuth,elevation){const c=Math.cos(azimuth),s=Math.sin(azimuth),ce=Math.cos(elevation),se=Math.sin(elevation),side=c*p[0]-s*p[1],front=s*p[0]+c*p[1];return [side,ce*p[2]-se*front,ce*front+se*p[2]];}
const api={analyze,project};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
