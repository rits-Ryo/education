(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const hi=Math.max(1,s.n1,s.n2,r.product),v=S.scene(svg,[0,6,0,hi*1.3]);v.axis('物質','mol');v.bar(.4,s.n1,r.reaction.reactants[0],C[0]);v.bar(1.5,s.n2,r.reaction.reactants[1],C[1]);v.bar(2.8,r.product,r.reaction.product,C[2]);v.bar(4,r.left[0],'残1',C[3]);v.bar(5,r.left[1],'残2',C[4]);
}
root.ChemistryDrawing={draw};
})(window);
