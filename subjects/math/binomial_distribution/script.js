(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"n": 10, "p": 0.5, "k": 5},CAMERA=false;
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
function validate(s){E.distribution(s.n,s.p,Math.min(s.k,s.n));}function render(){if(state.k>state.n){state.k=state.n;sync();}for(const e of document.querySelectorAll('[data-key="k"]'))e.max=state.n;const g=E.distribution(state.n,state.p,state.k);view=D.draw($('graph'),state,g);formula(['X&\\sim B('+state.n+','+num(state.p)+')','P(X='+state.k+')&'+(g.selected===0&&state.p>0&&state.p<1?':\\text{表現範囲未満の正の確率}':'\\approx '+num(g.selected)),'P(X\\le '+state.k+')&'+(g.cumulative===0&&state.p>0&&state.p<1?':\\text{表現範囲未満の正の確率}':'\\approx '+num(g.cumulative)),'E[X]&\\approx '+num(g.mean),'\\operatorname{Var}(X)&\\approx '+num(g.variance),'\\sigma&\\approx '+num(g.sd)]);message('全ての棒の確率の和は1です。赤が選択した成功回数、紫と赤が累積確率の範囲です。');}
$('fair').onclick=()=>commit({...state,n:2,p:.5,k:1},true);$('certain').onclick=()=>commit({...state,p:1,k:state.n},true);
sync();render();
})();
