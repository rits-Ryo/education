(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const xmax=Math.max(50,s.Vb,r.equivalence*2),v=S.scene(svg,[0,xmax,0,14]);v.axis('塩基体積 (mL)','pH');v.curve(x=>root.ChemistryEngine.at(s.ca,s.Va,s.cb,x).pH);v.line([r.equivalence,0],[r.equivalence,14],C[2],true);v.point([s.Vb,r.pH],'現在',C[1]);v.line([0,6],[xmax,6],C[3],true);v.line([0,7.6],[xmax,7.6],C[3],true);
}
function second(svg,s,r,t=0){
const v=S.scene(svg);
v.node('rect',{x:v.sx(4.65),y:v.sy(9),width:v.sx(5.35)-v.sx(4.65),height:v.sy(6)-v.sy(9),fill:'#e9f3ff',stroke:'#7397c1','stroke-width':3});
v.line([5,6],[5,5.2],C[0]);v.text(5.7,7.5,'模式ビュレット',C[0],20);
const shape=[[4.6,4.8],[4.6,4],[2,1],[8,1],[5.4,4],[5.4,4.8]];v.node('polygon',{points:shape.map(p=>v.sx(p[0])+','+v.sy(p[1])).join(' '),fill:'#f8fbff',stroke:'#7397c1','stroke-width':3});
const level=Math.min(3.6,1.2+(s.Va+s.Vb)/150),width=3-(level-1)*2.6/3-.12;
v.node('polygon',{points:[[2.25,1.2],[7.75,1.2],[5+width,level],[5-width,level]].map(p=>v.sx(p[0])+','+v.sy(p[1])).join(' '),fill:'#aed4f5',opacity:.65});
v.text(2,.3,'フラスコ（模式）');v.text(.2,9.7,'混合全体積で濃度を計算',C[2],20);v.text(.2,5,'BTB 6.0〜7.6',C[3],20);
}
root.ChemistryDrawing={draw,second};
})(window);
