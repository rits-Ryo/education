(function(){
  'use strict';
  const M=window.MathDisplay,L=M.token,E=window.WaveEngine,D=window.WaveDrawing,F=window.NumberDisplay.formatNonzero,$=id=>document.getElementById(id),svg=$('plane');
  let s={...E.preset('same'),mode:'displacement',regions:true},playing=false,last=null,frame=null,drawTime=-Infinity,pointer=null;
  const keys=['lambda','f','A','phase','d','t','px','py'];
  function limit(){return 4/s.f;}
  function sync(){for(const k of keys)for(const type of ['slider','number']){const el=$(k+'-'+type);el.value=k==='px'?s.p[0]:k==='py'?s.p[1]:s[k];if(k==='t')el.max=limit();el.removeAttribute('aria-invalid');}}
  function render(){D.map($('map'),s);D.plane(svg,s);D.time($('time-graph'),s);const r=E.at(s,s.p,s.t);
    $('map-legend').textContent=s.mode==='amplitude'?`振幅B：白 0 → 紫 ${F(2*s.A)} cm（負の振幅なし）。黒・白の帯は干渉条件の近傍です。`:`合成変位u：赤 −${F(2*s.A)} cm → 白 0 → 青 +${F(2*s.A)} cm。細い青・赤の円は各波源の山の等位相波面。`;
    M.renderMath($('values'),String.raw`\begin{aligned}P&\approx(${L(F(s.p[0]))},${L(F(s.p[1]))})\,\mathrm m\\r_1&\approx${L(F(r.r1))}\,\mathrm m,\quad r_2\approx${L(F(r.r2))}\,\mathrm m\\\Delta r=r_2-r_1&\approx${L(F(r.pathDifference))}\,\mathrm m\\\Delta=k\Delta r+(\varphi_1-\varphi_2)&\approx${L(F(r.delta))}\,\mathrm{rad}\\u_1&\approx${L(F(r.u1))}\,\mathrm{cm},\quad u_2\approx${L(F(r.u2))}\,\mathrm{cm}\\u=u_1+u_2&\approx${L(F(r.u))}\,\mathrm{cm}\\B&\approx${L(F(r.B))}\,\mathrm{cm}\\v=f\lambda&\approx${L(F(r.v))}\,\mathrm{m/s}\\T=\frac1f&\approx${L(F(1/s.f))}\,\mathrm s\end{aligned}`+'\\quad'+M.text(E.classify(r.delta)),{displayMode:true});}

  function stop(){playing=false;last=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;$('play').textContent='再生';}
  function tick(time){if(!playing)return;const period=window.innerWidth<600?50:33;if(time-drawTime<period){frame=requestAnimationFrame(tick);return;}if(last!==null)s.t=Math.min(limit(),s.t+Math.min(.15,(time-last)/1000)*Number($('speed').value));last=time;drawTime=time;sync();render();if(s.t>=limit())stop();else frame=requestAnimationFrame(tick);}
  for(const k of keys)for(const type of ['slider','number']){const el=$(k+'-'+type);el.addEventListener('input',()=>{stop();const v=el.valueAsNumber,next={...s,p:s.p.slice()};if(k==='px')next.p[0]=v;else if(k==='py')next.p[1]=v;else next[k]=v;try{E.validate(next);E.point(next.p);if(k==='f')next.t=Math.min(next.t,4/next.f);if(next.t<0||next.t>4/next.f)throw new RangeError('時刻は0〜4周期の範囲です。');E.at(next,next.p,next.t);}catch(e){$('error').textContent=e.message;el.setAttribute('aria-invalid','true');return;}s=next;el.removeAttribute('aria-invalid');$(k+'-'+(type==='number'?'slider':'number')).value=v;if(k==='f')sync();$('error').textContent='';render();});}
  function reset(name){stop();s={...E.preset(name),mode:s.mode,regions:s.regions};$('error').textContent='';sync();render();}
  $('preset').addEventListener('change',()=>reset($('preset').value));$('reset').addEventListener('click',()=>{$('preset').value='same';reset('same');});
  $('mode').addEventListener('change',()=>{s.mode=$('mode').value;render();});$('regions').addEventListener('change',()=>{s.regions=$('regions').checked;render();});
  $('play').addEventListener('click',()=>{if(playing){stop();return;}if(s.t>=limit())s.t=0;playing=true;last=null;drawTime=-Infinity;$('play').textContent='停止';frame=requestAnimationFrame(tick);});
  svg.addEventListener('pointerdown',e=>{if(e.target.getAttribute('data-point')!=='P'||pointer!==null||e.button!==0)return;pointer=e.pointerId;svg.setPointerCapture(pointer);e.preventDefault();});
  svg.addEventListener('pointermove',e=>{if(e.pointerId!==pointer)return;const m=svg.getScreenCTM();if(!m)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());s.p=D.fromPixel(p.x,p.y).map((v,i)=>Math.max(i?-6:-8,Math.min(i?6:8,v)));$('error').textContent='';sync();render();e.preventDefault();});
  function finish(e){if(e.pointerId!==pointer)return;const id=pointer;pointer=null;if(svg.hasPointerCapture(id))svg.releasePointerCapture(id);}for(const n of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(n,finish);
  svg.addEventListener('keydown',e=>{if(e.target.getAttribute('data-point')!=='P')return;const d={ArrowRight:[.1,0],ArrowLeft:[-.1,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]}[e.key];if(!d)return;e.preventDefault();s.p=s.p.map((v,i)=>Math.max(i?-6:-8,Math.min(i?6:8,v+d[i])));sync();render();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('resize',render);sync();render();
})();
