(function(){
  'use strict';
  const M=window.MathDisplay,L=M.token,E=window.VectorEngine,D=window.VectorDrawing,$=id=>document.getElementById(id),svg=$('graph');
  const state={a:[4,0],b:[3,2],show:{angle:true,projection:true,perpendicular:true,components:true,calculation:true}};
  let range=0,drag=null;
  const pair=v=>`(${v.map(x=>L(E.format(x))).join(', ')})`;
  function render(sync=true){
    const r=E.calculate(state.a,state.b);if(!drag)range=D.extent(state.a,state.b,r);
    D.draw(svg,state,r,range);
    if(sync)for(const key of ['a','b'])state[key].forEach((x,i)=>$(key+(i+1)).value=String(x));
    const rows=[String.raw`\vec a\approx${pair(state.a)},\quad |\vec a|\approx${L(E.format(r.lengthA))}`,String.raw`\vec b\approx${pair(state.b)},\quad |\vec b|\approx${L(E.format(r.lengthB))}`,String.raw`\theta ${r.angle===null?M.text('定義されない'):'\\approx '+L(E.format(r.angle))+'^{\\circ}'}`,String.raw`\cos\theta\approx${r.cos===null?M.text('定義されない'):L(r.cosText)}`,String.raw`s\approx${r.scalar===null?M.text('定義されない'):L(r.scalarText)}`,String.raw`\overrightarrow{OH}\approx${r.projectionText?'('+r.projectionText.map(L).join(', ')+')':M.text('定義されない')}`,String.raw`\text{成分公式の内積}\approx${L(r.dotText)}`,String.raw`\text{幾何学的な内積}\approx${L(r.dotText)}`];
    const existing=$('values').children;
    rows.forEach((latex,i)=>{let p=existing[i];if(!p){p=document.createElement('p');$('values').append(p);}M.renderMath(p,latex);});
    $('sign').className='callout '+r.sign;
    $('sign').textContent=r.zeroA||r.zeroB?'内積は0。零ベクトルを含むため、なす角と直交の判定は定義されません。':r.exactOrthogonal?'内積は0：入力の十進数で厳密に直交（θ = 90°）。正射影は零ベクトルです。':(r.sign==='positive'?'内積は正：鋭角（θ < 90°）、正射影はaと同じ向き。':'内積は負：鈍角（θ > 90°）、正射影はaと反対の向き。')+(r.underflow?' 内積が非常に小さいため指数表記で表示しています。':'')+(r.nearOrthogonal?' ほぼ直交（|cosθ| < 10⁻¹²）。入力の十進数では内積は0ではありません。角度の表示は90°に丸められる場合があります。':'');
    $('calculation').hidden=!state.show.calculation;
    M.renderMath($('calculation'),String.raw`\begin{aligned}\text{成分（表示値は近似）： }\vec a\cdot\vec b&\approx${L(E.format(state.a[0]))}(${L(E.format(state.b[0]))})+${L(E.format(state.a[1]))}(${L(E.format(state.b[1]))})\approx${L(r.dotText)}\\|\vec a||\vec b|\cos\theta&${r.cos===null?M.text('未定義'):'\\approx '+L(E.format(r.lengthA))+'\\times '+L(E.format(r.lengthB))+'\\times('+L(r.cosText)+')\\approx '+L(r.dotText)}\\|\vec a|s&${r.scalar===null?M.text('未定義'):'\\approx '+L(E.format(r.lengthA))+'\\times('+L(r.scalarText)+')\\approx '+L(r.dotText)}\end{aligned}`,{displayMode:true});
  }
  for(const key of ['a','b'])for(let i=0;i<2;i++)$(key+(i+1)).addEventListener('input',()=>{
    const values=['a1','a2','b1','b2'].map(id=>$(id).valueAsNumber);
    try{E.calculate(values.slice(0,2),values.slice(2));}catch(error){$('error').textContent=error.message;return;}
    state.a=values.slice(0,2);state.b=values.slice(2);$('error').textContent='';$('preset').value='';render(false);
  });
  for(const key of Object.keys(state.show))$('show-'+key).addEventListener('change',()=>{state.show[key]=$('show-'+key).checked;render(false);});
  $('preset').addEventListener('change',()=>{if(!$('preset').value)return;Object.assign(state,E.preset(Number($('preset').value)));$('error').textContent='';render();});
  $('reset').addEventListener('click',()=>{state.a=[4,0];state.b=[3,2];$('snap').checked=false;$('preset').value='';$('error').textContent='';for(const k of Object.keys(state.show)){state.show[k]=true;$('show-'+k).checked=true;}render();});
  // Inverse SVG screen matrix handles both responsive dimensions and page offsets.
  function coords(event){const matrix=svg.getScreenCTM();if(!matrix)return null;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());let v=[(p.x-320)*range/270,(320-p.y)*range/270];v=v.map(x=>Math.max(-E.LIMIT,Math.min(E.LIMIT,x)));return $('snap').checked?v.map(Math.round):v;}
  svg.addEventListener('pointerdown',event=>{const key=event.target.getAttribute('data-vector');if(!key||drag||event.button!==0)return;event.preventDefault();drag={key,id:event.pointerId};svg.setPointerCapture(event.pointerId);});
  svg.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id)return;event.preventDefault();const v=coords(event);if(!v)return;state[drag.key]=v;$('preset').value='';$('error').textContent='';render();});
  function finish(event){if(!drag||event.pointerId!==drag.id)return;const id=drag.id;drag=null;if(svg.hasPointerCapture(id))svg.releasePointerCapture(id);render();}
  svg.addEventListener('pointerup',finish);svg.addEventListener('pointercancel',finish);svg.addEventListener('lostpointercapture',finish);
  svg.addEventListener('keydown',event=>{const key=event.target.getAttribute('data-vector'),delta={ArrowRight:[1,0],ArrowLeft:[-1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[event.key];if(!key||!delta)return;event.preventDefault();const step=$('snap').checked?1:0.1;state[key]=state[key].map((x,i)=>Math.max(-E.LIMIT,Math.min(E.LIMIT,$('snap').checked?Math.round(x)+delta[i]:Number((x+delta[i]*step).toPrecision(12)))));$('preset').value='';$('error').textContent='';render();svg.querySelector(`[data-vector="${key}"]`).focus();});
  window.addEventListener('resize',()=>render(false));
  render();
})();
