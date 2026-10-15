(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"kind": "butane", "display": "structure", "phi": 20, "tilt": 25},compute:E.calculate,draw:D.draw,latex:(s,r)=>['\\text{名称}&='+txt(r.name),'\\text{分子式}&='+r.formula,'\\text{総原子数}&='+r.total,'(N_C,N_H,N_O)&=('+r.counts.C+','+r.counts.H+','+r.counts.O+')','\\text{官能基}&='+txt(r.group)],describe:(s,r)=>'検証済み構造のみ表示します。回転で別の構造異性体にはなりません。',camera:true});
})();
