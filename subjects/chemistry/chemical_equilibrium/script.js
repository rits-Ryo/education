(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"A0": 2, "B0": 0, "K": 3, "rate": 0.2, "t": 5},compute:E.calculate,draw:D.draw,latex:(s,r)=>['[A]&\\approx '+num(r.A)+'\\,\\mathrm{mol/L}','[B]&\\approx '+num(r.B)+'\\,\\mathrm{mol/L}','Q&'+(r.Q===null?':'+txt('物質なし'):r.Q==='unbounded'?':'+txt('A=0で比は有限でない'):'\\approx '+num(r.Q)),'K&\\approx '+num(s.K),'(v_f,v_r)&\\approx('+num(r.forward)+','+num(r.reverse)+')\\,\\mathrm{mol\\,L^{-1}s^{-1}}'],describe:(s,r)=>r.total===0?'物質がないため反応速度は0、Qは未定義です。':'初期Qからの方向：'+r.direction+'。時間が進んでもKは一定です。',second:D.second,animate:(s,t,delta)=>{s.t=Math.min(30,s.t+delta);}});
})();
