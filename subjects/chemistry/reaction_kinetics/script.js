(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"order": 1, "c0": 1, "k": 0.1, "t": 10, "Ea": 50, "T": 298.15},compute:E.calculate,draw:D.draw,latex:(s,r)=>['[A](t)&\\approx '+num(r.c)+'\\,\\mathrm{mol/L}','v&\\approx '+num(r.rate)+'\\,\\mathrm{mol\\,L^{-1}s^{-1}}','k(T)/k(298.15)&\\approx '+num(r.ratio),'t_{1/2}&'+(r.half===null?':'+txt('1次かつk>0のみ表示'):'\\approx '+num(r.half)+'\\,\\mathrm s')],describe:(s,r)=>'温度の相対kと固定kの濃度曲線を分けています。エネルギー図は概念的な経路です。',second:D.second});
})();
