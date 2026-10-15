(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"kind": "arithmetic", "a": 1, "d": 2, "r": 0.5, "p": 0.5, "q": 1, "N": 12},CAMERA=false;
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
function validate(s){E.parameters(s.kind,s.a,s.d,s.r,s.p,s.q,s.N);}function render(){const s=E.parameters(state.kind,state.a,state.d,state.r,state.p,state.q,state.N),g=E.terms(s);view=D.draw($('graph'),s,g);const common=s.kind==='arithmetic'?'a_n\\approx '+num(s.a)+'+(n-1)('+num(s.d)+')':s.kind==='geometric'?'a_n\\approx '+num(s.a)+'('+num(s.r)+')^{n-1}':s.p===1?'a_n\\approx '+num(s.a)+'+(n-1)('+num(s.q)+')':'a_n=('+num(s.p)+')^{n-1}('+num(s.a)+')+('+num(s.q)+')\\frac{1-('+num(s.p)+')^{n-1}}{1-('+num(s.p)+')}';formula([common,'a_{'+g.values.length+'}&\\approx '+num(g.values.at(-1)),...(s.kind==='linear'&&s.p!==1?['\\text{不動点}&\\approx '+num(s.q/(1-s.p))]:[])]);const descriptions={constant:'定数列です。',arithmetic:'等差で変化します。',convergent:'絶対値が1未満の係数なので不動点へ近づきます。',alternating:'2つの値を交代し、初項が不動点でなければ収束しません。',growing:'不動点からの差が増大します。'};message(g.overflowAt?'第'+g.overflowAt+'項以降は数値の表現範囲外です（上限または下限）。':descriptions[E.behavior(s)]+' 縦軸は項の範囲に自動調整します。');const body=$('terms');body.replaceChildren();g.values.forEach((v,i)=>{const row=document.createElement('tr');for(const x of [i+1,NumberDisplay.formatNonzero(v),i?NumberDisplay.formatNonzero(v-g.values[i-1]):'—']){const c=document.createElement('td');c.textContent=x;row.append(c);}body.append(row);});}
$('alternate').onclick=()=>commit({...state,kind:'geometric',a:3,r:-.8},true);$('fixed').onclick=()=>commit({...state,kind:'linear',a:0,p:.5,q:1},true);
sync();render();
})();
