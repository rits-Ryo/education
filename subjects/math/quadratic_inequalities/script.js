(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"a": 1, "b": 0, "c": -1, "op": ">"},CAMERA=false;
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
function validate(s){E.solve(s.a,s.b,s.c,s.op);}function render(){const g=E.solve(state.a,state.b,state.c,state.op);view=D.draw($('graph'),state,g);const bound=x=>x===Infinity?'\\infty':x===-Infinity?'-\\infty':num(x);const interval=i=>i.lo===i.hi?'\\{'+num(i.lo)+'\\}':(i.lc?'[':'(')+bound(i.lo)+','+bound(i.hi)+(i.hc?']':')');formula(['f(x)&\\approx '+num(state.a)+'x^2+('+num(state.b)+')x+('+num(state.c)+')','f(x)&'+({'>':'>','>=':'\\ge ','<':'<','<=':'\\le '})[state.op]+'0','D&\\approx '+num(g.D),'\\text{解集合}&\\approx '+(g.intervals.length?g.intervals.map(interval).join('\\cup '):'\\varnothing')]);message(g.roots.length===0?'実根なし。解集合は数直線の緑色の部分です。':g.roots.length===1?'重解。点の左右で符号は変わりません。':'2つの実根。根の内側と外側で符号が変わります。');}
$('inside').onclick=()=>commit({...state,a:1,b:0,c:-1,op:'<='},true);$('empty').onclick=()=>commit({...state,a:1,b:0,c:1,op:'<'},true);$('single').onclick=()=>commit({...state,a:-1,b:2,c:-1,op:'>='},true);
sync();render();
})();
