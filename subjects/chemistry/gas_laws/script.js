(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"law": "boyle", "n": 1, "V": 22.414, "P": 101.325, "temperature": 273.15, "unit": "K"},compute:E.calculate,draw:D.draw,latex:(s,r)=>['T&\\approx '+num(r.T)+'\\,\\mathrm K','P&\\approx '+num(r.P/1000)+'\\,\\mathrm{kPa}','V&\\approx '+num(r.V*1000)+'\\,\\mathrm L','n&\\approx '+num(r.n)+'\\,\\mathrm{mol}'],describe:(s,r)=>r.fixed+'。粒子模型の速度は温度の平方根に関連付けた模式表示です。',second:D.second});
})();
