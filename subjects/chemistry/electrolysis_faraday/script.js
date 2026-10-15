(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"kind": "copper", "I": 1, "t": 96485},compute:E.calculate,draw:D.draw,latex:(s,r)=>['Q&\\approx '+num(r.Q)+'\\,\\mathrm C','n(e^-)&\\approx '+num(r.ne)+'\\,\\mathrm{mol}',...(s.kind==='copper'?['n(\\mathrm{Cu})&\\approx '+num(r.nCu)+'\\,\\mathrm{mol}','m(\\mathrm{Cu})&\\approx '+num(r.mass)+'\\,\\mathrm g']:['n(\\mathrm H_2)&\\approx '+num(r.nH2)+'\\,\\mathrm{mol}','n(\\mathrm O_2)&\\approx '+num(r.nO2)+'\\,\\mathrm{mol}','\\text{理論mol比 }\\mathrm H_2:\\mathrm O_2&=2:1'])],describe:(s,r)=>'電流効率100%・副反応なし。図は実験手順ではありません。'});
})();
