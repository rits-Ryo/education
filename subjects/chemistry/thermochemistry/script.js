(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"kind": "exothermic", "direction": 1, "multiple": 1},compute:E.calculate,draw:D.draw,latex:(s,r)=>['\\Delta H&\\approx '+num(r.delta)+'\\,\\mathrm{kJ}','\\Delta H_1&\\approx '+num(r.steps[0])+'\\,\\mathrm{kJ}','\\Delta H_2&\\approx '+num(r.steps[1])+'\\,\\mathrm{kJ}','\\Delta H_1+\\Delta H_2&\\approx '+num(r.steps[0]+r.steps[1])+'\\,\\mathrm{kJ}'],describe:(s,r)=>r.delta<0?'発熱モデル。経路によらず生成物と反応物の差は同じです。':'吸熱モデル。経路によらず生成物と反応物の差は同じです。'});
})();
