(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[0,30,0,Math.max(1,r.total*1.1)]);v.axis('時間 s','濃度 mol/L');for(const [k,c] of [['A',C[0]],['B',C[1]]])v.curve(x=>root.ChemistryEngine.calculate({...s,t:x})[k],c);v.point([s.t,r.A],'A',C[0]);v.point([s.t,r.B],'B',C[1]);
}
function second(svg,s,r,t=0){
const v=S.scene(svg);v.vessel(1,1,2,5,.9,'A');v.vessel(7,1,2,5,.9,'B');v.particles(1.2,1.2,1.5,3,Math.min(24,r.A*8),'[A]',C[0]);v.particles(7.2,1.2,1.5,3,Math.min(24,r.B*8),'[B]',C[1]);if(r.total>0){v.point([3.5+(t%1)*3,4],'正反応',C[0]);v.point([6.5-(t%1)*3,3],'逆反応',C[1]);}
}
root.ChemistryDrawing={draw,second};
})(window);
