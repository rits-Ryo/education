(function(root){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  function node(tag,attrs={},text){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e;}
  function extent(a,b,r){return Math.max(6,...a.map(Math.abs),...b.map(Math.abs),...(r.projection||[]).map(Math.abs))*1.18;}
  function draw(svg,state,r,range){
    svg.replaceChildren();
    const scale=270/range, p=v=>[320+v[0]*scale,320-v[1]*scale];
    const add=(t,a,s)=>{const e=node(t,a,s);svg.append(e);return e;};
    const line=(a,b,color,width=1,dash)=>{const x=p(a),y=p(b);add('line',{x1:x[0],y1:x[1],x2:y[0],y2:y[1],stroke:color,'stroke-width':width,...(dash?{'stroke-dasharray':dash}:{})});};
    const label=(v,text,color,dx=10,dy=-12)=>{const q=p(v),right=q[0]>440;add('text',{x:q[0]+(right?-Math.abs(dx):dx),y:Math.max(20,Math.min(620,q[1]+dy)),fill:color,'text-anchor':right?'end':'start'},text);};
    const arrow=(v,color,width=3)=>{line([0,0],v,color,width);const q=p(v),len=Math.hypot(q[0]-320,q[1]-320);if(len<1)return;const ux=(q[0]-320)/len,uy=(q[1]-320)/len;add('path',{d:`M ${q[0]-12*ux+5*uy} ${q[1]-12*uy-5*ux} L ${q[0]} ${q[1]} L ${q[0]-12*ux-5*uy} ${q[1]-12*uy+5*ux}`,fill:'none',stroke:color,'stroke-width':width});};
    const step=10**Math.floor(Math.log10(range/5));
    for(let i=-Math.floor(range/step);i<=Math.floor(range/step);i++){const x=i*step;line([x,-range],[x,range],'#e0e7ef');line([-range,x],[range,x],'#e0e7ef');if(i&&i%2===0){label([x,0],root.VectorEngine.format(x),'#64748b',-10,22);label([0,x],root.VectorEngine.format(x),'#64748b',7,5);}}
    line([-range,0],[range,0],'#8595aa',1.5);line([0,-range],[0,range],'#8595aa',1.5);label([range,0],'x','#53677d',8,-8);label([0,range],'y','#53677d',8,-8);label([0,0],'O','#20324a',-22,22);
    const u=r.unitA;
    if(u&&(state.show.projection||state.show.perpendicular)){line(u.map(x=>-range*x),u.map(x=>range*x),'#b9a8cc',1,'5 5');}
    if(r.projection&&state.show.perpendicular){line(state.b,r.projection,'#7b8491',1.8,'6 5');
      const d=state.b.map((x,i)=>x-r.projection[i]),n=Math.hypot(...d);
      if(n>0&&n*scale>14){const h=p(r.projection),perp=[d[0]/n,-d[1]/n],along=[u[0],-u[1]],s=11;add('path',{d:`M ${h[0]+along[0]*s} ${h[1]+along[1]*s} l ${perp[0]*s} ${perp[1]*s} l ${-along[0]*s} ${-along[1]*s}`,fill:'none',stroke:'#7b8491','stroke-width':1.5});}}
    if(state.show.components){for(const [v,c] of [[state.a,'#195eb1'],[state.b,'#b6383e']]){line([v[0],0],v,c,1,'3 5');line([0,v[1]],v,c,1,'3 5');}}
    if(r.angle!==null&&state.show.angle){const alpha=Math.atan2(-state.a[1],state.a[0]);const beta=Math.atan2(-state.b[1],state.b[0]);let delta=beta-alpha;while(delta>Math.PI)delta-=2*Math.PI;while(delta< -Math.PI)delta+=2*Math.PI;
      const radius=43,x=320+radius*Math.cos(alpha),y=320+radius*Math.sin(alpha),xx=320+radius*Math.cos(alpha+delta),yy=320+radius*Math.sin(alpha+delta);
      if(Math.abs(delta)>1e-15)add('path',{d:`M ${x} ${y} A ${radius} ${radius} 0 0 ${delta>=0?1:0} ${xx} ${yy}`,stroke:'#d49a20','stroke-width':2,fill:'none'});
      add('text',{x:320+74*Math.cos(alpha+delta/2),y:320+74*Math.sin(alpha+delta/2),fill:'#85600e','text-anchor':'middle'},`θ=${root.VectorEngine.format(r.angle)}°`);
      if(r.exactOrthogonal){const va=r.unitA,vb=r.unitB;const q=[va[0]*16,-va[1]*16],t=[vb[0]*16,-vb[1]*16];add('path',{d:`M ${320+q[0]} ${320+q[1]} l ${t[0]} ${t[1]} l ${-q[0]} ${-q[1]}`,fill:'none',stroke:'#85600e','stroke-width':2});}}
    arrow(state.a,'#195eb1');arrow(state.b,'#b6383e');
    if(r.projection&&state.show.projection){arrow(r.projection,'#7544ae',5);const h=p(r.projection);add('circle',{cx:h[0],cy:h[1],r:4,fill:'#7544ae'});label(r.projection,'H / OH','#7544ae',10,28);}
    for(const [key,color,name,offset] of [['a','#195eb1','A',-24],['b','#b6383e','B',-5]]){const v=state[key],q=p(v);label(v,name+(state.show.components?` (${v.map(root.VectorEngine.format).join(', ')})`:''),color,10,offset);
      // Separate overlapping zero / parallel endpoints into left/right hit halves.
      const same=Math.hypot(state.a[0]-state.b[0],state.a[1]-state.b[1])*scale<34;
      const h=add('circle',{cx:q[0]+(same?(key==='a'?-18:18):0),cy:q[1],r:17,fill:color,'fill-opacity':.18,stroke:color,class:'handle',tabindex:0,role:'button','aria-label':`ベクトル${key}の終点：矢印キーで移動`,'data-vector':key});
      if(same)add('line',{x1:q[0],y1:q[1],x2:Number(h.getAttribute('cx')),y2:q[1],stroke:color,'stroke-width':1});
    }
  }
  root.VectorDrawing={draw,extent};
})(window);
