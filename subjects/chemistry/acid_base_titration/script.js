(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"ca": 0.1, "Va": 25, "cb": 0.1, "Vb": 0},compute:E.calculate,draw:D.draw,latex:(s,r)=>['V_{\\rm eq}&\\approx '+num(r.equivalence)+'\\,\\mathrm{mL}','V_{\\rm total}&\\approx '+num(r.total*1000)+'\\,\\mathrm{mL}','n_a-n_b&\\approx '+num(r.excess)+'\\,\\mathrm{mol}','\\mathrm{pH}&\\approx '+num(r.pH)],describe:(s,r)=>r.excess>0?'酸が過剰です。':r.excess<0?'塩基が過剰です。':'当量点です。',second:D.second});
})();
