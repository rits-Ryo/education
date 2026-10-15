(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"h": 0, "k": 0, "r": 2, "A": 0, "B": 1, "C": -1, "P": [-4, 1], "Q": [4, 1]},CAMERA=false;
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
function validate(s){E.relation(s.h,s.k,s.r,s.A,s.B,s.C);}function updatePoints(){const norm=Math.hypot(state.A,state.B),u=state.A/norm,v=state.B/norm,base=[-state.C/norm*u,-state.C/norm*v];state.P=[base[0]-3*v,base[1]+3*u];state.Q=[base[0]+3*v,base[1]-3*u];}
let lineFromDrag=false;function render(){if(!lineFromDrag)updatePoints();lineFromDrag=false;const g=E.relation(state.h,state.k,state.r,state.A,state.B,state.C);view=D.draw($('graph'),state,g);formula(['(x-('+num(state.h)+'))^2+(y-('+num(state.k)+'))^2&\\approx ('+num(state.r)+')^2',num(state.A)+'x+('+num(state.B)+')y+('+num(state.C)+')&\\approx 0','d&\\approx '+num(g.d),'r&\\approx '+num(state.r),'d-r&\\approx '+num(g.d-state.r),...g.points.map((p,i)=>'P_{'+(i+1)+'}&\\approx('+p.map(num).join(',')+')')]);message(({two:'2点で交わります。',tangent:'接しています。',none:'共有点はありません。'})[g.kind]+(g.near?' dとrが数値的に非常に近い状態ですが、表示の丸めで接線とは判定しません。':''));}
function moveHandle(k,p){p=p.map(v=>Math.max(-5,Math.min(5,v)));if(k==='O')commit({...state,h:Math.max(-4,Math.min(4,p[0])),k:Math.max(-4,Math.min(4,p[1]))},true);else if(k==='R')commit({...state,r:Math.max(.1,Math.min(5,Math.hypot(p[0]-state.h,p[1]-state.k)))},true);else{try{const c=E.through(k==='P'?p:state.P,k==='Q'?p:state.Q),norm=Math.hypot(c.A,c.B);lineFromDrag=true;commit({...state,P:k==='P'?p:state.P,Q:k==='Q'?p:state.Q,A:c.A/norm,B:c.B/norm,C:c.C/norm},true);}catch(e){error(e.message);}}}
function moveKey(k,key){const p=k==='O'?[state.h,state.k]:k==='R'?[state.h+state.r,state.k]:[...state[k]],i=key==='ArrowLeft'||key==='ArrowRight'?0:1;p[i]+=(key==='ArrowLeft'||key==='ArrowDown'?-.1:.1);moveHandle(k,p);}
for(const [id,A,B,C] of [['secant',0,1,0],['tangent',0,1,-1],['outside',0,1,-2],['vertical',1,0,-1]])$(id).onclick=()=>commit({...state,h:0,k:0,r:1,A,B,C},true);
sync();render();
})();
