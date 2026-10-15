(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"V": 1, "T": 298.15, "add": 0, "kind": "A"},compute:E.calculate,draw:D.draw,latex:(s,r)=>['Q_{\\rm immediate}&\\approx '+num(r.Q),'K(T)&\\approx '+num(r.K),'([\\mathrm{N_2O_4}],[\\mathrm{NO_2}])_{\\rm eq}&\\approx('+num(r.equilibrium.A)+','+num(r.equilibrium.B)+')\\,\\mathrm{mol/L}','2n(\\mathrm{N_2O_4})+n(\\mathrm{NO_2})&\\approx '+num(r.inventory)+'\\,\\mathrm{mol}'],describe:(s,r)=>'変更直後Qと温度に対応するKを比較：'+r.direction+'。濃度・体積操作でKを変えません。'});
})();
