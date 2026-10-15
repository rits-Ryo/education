(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"kind": "H2O", "phi": 20, "tilt": 25},compute:E.calculate,draw:D.draw,latex:(s,r)=>['\\text{形}&='+txt(r.shape),'\\text{結合角}&'+(r.angle===null?':'+txt('対象外'):'\\approx '+num(r.angle)+'^\\circ'),'\\text{分子全体の極性}&='+txt(r.polar===null?'結晶のため分子として扱わない':r.polar?'極性あり':'双極子が打ち消される')],describe:(s,r)=>'視点を回しても原子の結合関係は変わりません。NaClは結晶の一部分です。',second:D.second,camera:true});
})();
