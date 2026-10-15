(function(root){
'use strict';
const NS='http://www.w3.org/2000/svg',colors={a:'#226bd6',b:'#db5262',c:'#8751bf',green:'#159070'};
function scene(svg,bounds=[-6,6,-6,6]){
 svg.replaceChildren();const [xmin,xmax,ymin,ymax]=bounds,pad=50,W=540,H=540;
 const tick=value=>{if(Math.abs(value)>=1e6){const [m,e]=value.toExponential().split('e');return root.NumberDisplay.formatScientific(Number(m),Number(e));}return root.NumberDisplay.formatNonzero(value);};
 const sx=x=>pad+(x-xmin)/(xmax-xmin)*W,sy=y=>590-(y-ymin)/(ymax-ymin)*H;
 function node(tag,attrs={}){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));svg.append(n);return n;}
 function text(x,y,s,color='#536780'){const n=node('text',{x:sx(x),y:sy(y),'font-size':22,fill:color});n.textContent=s;return n;}
 function line(P,Q,color='#b9c8da',dash=false,width=2){return node('line',{x1:sx(P[0]),y1:sy(P[1]),x2:sx(Q[0]),y2:sy(Q[1]),stroke:color,'stroke-width':width,...(dash?{'stroke-dasharray':'6 5'}:{})});}
 function path(points,color=colors.a,width=3,fill='none'){let d='';for(const p of points){if(!p||!p.every(Number.isFinite)){d+=' ';continue;}d+=(d&& !d.endsWith(' ')?'L':'M')+sx(p[0])+' '+sy(p[1])+' ';d=d.trimEnd();}return node('path',{d,fill,stroke:color,'stroke-width':width,'stroke-linejoin':'round'});}
 function curve(fn,color=colors.a,breakAt=[]){let d='',active=false;for(let i=0;i<=600;i++){const x=xmin+(xmax-xmin)*i/600,y=fn(x),prev=xmin+(xmax-xmin)*(i-1)/600;if(y===null||!Number.isFinite(y)||y<ymin||y>ymax||breakAt.some(a=>prev<=a&&x>=a)){active=false;continue;}d+=(active?'L':'M')+sx(x)+' '+sy(y)+' ';active=true;}return node('path',{d,fill:'none',stroke:color,'stroke-width':3});}
 function point(P,label='',color=colors.a,handle=null,open=false){if(!P||!P.every(Number.isFinite)||P[0]<xmin||P[0]>xmax||P[1]<ymin||P[1]>ymax)return null;const n=node('circle',{cx:sx(P[0]),cy:sy(P[1]),r:handle?12:6,fill:open?'#fff':color,stroke:color,'stroke-width':2});if(handle){const hit=node('circle',{cx:sx(P[0]),cy:sy(P[1]),r:44,fill:'transparent',stroke:'transparent'});hit.setAttribute('data-handle',handle);hit.setAttribute('tabindex','0');hit.setAttribute('role','button');hit.setAttribute('aria-label',label+'をドラッグまたは矢印キーで移動');}if(label)text(P[0]+(xmax-xmin)*.025,P[1]+(ymax-ymin)*.025,label,color);return n;}
 function arrow(P,Q,color=colors.a,dash=false,width=3){line(P,Q,color,dash,width);const x=sx(Q[0]),y=sy(Q[1]),dx=x-sx(P[0]),dy=y-sy(P[1]),length=Math.hypot(dx,dy);if(length<1)return;const ux=dx/length,uy=dy/length;node('polygon',{points:`${x},${y} ${x-16*ux+7*uy},${y-16*uy-7*ux} ${x-16*ux-7*uy},${y-16*uy+7*ux}`,fill:color});}
 function circle(P,r,color=colors.c){return node('ellipse',{cx:sx(P[0]),cy:sy(P[1]),rx:r/(xmax-xmin)*W,ry:r/(ymax-ymin)*H,fill:'none',stroke:color,'stroke-width':2});}
 function polygon(points,color=colors.a){return node('polygon',{points:points.map(p=>sx(p[0])+','+sy(p[1])).join(' '),fill:color,'fill-opacity':.12,stroke:color,'stroke-width':2});}
 function axes(labels=['x','y']){for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;line([x,ymin],[x,ymax],'#e3ebf5');line([xmin,y],[xmax,y],'#e3ebf5');const xx=node('text',{x:sx(x),y:615,'font-size':20,'text-anchor':'middle',fill:'#536780'});xx.textContent=tick(x);const yy=node('text',{x:44,y:sy(y)+5,'font-size':20,'text-anchor':'end',fill:'#536780'});yy.textContent=tick(y);}
 if(ymin<=0&&ymax>=0)line([xmin,0],[xmax,0],'#8a9cb3');if(xmin<=0&&xmax>=0)line([0,ymin],[0,ymax],'#8a9cb3');text(xmax,ymin,labels[0]);text(xmin,ymax,labels[1]);}
 function world(event){const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse());return [xmin+(pt.x-pad)/W*(xmax-xmin),ymin+(590-pt.y)/H*(ymax-ymin)];}
 return {node,text,line,path,curve,point,circle,polygon,arrow,axes,world,sx,sy,bounds};
}
function draw(svg,s,g){const extent=Math.max(6,...g.product.map(Math.abs),...g.sum.map(Math.abs),Math.hypot(s.a,s.b)*g.lengths[1])*1.1,v=scene(svg,[-extent,extent,-extent,extent]);v.axes(['実部','虚部']);const z=[s.a,s.b],w=[s.c,s.d];v.arrow([0,0],z,colors.a);v.arrow([0,0],w,colors.b);v.point(z,'z₁',colors.a,'z1');v.point(w,'z₂',colors.b,'z2');let p=s.mode==='sum'?g.sum:Number(s.stage)===0?z:Number(s.stage)===1?z.map(x=>x*g.lengths[1]):g.product;v.arrow([0,0],p,colors.c,false,4);v.point(p,s.mode==='sum'?'和':Number(s.stage)===2?'積':'段階'+s.stage,colors.c);if(s.mode==='sum'){v.line(z,g.sum,colors.b,true);v.line(w,g.sum,colors.a,true);}v.point(g.conjugate,'共役z₁',colors.green,null,true);return v;}
root.LessonDrawing={scene,draw,colors};
})(window);
