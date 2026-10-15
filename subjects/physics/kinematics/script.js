(function(){
  'use strict';
  const M=window.MathDisplay,L=M.token,E=window.KinematicsEngine,D=window.KinematicsDrawing,F=window.NumberDisplay.formatNonzero,$=id=>document.getElementById(id);
  let s={...E.preset('default'),t:0,t1:0,t2:4,show:{tangent:true,areas:true}},playing=false,frame=null,last=null;
  const keys=['x0','v0','a','T','t','t1','t2'];
  function sync(){for(const k of keys)for(const type of ['slider','number']){const el=$(k+'-'+type);el.value=s[k];if(['t','t1','t2'].includes(k))el.max=s.T;el.removeAttribute('aria-invalid');}}
  function render(){D.motion($('motion'),s);for(const k of ['x','v','a'])D.draw($(k+'-graph'),s,k);const r=E.at(s,s.t),i=E.interval(s,s.t1,s.t2),turn=E.turning(s);
    $('axis-note').textContent=s.vertical?'上向き正。画面の右側が正の鉛直座標に対応します。地面衝突・空気抵抗なし。':'右向き正、時刻t ≥ 0。';
    M.renderMath($('values'),String.raw`\begin{aligned}t&\approx ${L(F(s.t))}\,\mathrm s\\x&\approx ${L(F(r.x))}\,\mathrm m\\v&\approx ${L(F(r.v))}\,\mathrm{m/s},\quad |v|\approx ${L(F(Math.abs(r.v)))}\,\mathrm{m/s}\\a&\approx ${L(F(r.a))}\,\mathrm{m/s^2}\\\text{速度0の時刻：}&${turn===null?M.text('孤立した零点なし'):L(F(turn))+'\\,\\mathrm s'}\end{aligned}`,{displayMode:true});
    M.renderMath($('interval-values'),String.raw`\begin{aligned}[t_1,t_2]&\approx[${L(F(s.t1))},${L(F(s.t2))}]\,\mathrm s\\\Delta x=\int_{t_1}^{t_2}v\,dt&\approx ${L(F(i.displacement))}\,\mathrm m\\\text{移動距離}&\approx ${L(F(i.distance))}\,\mathrm m\\\Delta v=\int_{t_1}^{t_2}a\,dt&\approx ${L(F(i.velocityChange))}\,\mathrm{m/s}\end{aligned}`+(i.regions.length===2?String.raw`\quad\text{速度が符号反転}`:''),{displayMode:true});}

  function stop(){playing=false;last=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;$('play').textContent='再生';}
  function tick(time){if(!playing)return;if(last!==null)s.t=E.advance(s.t,Math.min(.1,(time-last)/1000),Number($('speed').value),s.T);last=time;sync();render();if(s.t>=s.T)stop();else frame=requestAnimationFrame(tick);}
  for(const k of keys)for(const type of ['slider','number']){const el=$(k+'-'+type);el.addEventListener('input',()=>{stop();const v=el.valueAsNumber,next={...s,[k]:v};try{E.validate(next);if(k==='T'){next.t=Math.min(next.t,v);next.t1=Math.min(next.t1,v);next.t2=Math.min(next.t2,v);}E.at(next,next.t);E.interval(next,next.t1,next.t2);}catch(e){$('error').textContent=e.message;el.setAttribute('aria-invalid','true');return;}s=next;const peer=$(k+'-'+(type==='number'?'slider':'number'));peer.value=v;el.removeAttribute('aria-invalid');$('error').textContent='';if(k==='T')sync();render();});}
  $('preset').addEventListener('change',()=>{stop();s={...E.preset($('preset').value),t:0,t1:0,t2:E.preset($('preset').value).T,show:s.show};$('error').textContent='';sync();render();});
  for(const k of ['tangent','areas'])$(k).addEventListener('change',()=>{s.show[k]=$(k).checked;render();});
  $('play').addEventListener('click',()=>{if(playing){stop();return;}if(s.t>=s.T)s.t=0;playing=true;last=null;$('play').textContent='停止';frame=requestAnimationFrame(tick);});
  $('reset').addEventListener('click',()=>{stop();s.t=0;$('error').textContent='';sync();render();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('resize',render);sync();render();
})();
