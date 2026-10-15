(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"kind": "acid", "c": 0.001, "dilution": 1},compute:E.calculate,draw:D.draw,latex:(s,r)=>['[\\mathrm H^+]&\\approx '+num(r.H)+'\\,\\mathrm{mol/L}','[\\mathrm{OH}^-]&\\approx '+num(r.OH)+'\\,\\mathrm{mol/L}','\\mathrm{pH}&\\approx '+num(r.pH),'c_{\\rm effective}&\\approx '+num(r.effective)+'\\,\\mathrm{mol/L}'],describe:(s,r)=>'自己解離を含めています。濃厚溶液や25℃以外は対象外です。',second:D.second});
})();
