(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"kind": "water", "mode": "mol", "value": 1, "M": 18.015, "n1": 2, "n2": 1},compute:E.calculate,draw:D.draw,latex:(s,r)=>['n&\\approx '+num(r.n)+'\\,\\mathrm{mol}','N&\\approx '+num(r.N),'m&\\approx '+num(r.m)+'\\,\\mathrm g','\\xi&\\approx '+num(r.extent)+'\\,\\mathrm{mol}','\\text{生成物量}&\\approx '+num(r.product)+'\\,\\mathrm{mol}','\\text{反応物残量}&\\approx('+r.left.map(num).join(',')+')\\,\\mathrm{mol}'],describe:(s,r)=>'反応物ラベルは選択した反応の順です。棒は初期量・生成可能量・余剰を示します。'});
})();
