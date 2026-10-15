(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"kind": "FCC", "r": 0.1, "phi": 35, "tilt": 25},compute:E.calculate,draw:D.draw,latex:(s,r)=>['N&='+r.N,'\\text{配位数}&='+r.coord,'a&\\approx '+num(r.a)+'\\,\\mathrm{nm}','r&\\approx '+num(r.r)+'\\,\\mathrm{nm}','\\eta&\\approx '+num(r.packing*100)+'\\%','r/a&\\approx '+num(r.r/r.a)],describe:(s,r)=>'球模型の模式図です。数値は視点によらず一定です。',camera:true});
})();
