(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[0,14,0,10]);v.line([0,5],[14,5],C[2]);for(let i=0;i<=14;i++)v.text(i,4.4,i,'#344b66',18);v.point([r.pH,5],'pH',C[1],14);v.text(0,8,'25℃・希薄水溶液');v.text(0,2,'pH 7より左：酸性／右：塩基性');
}
function second(svg,s,r,t=0){
const v=S.scene(svg,[0,4,-15,0]);v.axis('イオン','log₁₀(濃度/mol L⁻¹)');v.line([1,-15],[1,Math.log10(r.H)],C[0],false,14);v.line([3,-15],[3,Math.log10(r.OH)],C[1],false,14);v.text(.8,-1,'H⁺',C[0]);v.text(2.8,-1,'OH⁻',C[1]);
}
root.ChemistryDrawing={draw,second};
})(window);
