(function(root){
'use strict';
const NS='http://www.w3.org/2000/svg',colors=['#226bd6','#d45465','#8751bf','#168775','#aa680c'];
function scene(svg,bounds=[0,10,0,10]){
 svg.replaceChildren();const [xmin,xmax,ymin,ymax]=bounds,sx=x=>65+(x-xmin)*500/(xmax-xmin),sy=y=>570-(y-ymin)*500/(ymax-ymin);
 function node(tag,attrs={},content){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs)){if(typeof v==='number'&&!Number.isFinite(v))throw Error('描画座標が有限でありません');n.setAttribute(k,v);}if(content!==undefined)n.textContent=content;svg.append(n);return n;}
 function text(x,y,s,color='#344b66',size=22){return node('text',{x:sx(x),y:sy(y),fill:color,'font-size':size},s);}
 function line(P,Q,color=colors[0],dash=false,width=3){return node('line',{x1:sx(P[0]),y1:sy(P[1]),x2:sx(Q[0]),y2:sy(Q[1]),stroke:color,'stroke-width':width,...(dash?{'stroke-dasharray':'6 5'}:{})});}
 function bond(P,Q,order,color=colors[0]){const dx=Q[0]-P[0],dy=Q[1]-P[1],len=Math.hypot(dx,dy),normal=len>1e-12?[-dy/len,dx/len]:[0,0];for(let k=0;k<order;k++){const delta=(k-(order-1)/2)*.13;line(P.map((x,i)=>x+delta*normal[i]),Q.map((x,i)=>x+delta*normal[i]),color,false,4);}}
 function point(P,label='',color=colors[0],r=8){node('circle',{cx:sx(P[0]),cy:sy(P[1]),r,fill:color,stroke:'#fff','stroke-width':1});if(label)text(P[0]+(xmax-xmin)*.025,P[1]+(ymax-ymin)*.025,label,color);}
 function curve(fn,color=colors[0]){let d='',active=false;for(let i=0;i<=300;i++){const x=xmin+(xmax-xmin)*i/300,y=fn(x);if(!Number.isFinite(y)||y<ymin||y>ymax){active=false;continue;}d+=(active?'L':'M')+sx(x)+' '+sy(y)+' ';active=true;}node('path',{d,fill:'none',stroke:color,'stroke-width':3});}
 function axis(xLabel,yLabel){for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;line([x,ymin],[x,ymax],'#e3eaf4',false,1);line([xmin,y],[xmax,y],'#e3eaf4',false,1);node('text',{x:sx(x),y:598,'font-size':19,'text-anchor':'middle'},root.NumberDisplay.formatNonzero(x));node('text',{x:60,y:sy(y),'font-size':18,'text-anchor':'end'},root.NumberDisplay.formatNonzero(y));}text(xmin+(xmax-xmin)*.5,ymin-(ymax-ymin)*.1,xLabel,'#344b66',20);node('text',{x:15,y:35,'font-size':20},yLabel);}
 function bar(x,value,label,color=colors[0]){node('rect',{x:sx(x),y:sy(Math.max(0,value)),width:Math.abs(sx(x+.65)-sx(x)),height:Math.abs(sy(value)-sy(0)),fill:color,opacity:.75});text(x,0,label,color,20);}
 function vessel(x,y,width,height,level,label){node('rect',{x:sx(x),y:sy(y+height),width:sx(x+width)-sx(x),height:sy(y)-sy(y+height),fill:'#edf5ff',stroke:'#7397c1','stroke-width':3});node('rect',{x:sx(x)+2,y:sy(y+height*level),width:sx(x+width)-sx(x)-4,height:sy(y)-sy(y+height*level),fill:'#aed4f5',opacity:.65});text(x,y-.45,label);}
 function particles(x,y,w,h,count,label,color=colors[0],time=0){const shown=Math.min(36,Math.max(0,Math.round(count)));for(let i=0;i<shown;i++){const xx=x+w*((i*.61803398875+time*.08)%1),yy=y+h*((i*.41421356+time*.13)%1);point([xx,yy],'',color,5);}text(x,y+h+.35,label,color,20);}
 function project(p,phi=0,tilt=0){const a=phi*Math.PI/180,b=tilt*Math.PI/180,x=Math.cos(a)*p[0]-Math.sin(a)*p[1],front=Math.sin(a)*p[0]+Math.cos(a)*p[1];return [x,Math.cos(b)*p[2]-Math.sin(b)*front];}
 return {node,text,line,bond,point,curve,axis,bar,vessel,particles,project,sx,sy,bounds};
}
root.ChemistrySVG={scene,colors};
})(window);
