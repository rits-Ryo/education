(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"pKa": 4.76, "HA": 0.1, "A": 0.1, "add": 0, "V": 1, "kind": "acid"},compute:E.calculate,draw:D.draw,latex:(s,r)=>['n(\\mathrm{HA})&\\approx '+num(r.HA)+'\\,\\mathrm{mol}','n(\\mathrm A^-)&\\approx '+num(r.A)+'\\,\\mathrm{mol}','\\mathrm{pH}&'+(r.valid?'\\approx '+num(r.pH):':'+txt('近似式の適用範囲外')),'\\text{添加物余剰}&\\approx '+num(r.excess)+'\\,\\mathrm{mol}'],describe:(s,r)=>r.valid?'緩衝液近似の範囲内です。':'成分枯渇・添加過剰・比または濃度が適用範囲外です。'});
})();
