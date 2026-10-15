(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"metal": "Zn", "anodeC": 1, "cathodeC": 1, "mode": "standard"},compute:E.calculate,draw:D.draw,latex:(s,r)=>['E^\\circ&\\approx '+num(r.E0)+'\\,\\mathrm V','E&\\approx '+num(r.E)+'\\,\\mathrm V','Q&\\approx '+num(r.Q),'\\mathrm{'+r.anode+'}&\\to\\mathrm{'+r.anode+'}^{2+}+2e^-','\\mathrm{Cu}^{2+}+2e^-&\\to\\mathrm{Cu}'],describe:(s,r)=>'電子：'+r.anode+'からCuへ外部回路を流れます。標準電位は代表値、濃度近似は25℃です。'});
})();
