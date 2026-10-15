(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[0,100,0,Math.max(.1,s.c0*1.2)]);v.axis('t (s)','[A] (mol/L)');v.curve(x=>root.ChemistryEngine.concentration(s.order,s.c0,s.k,x));v.point([s.t,r.c],'現在',C[1]);
}
function second(svg,s,r,t=0){
const v=S.scene(svg,[0,1,-25,Math.max(30,s.Ea+10)]);v.axis('反応座標（模式）','相対エネルギー (kJ/mol)');v.curve(x=>root.ChemistryEngine.energy(x,s.Ea),C[1]);v.curve(x=>root.ChemistryEngine.energy(x,s.Ea,.6),C[3]);v.text(.1,0,'同じ始点・終点：ΔH一定',C[2],20);v.text(.1,s.Ea*.7,'赤：非触媒／緑：触媒モデル',C[1],20);
}
root.ChemistryDrawing={draw,second};
})(window);
