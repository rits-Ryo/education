(function(){
'use strict';
const E=window.ChemistryEngine,D=window.ChemistryDrawing,U=window.ChemistryUI,num=U.number,txt=U.text;

U.start({defaults:{"Z": 6, "A": 12, "q": 0},compute:E.calculate,draw:D.draw,latex:(s,r)=>['{}^{'+s.A+'}_{'+s.Z+'}\\mathrm{'+r.symbol+'}'+(s.q===0?'':'^{'+(Math.abs(s.q)>1?Math.abs(s.q):'')+(s.q>0?'+':'-')+'}'),'p&='+r.p,'n&='+r.n,'N_e&='+r.e,'q/e&='+r.q],describe:(s,r)=>'代表同位体・基本的なイオンの殻模型です。電子配置の模式図は軌道の実測ではありません。',prepare:s=>{for(const [key,values] of [['A',E.isotopes[s.Z-1]],['q',E.ionCharges[s.Z-1]]]){const el=document.getElementById(key);if(!values.includes(s[key]))s[key]=key==='q'?0:values[0];el.replaceChildren(...values.map(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;return o;}));el.value=s[key];}}});
})();
