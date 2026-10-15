(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg);v.text(.5,8,r.oxidation,C[0]);v.text(.5,7,r.reduction,C[1]);v.vessel(.5,1,3,4,.7,'酸化側');v.vessel(6,1,3,4,.7,s.kind==='iron'?'外部へ電子':'還元側');for(let i=0;i<r.electrons;i++)v.point([3.7+((t*.4+i/r.electrons)%1)*2,4+(i%2)*.3],'',C[2],6);v.text(3.8,5,'e⁻：'+r.electrons,C[2]);
}
root.ChemistryDrawing={draw};
})(window);
