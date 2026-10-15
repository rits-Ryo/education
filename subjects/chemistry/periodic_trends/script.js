(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;
const actions={};for(let Z=1;Z<=36;Z++){const e=E.element(Z),b=document.createElement('button');b.id='element-'+Z;b.className='element';b.textContent=Z+' '+e.symbol;b.style.gridColumn=e.group;b.style.gridRow=e.period;b.setAttribute('aria-label',e.symbol+' 原子番号'+Z);document.getElementById('periodic').append(b);actions[b.id]=()=>({Z,period:e.period});}
U.start({defaults:{"Z": 11, "period": 3},compute:E.calculate,draw:D.draw,latex:(s,r)=>['\\mathrm{'+r.symbol+'}&:\\ Z='+r.Z,'(\\text{周期},\\text{族})&=('+r.period+','+r.group+')','\\text{分類}&='+txt(r.classification),'\\text{電子配置}&='+r.config,'\\text{価電子数}&='+ (r.valence===null?txt('単純な値を表示しない'):r.valence),'\\chi&'+(r.en===null?':'+txt('未定義・未収録'):'\\approx '+num(r.en))],describe:(s,r)=>'一般的傾向の比較です。グラフの欠損は架空の数値で補いません。',actions:actions});
})();
