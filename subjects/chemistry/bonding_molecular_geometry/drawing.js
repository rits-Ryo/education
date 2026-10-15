(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[-2.3,2.3,-2.3,2.3]),points=r.points.map(p=>v.project(p,s.phi,s.tilt));for(const [a,b,order] of r.bonds)v.bond(points[a],points[b],order,C[2]);points.forEach((p,i)=>v.point(p,r.atoms[i],r.atoms[i].startsWith('H')?C[0]:C[1],r.atoms[i]==='H'?12:20));if(s.kind==='metal')for(let i=0;i<r.electrons;i++)v.point([-.75+(i%4)*.5,-.75+Math.floor(i/4)*1.5],'e⁻',C[2],5);
}
function second(svg,s,r,t=0){
const v=S.scene(svg,[-3,3,-3,3]);if(s.kind==='NaCl'||s.kind==='metal'){v.text(-2.5,0,s.kind==='NaCl'?'Na⁺ と Cl⁻ の結晶（分子ではない）':'M⁺ と広がった電子（分子ではない）');return;}const points=r.points.map(p=>[p[0],p[1]]);if(s.kind==='CH4')points.splice(0,5,[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]);if(s.kind==='NH3')points.splice(0,4,[0,0],[1.5,0],[-1.5,0],[0,-1.5]);for(const [a,b,order] of r.bonds)v.bond(points[a],points[b],order,C[0]);points.forEach((p,i)=>{v.text(p[0]-.12,p[1]-.1,r.atoms[i]);for(let l=0;l<(r.lone[i]||0);l++){const a=s.kind==='H2O'?(225+90*l)*Math.PI/180:s.kind==='NH3'?Math.PI/2:s.kind==='CO2'?(90+180*l)*Math.PI/180:Math.atan2(p[1],p[0])+[0,Math.PI/2,-Math.PI/2][l],x=p[0]+.5*Math.cos(a),y=p[1]+.5*Math.sin(a);v.point([x-.055,y],'',C[2],3);v.point([x+.055,y],'',C[2],3);}});v.text(-2.8,2.6,'ルイス式：線＝結合、点2個＝孤立電子対');
}
root.ChemistryDrawing={draw,second};
})(window);
