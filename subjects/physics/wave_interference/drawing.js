(function(root){
  'use strict';
  const E=root.WaveEngine,F=root.NumberDisplay.formatNonzero;
  const cache=new WeakMap();
  function node(tag,attrs={},text){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;}
  const mx=x=>(x+8)*50,my=y=>(6-y)*50;
  function map(canvas,s){
    const width=window.innerWidth<600?120:180,height=width*3/4,key=JSON.stringify([s.lambda,s.f,s.A,s.phase,s.d,width]);let c=cache.get(canvas);
    if(!c||c.key!==key){canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d'),image=ctx.createImageData(width,height),p1=new Float64Array(width*height),p2=new Float64Array(width*height),amp=new Float64Array(width*height);const k=E.TAU/s.lambda;
      for(let j=0;j<height;j++)for(let i=0;i<width;i++){const x=-8+(i+.5)/width*16,y=6-(j+.5)/height*12,n=j*width+i;p1[n]=-k*Math.hypot(x+s.d/2,y)+s.phase;p2[n]=-k*Math.hypot(x-s.d/2,y);amp[n]=Math.abs(Math.cos((p1[n]-p2[n])/2));}c={key,ctx,image,p1,p2,amp};cache.set(canvas,c);}
    const omega=E.TAU*s.f*s.t,data=c.image.data;
    for(let n=0;n<c.p1.length;n++){const ratio=s.A===0?0:s.mode==='amplitude'?c.amp[n]:(Math.sin(omega+c.p1[n])+Math.sin(omega+c.p2[n]))/2;let red,green,blue;
      if(s.mode==='amplitude'){red=245-130*ratio;green=245-175*ratio;blue=250-40*ratio;}else{const r=Math.abs(ratio);red=ratio>=0?245-205*r:245-55*r;green=245-160*r;blue=ratio>=0?250-65*r:250-180*r;}
      if(s.regions&&s.A>0){if(c.amp[n]>.995){red*=.58;green*=.58;blue*=.58;}else if(c.amp[n]<.06){red=255;green=255;blue=255;}}
      data[n*4]=red;data[n*4+1]=green;data[n*4+2]=blue;data[n*4+3]=255;
    }c.ctx.putImageData(c.image,0,0);
  }
  function plane(svg,s){const focused=document.activeElement?.getAttribute('data-point');svg.replaceChildren();const add=(tag,a,text)=>svg.append(node(tag,a,text));
    for(let x=-8;x<=8;x+=2){add('line',{x1:mx(x),y1:0,x2:mx(x),y2:600,stroke:'#64748b','stroke-opacity':.18});add('text',{x:Math.max(18,Math.min(782,mx(x))),y:590,'text-anchor':'middle'},F(x));}
    for(let y=-6;y<=6;y+=2){add('line',{x1:0,y1:my(y),x2:800,y2:my(y),stroke:'#64748b','stroke-opacity':.18});add('text',{x:5,y:Math.max(18,Math.min(573,my(y)))},F(y));}
    add('text',{x:735,y:576},'x (m)');add('text',{x:5,y:22},'y (m)');
    for(const [x,phase,color,name] of [[-s.d/2,s.phase,'#195eb1','S₁'],[s.d/2,0,'#b6383e','S₂']]){
      const source=[mx(x),my(0)];add('line',{x1:source[0],y1:source[1],x2:mx(s.p[0]),y2:my(s.p[1]),stroke:color,'stroke-dasharray':'6 4','stroke-width':2});
      if(s.mode==='displacement'&&s.A>0){const cycles=s.f*s.t+phase/E.TAU-.25;for(let n=Math.ceil(cycles-20/s.lambda);n<=Math.floor(cycles);n++){const radius=(cycles-n)*s.lambda*50;if(radius>0)add('circle',{cx:source[0],cy:source[1],r:radius,fill:'none',stroke:color,'stroke-opacity':.27});}}
      add('circle',{cx:source[0],cy:source[1],r:8,fill:color,stroke:'#fff','stroke-width':2});add('text',{x:source[0]+(name==='S₁'?-28:12),y:source[1]+26,fill:color},name);
    }
    add('circle',{cx:mx(s.p[0]),cy:my(s.p[1]),r:14,fill:'#7544ae',stroke:'#fff','stroke-width':2,tabindex:0,role:'button',class:'handle','data-point':'P','aria-label':'観測点P：ドラッグまたは矢印キーで移動'});
    add('text',{x:Math.max(25,Math.min(680,mx(s.p[0])+18)),y:Math.max(35,Math.min(570,my(s.p[1])-18)),fill:'#5d338e'},'P');
    if(focused==='P')svg.querySelector('[data-point="P"]')?.focus();
  }
  function time(svg,s){svg.replaceChildren();const add=(tag,a,text)=>svg.append(node(tag,a,text)),T=4/s.f,left=65,right=765,top=35,bottom=280,scale=Math.max(.5,2*s.A)*1.15,x=t=>left+t/T*(right-left),y=u=>(top+bottom)/2-u/scale*(bottom-top)/2;
    for(let i=0;i<=4;i++){const t=T*i/4;add('line',{x1:x(t),y1:top,x2:x(t),y2:bottom,stroke:'#dce5ef'});add('text',{x:x(t),y:307,'text-anchor':'middle'},F(t));const v=(i-2)*scale/2;add('text',{x:55,y:y(v)+5,'text-anchor':'end'},F(v));}
    add('line',{x1:left,y1:y(0),x2:right,y2:y(0),stroke:'#8595aa'});add('text',{x:10,y:20},'u (cm)');add('text',{x:right,y:327,'text-anchor':'end'},'t (s)');
    for(const [kind,color] of [['u1','#195eb1'],['u2','#b6383e'],['u','#7544ae']]){let d='';for(let i=0;i<=240;i++){const t=T*i/240;d+=`${i?'L':'M'}${x(t)},${y(E.at(s,s.p,t)[kind])} `;}add('path',{d,fill:'none',stroke:color,'stroke-width':kind==='u'?3:2});const r=E.at(s,s.p,s.t);add('circle',{cx:x(s.t),cy:y(r[kind]),r:5,fill:color});}
    add('line',{x1:x(s.t),y1:top,x2:x(s.t),y2:bottom,stroke:'#7544ae','stroke-dasharray':'5 4'});add('text',{x:400,y:22,'text-anchor':'middle'},`Pの時間波形（4周期）、現在 t ≈ ${F(s.t)} s`);
  }
  root.WaveDrawing={map,plane,time,fromPixel:(x,y)=>[x/50-8,6-y/50]};
})(window);
