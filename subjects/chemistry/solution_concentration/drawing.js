(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg),level=x=>Math.min(.9,.2+.1*x);v.vessel(1,1,2,6,level(r.V),'希釈前');v.vessel(5,1,2,6,level(s.Vfinal),'希釈後');v.particles(1.2,1.2,1.5,4,Math.min(30,r.n*20),'溶質mol保存',C[0]);v.particles(5.2,1.2,1.5,4,Math.min(30,r.n*20),'同じmol',C[0]);
}
root.ChemistryDrawing={draw};
})(window);
