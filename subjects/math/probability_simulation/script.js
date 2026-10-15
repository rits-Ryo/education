(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"kind": "coin", "p": 0.5, "N": 100, "seed": 42},CAMERA=false;
let state=structuredClone(DEFAULTS),view;
function stop(){} function moveHandle(){} function moveKey(){} function startHandle(){}
function formula(lines){M.renderMath($('result'),'\\begin{aligned}'+lines.join('\\\\')+'\\end{aligned}',{displayMode:true});}
function message(s){$('status').textContent=s;}
function sync(){for(const el of document.querySelectorAll('[data-key]')){const key=el.dataset.key;el.value=state[key];}for(const el of document.querySelectorAll('[data-check]'))el.checked=state[el.dataset.check];}
function error(s){$('error').textContent=s;}
function commit(next,doSync=false){try{validate(next);state=next;error('');if(doSync)sync();render();return true;}catch(e){error(e.message);return false;}}
for(const input of document.querySelectorAll('[data-key]'))input.addEventListener('input',()=>{const key=input.dataset.key;let value=input.tagName==='SELECT'?input.value:input.value===''?NaN:Number(input.value);if(input.tagName!=='SELECT'&&(!Number.isFinite(value)||value<Number(input.min)||value>Number(input.max)||input.dataset.integer==='true'&&!Number.isInteger(value))){error('入力範囲内の'+(input.dataset.integer==='true'?'整数':'有限の数値')+'を指定してください。図は直前の有効な状態を保ちます。');return;}
 const next={...state,[key]:value};if(commit(next)){for(const other of document.querySelectorAll('[data-key="'+key+'"]'))if(other!==input)other.value=value;}});
for(const input of document.querySelectorAll('[data-check]'))input.addEventListener('change',()=>commit({...state,[input.dataset.check]:input.checked}));
$('reset').addEventListener('click',()=>{stop?.();commit(structuredClone(DEFAULTS),true);});
let drag=null;
function dragTo(event){if(!drag)return;event.preventDefault();moveHandle(drag,view.world(event),event);}
$('graph').addEventListener('pointerdown',event=>{const handle=event.target.getAttribute('data-handle');if(handle||CAMERA){drag=handle||'camera';$('graph').setPointerCapture(event.pointerId);startHandle?.(drag,event);dragTo(event);}});
$('graph').addEventListener('pointermove',dragTo);
for(const kind of ['pointerup','pointercancel','lostpointercapture'])$('graph').addEventListener(kind,()=>{drag=null;});
$('graph').addEventListener('keydown',event=>{const handle=event.target.getAttribute('data-handle');if(!handle||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();moveKey?.(handle,event.key);$('graph').querySelector('[data-handle="'+handle+'"]')?.focus();});
let simulation=E.create(state.kind,state.p,state.seed),timer=null;E.run(simulation,100);
function validate(s){E.probability(s.kind,s.p);E.rng(s.seed);}function render(){if(simulation.kind!==state.kind||simulation.p!==E.probability(state.kind,state.p)||simulation.seed!==state.seed){stop();simulation=E.create(state.kind,state.p,state.seed);E.run(simulation,100);}view=D.draw($('graph'),state,simulation);const exact=state.kind==='coin'?'\\frac12':state.kind==='die'?'\\frac16':state.kind==='sum'?'\\frac6{36}':num(state.p);formula(['P(A)&'+(state.kind==='bernoulli'?'\\approx ':'=')+exact,'\\text{試行数}&='+simulation.n,'\\text{成功数}&='+simulation.hits,'\\text{相対度数}&=\\frac{'+simulation.hits+'}{'+simulation.n+'}\\approx '+num(simulation.hits/simulation.n)]);message('疑似乱数による実際の試行結果です。有限回での一致や単調な接近は保証されません。');}
function stop(){clearInterval(timer);timer=null;$('play').textContent='連続実行';}function extra(n){try{E.run(simulation,n);render();}catch(e){stop();error(e.message);}}
$('one').onclick=()=>extra(1);$('batch').onclick=()=>extra(state.N);$('play').onclick=()=>{if(timer){stop();return;}$('play').textContent='停止';timer=setInterval(()=>extra(Math.min(state.N,1000)),100);};$('reseed').onclick=()=>{stop();simulation=E.create(state.kind,state.p,state.seed);E.run(simulation,100);render();};
$('reset').addEventListener('click',()=>{simulation=E.create(state.kind,state.p,state.seed);E.run(simulation,100);render();});window.addEventListener('pagehide',stop);
sync();render();
})();
