(function(root){
'use strict';

function parameters(kind,a,d,r,p,q,N){if(!['arithmetic','geometric','linear'].includes(kind)||![a,d,r,p,q].every(Number.isFinite)||!Number.isInteger(N)||N<1||N>100)throw new RangeError('有限の係数と項数1〜100が必要です');return {kind,a,d,r,p,q,N};}
function general(s,n){if(!Number.isInteger(n)||n<1)throw new RangeError('nは1以上の整数です');if(n===1)return s.a;const power=s.kind==='geometric'?s.r:s.p;if(s.kind==='arithmetic')return s.a+(n-1)*s.d;if(s.kind==='geometric')return s.a*Math.pow(power,n-1);if(power===1)return s.a+(n-1)*s.q;
 const v=Math.pow(power,n-1);const sum=power>0&&Math.abs(power-1)<.001?-Math.expm1((n-1)*Math.log1p(power-1))/(1-power):(1-v)/(1-power);return v*s.a+s.q*sum;}
function terms(s){let value=s.a,values=[],overflowAt=null;for(let n=1;n<=s.N;n++){if(!Number.isFinite(value)){overflowAt=n;break;}values.push(value);const next=s.kind==='arithmetic'?value+s.d:s.kind==='geometric'?s.r*value:s.p*value+s.q;if(next===0&&value!==0&&((s.kind==='geometric'&&s.r!==0)||(s.kind==='linear'&&s.p!==0&&s.q===0))){if(n<s.N)overflowAt=n+1;break;}value=next;}return {values,overflowAt};}
function behavior(s){const p=s.kind==='geometric'?s.r:s.p,q=s.kind==='geometric'?0:s.q;if(s.kind==='arithmetic')return s.d===0?'constant':'arithmetic';if(p===1)return q===0?'constant':'arithmetic';const fixed=q/(1-p);return s.a===fixed?'constant':Math.abs(p)<1?'convergent':p===-1?'alternating':'growing';}
const api={parameters,general,terms,behavior};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
