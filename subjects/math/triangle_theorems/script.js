(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"A": [0, 3], "B": [-3, -1], "C": [3, -1], "circle": true, "altitude": true},CAMERA=false;
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
function validate(s){E.geometry(s.A,s.B,s.C);}function render(){const g=E.geometry(state.A,state.B,state.C);view=D.draw($('graph'),state,g);const lines=['(a,b,c)&\\approx('+[g.a,g.b,g.c].map(num).join(',')+')','S&\\approx '+num(g.area)];if(g.unstable){lines.push('A,B,C,R&:\\text{数値的に不安定}');message('頂点の一致またはほぼ一直線のため角度と外接円は表示しません。');}else{lines.push('(A,B,C)&\\approx('+g.angles.map(a=>num(a*180/Math.PI)+'^\\circ').join(',')+')','A+B+C&\\approx '+num(g.angles.reduce((a,b)=>a+b)*180/Math.PI)+'^\\circ','2R&\\approx '+num(2*g.R),'\\frac a{\\sin A}&\\approx '+num(g.a/Math.sin(g.angles[0])),'a^2&\\approx '+num(g.a*g.a),'b^2+c^2-2bc\\cos A&\\approx '+num(g.b*g.b+g.c*g.c-2*g.b*g.c*Math.cos(g.angles[0])),'\\frac12bc\\sin A&\\approx '+num(.5*g.b*g.c*Math.sin(g.angles[0])));message(g.angles.some(a=>a>Math.PI/2)?'鈍角三角形：鈍角の余弦は負です。':'直角・鋭角の形でも同じ法則が成立します。');}formula(lines);}
function moveHandle(k,p){commit({...state,[k]:p.map(v=>Math.max(-5,Math.min(5,v)))});}function moveKey(k,key){const p=[...state[k]],i=key==='ArrowLeft'||key==='ArrowRight'?0:1;p[i]+=(key==='ArrowLeft'||key==='ArrowDown'?-.1:.1);moveHandle(k,p);}
$('right').onclick=()=>commit({...state,A:[0,0],B:[4,0],C:[0,3]},true);$('equilateral').onclick=()=>commit({...state,A:[0,2*Math.sqrt(3)],B:[-2,0],C:[2,0]},true);$('obtuse').onclick=()=>commit({...state,A:[0,0],B:[3,0],C:[-1,1]},true);
sync();render();
})();
