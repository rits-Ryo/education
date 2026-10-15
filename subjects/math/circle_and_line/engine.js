(function(root){
'use strict';

function relation(h,k,r,A,B,C){if(![h,k,r,A,B,C].every(Number.isFinite)||r<=0||Math.hypot(A,B)===0)throw new RangeError('半径r>0、A²+B²>0の有限の値が必要です');
 const norm=Math.hypot(A,B),u=A/norm,v=B/norm,c=C/norm,signed=u*h+v*k+c,d=Math.abs(signed),foot=[h-signed*u,k-signed*v];
 // Comparison uses the raw distance; nearby values are never called exact tangent.
 if(![d,...foot].every(Number.isFinite))throw new RangeError('直線の係数の尺度が数値計算の範囲外です');
 const kind=d<r?'two':d===r?'tangent':'none';let points=[];if(kind==='tangent')points=[foot];if(kind==='two'){const t=Math.sqrt((r-d)*(r+d));points=[[foot[0]-v*t,foot[1]+u*t],[foot[0]+v*t,foot[1]-u*t]];}
 return {d,foot,points,kind,near:kind!=='tangent'&&Math.abs(d-r)<1e-8*Math.max(1,d,r)};
}
function through(P,Q){const A=P[1]-Q[1],B=Q[0]-P[0];if(Math.hypot(A,B)===0)throw new RangeError('異なる2点が必要です');return {A,B,C:-(A*P[0]+B*P[1])};}
const api={relation,through};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
