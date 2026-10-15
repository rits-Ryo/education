(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg);v.vessel(.4,1,3.2,5,.8,r.anode+'側');v.vessel(6,1,3.2,5,.8,'Cu側');v.line([2,2],[2,7],C[0],false,12);v.line([7.6,2],[7.6,7],C[1],false,12);v.line([2,7],[7.6,7],C[2]);v.point([2+(t%2)/2*5.6,7],'e⁻',C[2]);v.text(.2,9,'負極：'+r.anode+' → '+r.anode+'²⁺+2e⁻',C[0],20);v.text(.2,8,'正極：Cu²⁺+2e⁻ → Cu',C[1],20);v.line([3.6,4.5],[6,4.5],C[3],true);v.text(3.7,5,'塩橋',C[3]);v.text(.5,.3,'← 陰イオン／陽イオン →',C[3],20);
}
root.ChemistryDrawing={draw};
})(window);
