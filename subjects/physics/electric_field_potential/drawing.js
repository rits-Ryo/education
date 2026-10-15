(function(root){
  'use strict';
  const E=root.ElectricEngine,F=root.NumberDisplay.formatNonzero,cache=new WeakMap(),levels=[-20,-10,-5,-2,0,2,5,10,20];
  function node(tag,a={},text){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(a))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;}
  function draw(svg,canvas,s){
    const focused=document.activeElement?.getAttribute('data-handle');const range=s.range,scale=300/range,x=v=>350+v*scale,y=v=>350-v*scale,key=JSON.stringify([s.charges,range,s.show.vectors,s.show.lines,s.show.contours,s.show.heat,window.innerWidth<600]);let c=cache.get(svg);
    if(!c||c.key!==key){const layer=node('g'),add=(tag,a,text)=>{const n=node(tag,a,text);layer.append(n);return n;};
      const resolution=window.innerWidth<600?100:160;canvas.width=resolution;canvas.height=resolution;const ctx=canvas.getContext('2d'),image=ctx.createImageData(resolution,resolution);
      for(let j=0;j<resolution;j++)for(let i=0;i<resolution;i++){
        const px=(i+.5)/resolution*700,py=(j+.5)/resolution*700,p=[(px-350)/scale,(350-py)/scale],f=E.field(s.charges,p),n=(j*resolution+i)*4;
        let color=[248,251,255];if(s.show.heat&&px>=50&&px<=650&&py>=50&&py<=650&&!E.excluded(s.charges,p)&&f.defined){const t=Math.min(1,Math.abs(f.V)/20);color=f.V>=0?[248-210*t,251-130*t,255-60*t]:[248-60*t,251-180*t,255-180*t];}for(let k=0;k<3;k++)image.data[n+k]=color[k];image.data[n+3]=255;
      }ctx.putImageData(image,0,0);
      for(let i=-4;i<=4;i++){const v=range*i/4;add('line',{x1:x(v),y1:50,x2:x(v),y2:650,stroke:'#64748b','stroke-opacity':.22});add('line',{x1:50,y1:y(v),x2:650,y2:y(v),stroke:'#64748b','stroke-opacity':.22});add('text',{x:x(v),y:679,'text-anchor':'middle'},F(v));add('text',{x:42,y:y(v)+5,'text-anchor':'end'},F(v));}
      add('text',{x:620,y:698},'x (m)');add('text',{x:9,y:20},'y (m)');
      if(s.show.contours){for(const contour of E.contours(s.charges,levels,{range,resolution:window.innerWidth<600?64:96})){let d='';for(const [p,q] of contour.segments)d+=`M${x(p[0])},${y(p[1])}L${x(q[0])},${y(q[1])} `;add('path',{d,fill:'none',stroke:'#126b4b','stroke-width':1.5,'stroke-dasharray':'5 3','data-level':contour.level});}}
      function arrow(p,field,length,color,width=1.5){const norm=Math.hypot(field.Ex,field.Ey);if(!norm)return;const dx=field.Ex/norm,dy=-field.Ey/norm,cx=x(p[0]),cy=y(p[1]),ex=cx+dx*length/2,ey=cy+dy*length/2;
        add('path',{d:`M${cx-dx*length/2},${cy-dy*length/2}L${ex},${ey}M${ex-dx*6-dy*3},${ey-dy*6+dx*3}L${ex},${ey}L${ex-dx*6+dy*3},${ey-dy*6-dx*3}`,fill:'none',stroke:color,'stroke-width':width});}
      if(s.show.vectors)for(let i=-5;i<=5;i++)for(let j=-5;j<=5;j++){const p=[i*range/6,j*range/6];if(E.excluded(s.charges,p,.3))continue;const f=E.field(s.charges,p);if(f.defined&&f.magnitude>0)arrow(p,f,Math.min(32,8+8*Math.log1p(f.magnitude)),'#25364c');}
      if(s.show.lines){const positive=s.charges.filter(q=>q.q>0),sources=positive.length?positive:s.charges.filter(q=>q.q<0),direction=positive.length?1:-1;
        for(const source of sources)for(let i=0;i<12;i++){const theta=i*Math.PI/6,start=[source.x+.17*Math.cos(theta),source.y+.17*Math.sin(theta)],line=E.trace(s.charges,start,{range,step:Math.min(.05,range/150),direction,maxSteps:800});if(line.points.length<2)continue;
          add('polyline',{points:line.points.map(p=>`${x(p[0])},${y(p[1])}`).join(' '),fill:'none',stroke:'#344456','stroke-opacity':.8,'stroke-width':1.5});
          for(let n=20;n<line.points.length;n+=70){const p=line.points[n],f=E.field(s.charges,p);if(f.defined)arrow(p,f,12,'#25364c',2);}
        }
      }
      for(const charge of s.charges)if(charge.q!==0)add('circle',{cx:x(charge.x),cy:y(charge.y),r:E.EXCLUSION*scale,fill:'#f8fbff',stroke:'#8595aa','stroke-dasharray':'3 2'});
      c={key,layer};cache.set(svg,c);
    }
    svg.replaceChildren();svg.append(c.layer);
    const add=(tag,a,text)=>svg.append(node(tag,a,text));
    for(let i=0;i<s.charges.length;i++){const q=s.charges[i],color=q.q>0?'#195eb1':q.q<0?'#b6383e':'#64748b';let px=x(q.x),py=y(q.y);const overlap=s.charges.length===2&&Math.hypot(s.charges[0].x-s.charges[1].x,s.charges[0].y-s.charges[1].y)*scale<30;
      if(overlap){const offset=i?18:-18;add('line',{x1:px,y1:py,x2:px+offset,y2:py,stroke:color});px+=offset;}
      if(px<50||px>650||py<50||py>650){add('text',{x:350,y:25+20*i,'text-anchor':'middle',fill:color},`q${i+1}は表示範囲外（位置入力または半幅で変更）`);continue;}
      add('circle',{cx:px,cy:py,r:14,fill:color,stroke:'#fff','stroke-width':2,tabindex:0,role:'button',class:'handle','data-handle':String(i),'aria-label':`電荷${i+1}：ドラッグまたは矢印キーで移動`});
      add('text',{x:px,y:py+5,'text-anchor':'middle',fill:'#fff','pointer-events':'none'},q.q>0?'+':q.q<0?'−':'0');
      add('text',{x:Math.max(90,Math.min(570,px+(i?35:-35))),y:Math.max(35,Math.min(635,py-22)),'text-anchor':'middle',fill:color},`q${i+1} ≈ ${F(q.q)} nC`);
    }
    const px=x(s.p[0]),py=y(s.p[1]);if(px>=50&&px<=650&&py>=50&&py<=650){add('circle',{cx:px,cy:py,r:12,fill:'#7544ae',stroke:'#fff','stroke-width':2,tabindex:0,role:'button',class:'handle','data-handle':'P','aria-label':'観測点P：ドラッグまたは矢印キーで移動'});add('text',{x:px+16,y:py+25,fill:'#7544ae'},'P');}else add('text',{x:350,y:25,'text-anchor':'middle',fill:'#7544ae'},'観測点Pは表示範囲外');
    if(focused!==null&&focused!==undefined)svg.querySelector('[data-handle="'+focused+'"]')?.focus();
  }
  root.ElectricDrawing={draw,levels,fromPixel:(px,py,range)=>[(px-350)*range/300,(350-py)*range/300]};
})(window);
