(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[-3,3,-3,3]),points=r.points.map(p=>s.display==='model'?v.project(p,s.phi,s.tilt):p.slice(0,2));for(const [a,b,order] of r.bonds)v.bond(points[a],points[b],order,C[0]);points.forEach((p,i)=>{const a=r.atoms[i],h=r.hydrogens[i],label=a+(h?'H'+(h===1?'':h):'');if(s.display==='model')v.point(p,label,a==='O'?C[1]:C[0],18);else if(s.display!=='skeleton'||a!=='C')v.text(p[0]-.15,p[1]+.12,label,a==='O'?C[1]:C[0]);});v.text(-2.8,2.7,r.name);v.text(-2.8,-2.6,'官能基：'+r.group);
}
root.ChemistryDrawing={draw};
})(window);
