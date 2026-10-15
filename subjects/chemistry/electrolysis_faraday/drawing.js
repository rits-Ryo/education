(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg);v.vessel(1,1,8,5,.85,'理想電解セル');v.line([2,2],[2,7],C[0],false,12);v.line([8,2],[8,7],C[1],false,12);v.text(.5,9,'陰極（−）：還元',C[0]);v.text(5.5,9,'陽極（＋）：酸化',C[1]);if(s.I>0)v.point([2,7-(t%2)*2],'e⁻',C[2]);if(s.kind==='copper'){if(r.mass>0)v.line([1.8,2],[1.8,2+Math.min(4,r.mass/40)],C[4],false,18);v.text(3,3,'Cu析出',C[4]);}else{v.particles(2,2,1,3,r.nH2>0?20:0,'H₂',C[0],t);v.particles(7,2,1,3,r.nO2>0?10:0,'O₂',C[1],t);}
}
root.ChemistryDrawing={draw};
})(window);
