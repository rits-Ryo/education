(function(){
  'use strict';
  const M=window.MathDisplay,L=M.token,E=window.ElectricEngine,D=window.ElectricDrawing,N=window.NumberDisplay,$=id=>document.getElementById(id),svg=$('plane');
  const format=x=>Math.abs(x)>=1e6?N.formatScientific(Number(x.toExponential().split('e')[0]),Number(x.toExponential().split('e')[1])):N.formatNonzero(x);
  let s={charges:E.preset('dipole'),p:[0,1],range:6,show:{vectors:true,lines:true,contours:true,heat:true,contributions:false}},drag=null,pending=null;
  const keys=['q1','x1','y1','q2','x2','y2','px','py','range'];
  function value(k){if(k==='px')return s.p[0];if(k==='py')return s.p[1];if(k==='range')return s.range;return s.charges[Number(k[1])-1][k[0]];}
  function sync(){for(const k of keys)for(const type of ['slider','number']){const el=$(k+'-'+type);el.value=value(k);el.removeAttribute('aria-invalid');}}
  function render(){D.draw(svg,$('map'),s);const r=E.field(s.charges,s.p);if(r.defined)M.renderMath($('values'),String.raw`\begin{aligned}P&\approx(${L(format(s.p[0]))},${L(format(s.p[1]))})\,\mathrm m\\E_x&\approx${L(format(r.Ex))}\,\mathrm{N/C}\\E_y&\approx${L(format(r.Ey))}\,\mathrm{N/C}\\|\vec E|&\approx${L(format(r.magnitude))}\,\mathrm{N/C}\\V&\approx${L(format(r.V))}\,\mathrm V\end{aligned}`,{displayMode:true});
    else $('values').textContent=r.reason==='center'?'電荷中心：EとVは未定義（点電荷の特異点）。有限値は表示しません。':'電荷中心ではありませんが、値が数値表現範囲を超えました。有限の近似値に置き換えません。';
    $('parts').hidden=!s.show.contributions;
    if(r.defined&&s.show.contributions)M.renderMath($('parts'),String.raw`\begin{aligned}`+r.contributions.map((c,i)=>String.raw`\vec E_${i+1}&\approx(${L(format(c.Ex))},${L(format(c.Ey))})\,\mathrm{N/C},\quad V_${i+1}\approx${L(format(c.V))}\,\mathrm V`).join('\\\\')+String.raw`\end{aligned}`,{displayMode:true});
    else $('parts').textContent=r.defined?'':r.reason==='center'?'中心の各寄与も未定義です。':'各寄与は数値表現範囲を超えたため表示できません。';
    $('levels').textContent=s.show.contours?'等電位線の値 (V)：'+D.levels.map(format).join('、')+'。格子近似の破線。':'等電位線：非表示';}
  function schedule(){if(pending!==null)return;pending=requestAnimationFrame(()=>{pending=null;render();});}
  for(const k of keys)for(const type of ['slider','number']){const el=$(k+'-'+type);el.addEventListener('input',()=>{const v=el.valueAsNumber,next={...s,charges:s.charges.map(q=>({...q})),p:s.p.slice()};if(k==='px')next.p[0]=v;else if(k==='py')next.p[1]=v;else if(k==='range')next.range=v;else next.charges[Number(k[1])-1][k[0]]=v;
    try{E.validate(next.charges);if(!next.p.every(Number.isFinite)||next.p.some(x=>Math.abs(x)>10)||!Number.isFinite(next.range)||next.range<4||next.range>12)throw new RangeError('Pは±10 m、表示半幅は4〜12 mです。');E.field(next.charges,next.p);}catch(e){$('error').textContent=e.message;el.setAttribute('aria-invalid','true');return;}s=next;el.removeAttribute('aria-invalid');$(k+'-'+(type==='number'?'slider':'number')).value=v;$('error').textContent='';schedule();});}
  function reset(name){const charges=E.preset(name);if(charges.length===1)charges.push({q:0,x:2,y:0});s.charges=charges;s.p=[0,1];s.range=6;$('error').textContent='';sync();schedule();}
  $('preset').addEventListener('change',()=>reset($('preset').value));$('reset').addEventListener('click',()=>{$('preset').value='dipole';s.show={vectors:true,lines:true,contours:true,heat:true,contributions:false};for(const k of Object.keys(s.show))$(k).checked=s.show[k];reset('dipole');});
  for(const k of Object.keys(s.show))$(k).addEventListener('change',()=>{s.show[k]=$(k).checked;schedule();});
  svg.addEventListener('pointerdown',e=>{const key=e.target.getAttribute('data-handle');if(key===null||drag||e.button!==0)return;drag={key,id:e.pointerId};svg.setPointerCapture(e.pointerId);e.preventDefault();});
  function move(key,p){p=p.map(v=>Math.max(-10,Math.min(10,v)));if(key==='P')s.p=p;else{const i=Number(key);s.charges[i]={...s.charges[i],x:p[0],y:p[1]};}sync();$('error').textContent='';schedule();}
  svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const matrix=svg.getScreenCTM();if(!matrix)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());move(drag.key,D.fromPixel(p.x,p.y,s.range));e.preventDefault();});
  function finish(e){if(!drag||e.pointerId!==drag.id)return;const id=drag.id;drag=null;if(svg.hasPointerCapture(id))svg.releasePointerCapture(id);}for(const n of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(n,finish);
  svg.addEventListener('keydown',e=>{const key=e.target.getAttribute('data-handle'),d={ArrowRight:[.1,0],ArrowLeft:[-.1,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]}[e.key];if(key===null||!d)return;e.preventDefault();const p=key==='P'?s.p:[s.charges[Number(key)].x,s.charges[Number(key)].y];move(key,p.map((v,i)=>v+d[i]));});
  window.addEventListener('resize',schedule);sync();render();
})();
