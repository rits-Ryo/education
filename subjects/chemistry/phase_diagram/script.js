(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"Q": 60, "pointT": 30, "pointP": 2},compute:E.calculate,draw:D.draw,latex:(s,r)=>['\\theta&\\approx '+num(r.T)+'^\\circ\\mathrm C','\\text{加熱曲線の相}&='+txt(r.phase),'\\text{相図の領域}&='+txt(r.region)],describe:(s,r)=>'純物質の概念モデルです。相図の点と加熱曲線は別条件で操作します。',second:D.second});
})();
