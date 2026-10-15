(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg);v.vessel(2,1,5,6,.9,'AB型水溶液');v.particles(2.3,2,2,3,r.equilibrium[0]===0?0:Math.max(1,20*r.equilibrium[0]/Math.max(...r.equilibrium,1e-10)),'A⁺（模式）',C[0]);v.particles(4.7,2,2,3,r.equilibrium[1]===0?0:Math.max(1,20*r.equilibrium[1]/Math.max(...r.equilibrium,1e-10)),'B⁻（模式）',C[1]);if(r.precipitate>0){v.line([2.3,1.3],[6.7,1.3],C[2],false,12);v.text(2.5,1.5,'AB沈殿',C[2]);}
}
root.ChemistryDrawing={draw};
})(window);
