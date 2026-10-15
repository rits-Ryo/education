(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"kind": "square", "a": 1, "h": 0.5},CAMERA=false;
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
let timer=null,lastKind=state.kind;const expressions={square:'x^2',hole:'\\frac{x^2-1}{x-1}\\ (x\\ne1)',redefined:'\\begin{cases}x+1&x\\ne1\\\\3&x=1\\end{cases}',jump:'\\frac{|x|}{x}\\ (x\\ne0)',reciprocal:'\\frac1x\\ (x\\ne0)',sinc:'\\frac{\\sin x}{x}\\ (x\\ne0)'};
function validate(s){E.approach(s.kind,s.a,s.h);}function render(){if(lastKind!==state.kind){stop();state.a=state.kind==='square'||state.kind==='hole'||state.kind==='redefined'?1:0;lastKind=state.kind;sync();}const g=E.approach(state.kind,state.a,state.h);view=D.draw($('graph'),state,g);const val=v=>v==='overflow'?'\\text{数値の表現範囲外}':v===null?'\\text{未定義}':v==='-inf'?'-\\infty':v==='+inf'?'+\\infty':num(v);formula(['f(x)&='+expressions[state.kind],'h&\\approx '+num(state.h),'f(a-h)&'+(g.left[1]===null?':'+val(null):'\\approx '+val(g.left[1])),'f(a+h)&'+(g.right[1]===null?':'+val(null):'\\approx '+val(g.right[1])),'\\lim_{x\\to a-}f(x)&'+(typeof g.limits.left==='number'?'\\approx ':'=')+val(g.limits.left),'\\lim_{x\\to a+}f(x)&'+(typeof g.limits.right==='number'?'\\approx ':'=')+val(g.limits.right),'f(a)&'+(g.limits.at===null?':'+val(null):'\\approx '+val(g.limits.at))]);message(g.limits.outOfRange?'接近点の関数値が数値の表現範囲外です。極限判定もこの計算では扱いません。':g.limits.continuous?'接近点で連続です。数値の接近だけでは証明になりません。':g.limits.both!==null?'左右の有限極限は一致しますが、関数値が未定義または不一致なので連続ではありません。':g.limits.left==='-inf'?'左右は反対符号の無限大へ発散し、有限な両側極限はありません。':'左右の極限が異なるため、両側極限は存在しません。');}
function stop(){clearInterval(timer);timer=null;$('play').textContent='左右から接近';}
$('critical').onclick=()=>commit({...state,a:state.kind==='square'||state.kind==='hole'||state.kind==='redefined'?1:0},true);$('restart').onclick=()=>{stop();commit({...state,h:.5},true);};$('play').onclick=()=>{if(timer){stop();return;}$('play').textContent='停止';timer=setInterval(()=>{const h=Math.max(.000001,state.h*.85);commit({...state,h},true);if(h<=.000001)stop();},100);};window.addEventListener('pagehide',stop);
sync();render();
})();
