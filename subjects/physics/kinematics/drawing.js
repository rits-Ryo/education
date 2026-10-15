(function(root){
  'use strict';
  const E=root.KinematicsEngine,F=root.NumberDisplay.formatNonzero;
  function node(tag,attrs={},text){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;}
  function draw(svg,s,kind){
    svg.replaceChildren();const width=800,height=330,left=70,right=765,top=35,bottom=280;
    const current=E.at(s,s.t),b=E.extent(s),v0=E.at(s,0).v,vT=E.at(s,s.T).v;
    let lo=kind==='x'?b.lo:Math.min(0,kind==='v'?Math.min(v0,vT):s.a),hi=kind==='x'?b.hi:Math.max(0,kind==='v'?Math.max(v0,vT):s.a);
    if(kind!=='x'){const pad=Math.max(.5,(hi-lo)*.15);lo-=pad;hi+=pad;}
    const x=t=>left+t/s.T*(right-left),y=v=>bottom-(v-lo)/(hi-lo)*(bottom-top),value=t=>E.at(s,t)[kind];
    const add=(tag,a,text)=>{const n=node(tag,a,text);svg.append(n);return n;};
    add('text',{x:12,y:22,fill:'#20324a'},kind==='x'?'x (m)':kind==='v'?'v (m/s)':'a (m/s²)');
    for(let i=0;i<=5;i++){const t=s.T*i/5,level=lo+(hi-lo)*i/5;add('line',{x1:x(t),y1:top,x2:x(t),y2:bottom,stroke:'#dce5ef'});add('text',{x:x(t),y:305,'text-anchor':'middle',fill:'#586b84'},F(t));add('line',{x1:left,y1:y(level),x2:right,y2:y(level),stroke:'#dce5ef'});add('text',{x:left-8,y:y(level)+5,'text-anchor':'end',fill:'#586b84'},F(level));}
    add('line',{x1:left,y1:y(0),x2:right,y2:y(0),stroke:'#8595aa'});add('text',{x:right,y:326,'text-anchor':'end'},'t (s)');
    const clipId=svg.id+'-clip',defs=add('defs',{}),clip=node('clipPath',{id:clipId});clip.append(node('rect',{x:left,y:top,width:right-left,height:bottom-top}));defs.append(clip);const plot=add('g',{'clip-path':`url(#${clipId})`});
    function inside(tag,a){plot.append(node(tag,a));}
    if(s.show.areas&&kind!=='x'){
      const regions=kind==='v'?E.interval(s,s.t1,s.t2).regions:[{left:s.t1,right:s.t2,area:s.a*(s.t2-s.t1)}];
      for(const r of regions)inside('polygon',{points:`${x(r.left)},${y(0)} ${x(r.left)},${y(value(r.left))} ${x(r.right)},${y(value(r.right))} ${x(r.right)},${y(0)}`,fill:r.area>=0?'#195eb1':'#b6383e','fill-opacity':.22});
    }
    let path='';for(let i=0;i<=160;i++){const t=s.T*(i/160);path+=`${i?'L':'M'}${x(t)},${y(value(t))} `;}inside('path',{d:path,fill:'none',stroke:kind==='a'?'#b6383e':'#195eb1','stroke-width':3});
    if(s.show.tangent&&kind!=='a'){
      const slope=kind==='x'?current.v:s.a,span=s.T*.12,tL=Math.max(0,s.t-span),tR=Math.min(s.T,s.t+span),val=value(s.t);
      inside('line',{x1:x(tL),y1:y(val+slope*(tL-s.t)),x2:x(tR),y2:y(val+slope*(tR-s.t)),stroke:'#7544ae','stroke-width':3});
      inside('polyline',{points:`${x(tL)},${y(val+slope*(tL-s.t))} ${x(tR)},${y(val+slope*(tL-s.t))} ${x(tR)},${y(val+slope*(tR-s.t))}`,fill:'none',stroke:'#7544ae','stroke-dasharray':'5 4'});
    }
    inside('line',{x1:x(s.t),y1:top,x2:x(s.t),y2:bottom,stroke:'#7544ae','stroke-dasharray':'5 4'});inside('circle',{cx:x(s.t),cy:y(value(s.t)),r:6,fill:'#7544ae'});
    add('text',{x:width/2,y:22,'text-anchor':'middle',fill:'#7544ae'},`t ≈ ${F(s.t)} s、${kind} ≈ ${F(value(s.t))} ${kind==='x'?'m':kind==='v'?'m/s':'m/s²'}`);
  }
  function motion(svg,s){
    svg.replaceChildren();const b=E.extent(s);b.lo=Math.min(0,b.lo);b.hi=Math.max(0,b.hi);const r=E.at(s,s.t),x=v=>60+(v-b.lo)/(b.hi-b.lo)*680;
    const add=(tag,a,text)=>svg.append(node(tag,a,text));
    add('line',{x1:60,y1:65,x2:740,y2:65,stroke:'#8595aa','stroke-width':2});
    for(let i=0;i<=4;i++){const val=b.lo+(b.hi-b.lo)*i/4;add('text',{x:x(val),y:92,'text-anchor':'middle'},F(val));}
    if(b.lo<0&&b.hi>0)add('line',{x1:x(0),y1:50,x2:x(0),y2:77,stroke:'#555'});
    if(r.x!==0){const dir=Math.sign(r.x),end=x(r.x);add('line',{x1:x(0),y1:43,x2:end,y2:43,stroke:'#7544ae','stroke-width':2});add('polyline',{points:`${end-dir*8},37 ${end},43 ${end-dir*8},49`,fill:'none',stroke:'#7544ae','stroke-width':2});}
    add('circle',{cx:x(r.x),cy:65,r:11,fill:'#7544ae'});
    add('text',{x:400,y:25,'text-anchor':'middle'},`位置 x ≈ ${F(r.x)} m（${s.vertical?'右側が上向きの正座標':'右向き正'}）`);
    for(const [val,label,color,y] of [[r.v,'v','#195eb1',127],[r.a,'a','#b6383e',169]]){
      const cx=400,dir=Math.sign(val),end=cx+dir*65;add('text',{x:60,y:y+5,fill:color},`${label} ≈ ${F(val)} ${label==='v'?'m/s':'m/s²'}：${dir===0?'0（向きなし）':s.vertical?dir>0?'上向き（正）':'下向き（負）':dir>0?'右向き（正）':'左向き（負）'}`);
      if(dir){add('line',{x1:cx,y1:y,x2:end,y2:y,stroke:color,'stroke-width':3});add('polyline',{points:`${end-dir*9},${y-6} ${end},${y} ${end-dir*9},${y+6}`,fill:'none',stroke:color,'stroke-width':3});}
    }
  }
  root.KinematicsDrawing={draw,motion};
})(window);
