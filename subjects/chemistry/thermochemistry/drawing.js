(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const lo=Math.min(...r.levels)-30,hi=Math.max(...r.levels)+30,v=S.scene(svg,[0,4,lo,hi]);v.axis('経路上の状態','相対H (kJ/記述反応mol)');r.levels.forEach((h,i)=>{v.line([i+.3,h],[i+1,h],C[i],false,5);v.text(i+.3,h+5,['反応物','中間','生成物'][i]);});v.line([.65,r.levels[0]],[2.65,r.levels[2]],C[3],true);v.line([.65,r.levels[0]],[1.65,r.levels[1]],C[2]);v.line([1.65,r.levels[1]],[2.65,r.levels[2]],C[2]);
}
root.ChemistryDrawing={draw};
})(window);
