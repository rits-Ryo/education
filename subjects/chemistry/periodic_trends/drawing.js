(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[0,19,0,4.5]);v.axis('族','電気陰性度（Pauling）');r.comparison.forEach(e=>{if(e.en!==null)v.point([e.group,e.en],e.symbol,e.Z===s.Z?C[1]:C[0]);});
}
root.ChemistryDrawing={draw};
})(window);
