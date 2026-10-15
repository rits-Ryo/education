(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"mode": "nV", "unit": "L", "n": 1, "V": 2, "c": 0.5, "Vfinal": 5, "c1": 1, "V1": 0.1, "c2": 0, "V2": 0.4},compute:E.calculate,draw:D.draw,latex:(s,r)=>['n&\\approx '+num(r.n)+'\\,\\mathrm{mol}','V&\\approx '+num(r.V)+'\\,\\mathrm L','c&\\approx '+num(r.c)+'\\,\\mathrm{mol/L}','c_{\\rm diluted}&\\approx '+num(r.diluted)+'\\,\\mathrm{mol/L}','c_{\\rm mix}&\\approx '+num(r.mixed)+'\\,\\mathrm{mol/L}','n_{\\rm mix}&\\approx '+num(r.mixMol)+'\\,\\mathrm{mol}'],describe:(s,r)=>'容器の高さと点の個数は模式表示です。保存する量は溶質mol、混合は体積加成を仮定します。'});
})();
