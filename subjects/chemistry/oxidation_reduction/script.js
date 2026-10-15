(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"kind": "zinc", "multiple": 1},compute:E.calculate,draw:D.draw,latex:(s,r)=>[r.latex,'\\text{授受電子数}&='+r.electrons,'\\text{半反応（1倍）}&:'+r.half[0],...(r.half[1]?[r.half[1]]:[])],describe:(s,r)=>'電子授受と酸化数を対応させます。元素・電荷は保存しています。'});
})();
