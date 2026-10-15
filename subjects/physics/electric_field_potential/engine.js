(function(root){
  'use strict';
  const K=8.9875517923e9,EXCLUSION=.12;
  function validate(charges){if(!Array.isArray(charges)||charges.length>2||charges.some(c=>![c.q,c.x,c.y].every(Number.isFinite)||Math.abs(c.q)>10||Math.abs(c.x)>10||Math.abs(c.y)>10))throw new RangeError('電荷は2個まで、qは±10 nC、位置は±10 mです。');return charges;}
  function field(charges,p){
    validate(charges);if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite))throw new RangeError('観測点は有限の座標にしてください。');
    let Ex=0,Ey=0,V=0;const contributions=[];
    for(const c of charges){if(c.q===0){contributions.push({Ex:0,Ey:0,V:0});continue;}const dx=p[0]-c.x,dy=p[1]-c.y,r=Math.hypot(dx,dy);if(r===0)return {defined:false,reason:'center',contributions:[]};const v=K*c.q*1e-9/r,e=v/r;
      const part={Ex:e*dx/r,Ey:e*dy/r,V:v};Ex+=part.Ex;Ey+=part.Ey;V+=v;contributions.push(part);}
    const magnitude=Math.hypot(Ex,Ey);
    if(![Ex,Ey,V,magnitude].every(Number.isFinite))return {defined:false,reason:'range',contributions:[]};
    return {defined:true,Ex,Ey,V,magnitude,contributions};
  }
  function excluded(charges,p,radius=EXCLUSION){return charges.some(c=>c.q!==0&&Math.hypot(p[0]-c.x,p[1]-c.y)<=radius);}
  function trace(charges,start,{range=6,step=.04,maxSteps=800,direction=1}={}){
    validate(charges);if(!Number.isFinite(range)||range<=0||range>20||!Number.isFinite(step)||step<=0||step>1||!Number.isInteger(maxSteps)||maxSteps<1||maxSteps>5000||![1,-1].includes(direction)||!Array.isArray(start)||start.length!==2||!start.every(Number.isFinite))throw new RangeError('電気力線の設定が不正です。');
    let p=start.slice();const points=[p];let reason='上限';
    const unit=q=>{if(excluded(charges,q)||Math.max(...q.map(Math.abs))>range)return null;const f=field(charges,q);if(!f.defined||f.magnitude===0)return null;const total=f.contributions.reduce((a,c)=>a+Math.hypot(c.Ex,c.Ey),0);if(f.magnitude<total*1e-10)return null;return [direction*f.Ex/f.magnitude,direction*f.Ey/f.magnitude];};
    for(let i=0;i<maxSteps;i++){
      const u=unit(p);if(!u){reason='除外円・零電場・境界';break;}
      const at=(v,k)=>[p[0]+step*v[0]*k,p[1]+step*v[1]*k],v=unit(at(u,.5)),w=v&&unit(at(v,.5)),z=w&&unit(at(w,1));
      if(!v||!w||!z){reason='除外円・零電場・境界';break;}
      const next=[p[0]+step*(u[0]+2*v[0]+2*w[0]+z[0])/6,p[1]+step*(u[1]+2*v[1]+2*w[1]+z[1])/6];
      if(Math.max(...next.map(Math.abs))>range||excluded(charges,next)){reason='除外円・境界';break;}
      if(Math.hypot(next[0]-p[0],next[1]-p[1])<step*1e-6){reason='停滞';break;}points.push(next);p=next;
    }
    return {points,reason,direction};
  }
  // Marching squares: straight segments approximate V=level; undefined cells are skipped.
  function contours(charges,levels,{range=6,resolution=80}={}){
    validate(charges);if(!Array.isArray(levels)||!levels.every(Number.isFinite)||!Number.isFinite(range)||range<=0||range>20||!Number.isInteger(resolution)||resolution<8||resolution>200)throw new RangeError('等電位線の設定が不正です。');
    const h=2*range/resolution,grid=[];
    for(let j=0;j<=resolution;j++){grid[j]=[];for(let i=0;i<=resolution;i++){const p=[-range+i*h,-range+j*h],f=field(charges,p);grid[j][i]=excluded(charges,p)?null:f.defined?f.V:null;}}
    return levels.map(level=>{const segments=[];
      for(let j=0;j<resolution;j++)for(let i=0;i<resolution;i++){
        const values=[grid[j][i],grid[j][i+1],grid[j+1][i+1],grid[j+1][i]];if(values.some(v=>v===null))continue;
        const x=-range+i*h,y=-range+j*h,ps=[[x,y],[x+h,y],[x+h,y+h],[x,y+h]],cross=[];
        for(let e=0;e<4;e++){const n=(e+1)%4;if((values[e]<level)===(values[n]<level))continue;const t=(level-values[e])/(values[n]-values[e]);cross.push({edge:e,p:[ps[e][0]+t*(ps[n][0]-ps[e][0]),ps[e][1]+t*(ps[n][1]-ps[e][1])]});}
        if(cross.length===2)segments.push([cross[0].p,cross[1].p]);
        if(cross.length===4){const center=field(charges,[x+h/2,y+h/2]);if(!center.defined)continue;const same=(center.V<level)===(values[0]<level);const pairs=same?[[0,1],[2,3]]:[[0,3],[1,2]];for(const [a,b] of pairs)segments.push([cross[a].p,cross[b].p]);}
      }return {level,segments};});
  }
  function preset(name){const positive={q:1,x:-2,y:0},negative={q:-1,x:2,y:0};if(name==='positive')return [{q:1,x:0,y:0}];if(name==='negative')return [{q:-1,x:0,y:0}];if(name==='dipole')return [positive,negative];if(name==='same')return [positive,{...negative,q:1}];throw new RangeError('未対応のプリセット');}
  const api={K,EXCLUSION,validate,field,excluded,trace,contours,preset};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ElectricEngine=api;
})(typeof window!=='undefined'?window:globalThis);
