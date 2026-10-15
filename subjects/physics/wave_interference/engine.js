(function(root){
  'use strict';
  const TAU=2*Math.PI;
  function validate(s){if(![s.lambda,s.f,s.A,s.phase,s.d].every(Number.isFinite)||s.lambda<.5||s.lambda>6||s.f<.1||s.f>3||s.A<0||s.A>2||Math.abs(s.phase)>TAU||s.d<0||s.d>10)throw new RangeError('λは0.5〜6 m、fは0.1〜3 Hz、Aは0〜2 cm、位相差は±2π rad、dは0〜10 mです。');return s;}
  function point(p){if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)||Math.abs(p[0])>8||Math.abs(p[1])>6)throw new RangeError('Pはx=±8 m、y=±6 mの範囲にしてください。');return p;}
  function geometry(s,p){validate(s);point(p);const r1=Math.hypot(p[0]+s.d/2,p[1]),r2=Math.hypot(p[0]-s.d/2,p[1]),k=TAU/s.lambda,omega=TAU*s.f,delta=k*(r2-r1)+s.phase;return {r1,r2,pathDifference:r2-r1,k,omega,delta,B:2*s.A*Math.abs(Math.cos(delta/2)),v:s.f*s.lambda};}
  function at(s,p,t){if(!Number.isFinite(t)||t<0||t>1e6)throw new RangeError('時刻は0〜1000000 sです。');const g=geometry(s,p);const u1=s.A*Math.sin(g.omega*t-g.k*g.r1+s.phase),u2=s.A*Math.sin(g.omega*t-g.k*g.r2);return {...g,u1,u2,u:u1+u2,t};}
  function preset(name){
    const s={lambda:2,f:.5,A:1,phase:0,d:4,t:0,p:[0,2]};
    if(name==='opposite')s.phase=Math.PI;else if(name==='half')s.p=[-.5,0];else if(name==='full')s.p=[-1,0];else if(!['same','zero'].includes(name))throw new RangeError('未対応のプリセット');return s;
  }
  function classify(delta){const phase=((delta%TAU)+TAU)%TAU;const e=1e-10;if(Math.min(phase,TAU-phase)<e)return '強め合いの条件（数値許容差内）';if(Math.abs(phase-Math.PI)<e)return '弱め合いの条件（数値許容差内）';return '部分的な重ね合わせ';}
  const api={TAU,validate,point,geometry,at,preset,classify};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WaveEngine=api;
})(typeof window!=='undefined'?window:globalThis);
