(function(root){
  'use strict';
  const G=9.80665;
  function validate(s){
    if(![s.x0,s.v0,s.a,s.T].every(Number.isFinite)||Math.abs(s.x0)>100||Math.abs(s.v0)>30||Math.abs(s.a)>20||s.T<=0||s.T>20)throw new RangeError('x₀は±100 m、v₀は±30 m/s、aは±20 m/s²、Tは0より大きく20 s以下で入力してください。');
    return s;
  }
  function at(s,t){validate(s);if(!Number.isFinite(t)||t<0||t>s.T)throw new RangeError('時刻は0〜Tの範囲です。');return {x:s.x0+s.v0*t+s.a*t*t/2,v:s.v0+s.a*t,a:s.a,t};}
  function turning(s){validate(s);if(s.a===0)return null;const t=-s.v0/s.a;return t>=0&&t<=s.T?t:null;}
  function interval(s,t1,t2){
    const p=at(s,t1),q=at(s,t2);if(t1>t2)throw new RangeError('t₁ ≤ t₂にしてください。');
    const dt=t2-t1,displacement=(p.v+q.v)*dt/2,velocityChange=s.a*dt;
    const zero=turning(s),times=zero!==null&&zero>t1&&zero<t2?[t1,zero,t2]:[t1,t2];
    let distance=0;const regions=[];
    for(let i=1;i<times.length;i++){const left=times[i-1],right=times[i],vl=at(s,left).v,vr=at(s,right).v,area=(vl+vr)*(right-left)/2;distance+=Math.abs(area);regions.push({left,right,area});}
    return {displacement,velocityChange,distance,regions};
  }
  function extent(s){const times=[0,s.T],z=turning(s);if(z!==null)times.push(z);const x=times.map(t=>at(s,t).x);const lo=Math.min(...x),hi=Math.max(...x),margin=Math.max(1,(hi-lo)*.12);return {lo:lo-margin,hi:hi+margin};}
  function preset(name){
    const states={default:{x0:0,v0:2,a:-1,T:6,vertical:false},uniform:{x0:0,v0:2,a:0,T:6,vertical:false},rest:{x0:0,v0:0,a:0,T:6,vertical:false},fall:{x0:0,v0:0,a:-G,T:3,vertical:true},throw:{x0:0,v0:15,a:-G,T:4,vertical:true}};
    if(!states[name])throw new RangeError('未対応のプリセット');return {...states[name]};
  }
  function advance(t,seconds,speed,T){if(![t,seconds,speed,T].every(Number.isFinite)||t<0||seconds<0||speed<=0||T<=0)throw new RangeError('再生設定が不正です。');return Math.min(T,t+seconds*speed);}
  const api={G,validate,at,turning,interval,extent,preset,advance};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KinematicsEngine=api;
})(typeof window!=='undefined'?window:globalThis);
