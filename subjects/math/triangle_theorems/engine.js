(function(root){
'use strict';

function geometry(A,B,C){
 if(![...A,...B,...C].every(Number.isFinite))throw new RangeError('有限の座標が必要です');
 const dist=(P,Q)=>Math.hypot(P[0]-Q[0],P[1]-Q[1]);const a=dist(B,C),b=dist(C,A),c=dist(A,B),scale=Math.max(a,b,c);
 const cross=(B[0]-A[0])*(C[1]-A[1])-(B[1]-A[1])*(C[0]-A[0]),area=Math.abs(cross)/2;
 const unstable=area===0||!Number.isFinite(area)||scale===0||Math.min(a,b,c)<1e-10*scale||Math.abs(cross)<1e-10*scale*scale;
 if(unstable)return {a,b,c,area,unstable:true,angles:null,R:null,center:null,foot:null};
 const angle=(P,Q,T)=>{const u=[Q[0]-P[0],Q[1]-P[1]],v=[T[0]-P[0],T[1]-P[1]];return Math.atan2(Math.abs(u[0]*v[1]-u[1]*v[0]),u[0]*v[0]+u[1]*v[1]);};
 const angles=[angle(A,B,C),angle(B,C,A),angle(C,A,B)];
 // Relative coordinates prevent subtracting large squares of absolute coordinates.
 const u=[B[0]-A[0],B[1]-A[1]],v=[C[0]-A[0],C[1]-A[1]],u2=u[0]**2+u[1]**2,v2=v[0]**2+v[1]**2;
 const center=[A[0]+(u2*v[1]-v2*u[1])/(2*cross),A[1]+(u[0]*v2-v[0]*u2)/(2*cross)];
 const w=[C[0]-B[0],C[1]-B[1]],t=((A[0]-B[0])*w[0]+(A[1]-B[1])*w[1])/(a*a),foot=[B[0]+t*w[0],B[1]+t*w[1]];
 return {a,b,c,area,angles,center,R:a*b*c/(4*area),foot,unstable:false};
}
const api={geometry};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
