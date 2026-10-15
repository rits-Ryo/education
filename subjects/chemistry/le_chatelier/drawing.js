(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const hi=Math.max(1,r.A,r.B,r.equilibrium.A,r.equilibrium.B)*1.2,v=S.scene(svg,[0,6,0,hi]);v.axis('変更直後 → 新平衡','濃度 mol/L');v.bar(.4,r.A,'直後N₂O₄',C[0]);v.bar(1.8,r.B,'直後NO₂',C[1]);v.bar(3.2,r.equilibrium.A,'平衡N₂O₄',C[0]);v.bar(4.6,r.equilibrium.B,'平衡NO₂',C[1]);
}
root.ChemistryDrawing={draw};
})(window);
