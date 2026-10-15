(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[0,230,-30,160]);v.axis('熱量（モデル単位）','温度（模式℃）');v.curve(x=>root.ChemistryEngine.heating(x).T);v.point([s.Q,r.T],r.phase,C[1]);
}
function second(svg,s,r,t=0){
const v=S.scene(svg,[-50,200,.1,5]);v.axis('温度（模式℃）','圧力（モデル単位）');v.curve(x=>x<0?Math.exp(x/50):Math.exp(x/100),C[1]);v.line([0,1],[4,5],C[2]);v.point([0,1],'三重点',C[3]);v.point([s.pointT,s.pointP],r.region,C[0]);
}
root.ChemistryDrawing={draw,second};
})(window);
