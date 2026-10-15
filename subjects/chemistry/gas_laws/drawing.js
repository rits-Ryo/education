(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,s.law==='boyle'?[.1,100,0,Math.max(500,r.P/1000*2)]:[1,800,0,s.law==='charles'?Math.max(100,r.V*1000*3):Math.max(500,r.P/1000*3)]);v.axis(s.law==='boyle'?'V (L)':'T (K)',s.law==='charles'?'V (L)':'P (kPa)');v.curve(x=>s.law==='boyle'?s.n*8.314462618*r.T/x:s.law==='charles'?s.n*8.314462618*x/(s.P*1000)*1000:s.n*8.314462618*x/(s.V/1000)/1000);v.point([s.law==='boyle'?s.V:r.T,s.law==='charles'?r.V*1000:r.P/1000],'現在',C[1]);
}
function second(svg,s,r,t=0){
const v=S.scene(svg);const w=Math.max(1,Math.min(7,r.V*1000/15));v.vessel(1,1,w,6,.9,'理想ピストン');v.particles(1.2,1.2,w-.4,5,24,'同じnなら粒子数保存',C[0],t*r.speed);
}
root.ChemistryDrawing={draw,second};
})(window);
