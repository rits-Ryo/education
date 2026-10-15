(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[0,5,0,Math.max(.1,r.total*1.2)]);v.axis('緩衝成分','mol');v.bar(1,r.HA,'HA',C[0]);v.bar(3,r.A,'A⁻',C[1]);
}
root.ChemistryDrawing={draw};
})(window);
