(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"A": 1e-05, "B": 1e-05, "Ksp": 1.8e-10, "common": 0},compute:E.calculate,draw:D.draw,latex:(s,r)=>['Q_{sp}&\\approx '+num(r.Q),'K_{sp}&\\approx '+num(s.Ksp),'x&\\approx '+num(r.precipitate)+'\\,\\mathrm{mol/L}','([A],[B])_{\\rm after}&\\approx('+r.equilibrium.map(num).join(',')+')\\,\\mathrm{mol/L}','s_{\\rm pure}&\\approx '+num(r.solubility)+'\\,\\mathrm{mol/L}','s_{\\rm common}&\\approx '+num(r.withCommon)+'\\,\\mathrm{mol/L}'],describe:(s,r)=>r.condition+'。量は物質収支を解き、図は模式表示です。'});
})();
