(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"a": 2, "b": 1, "c": 0, "d": 1, "mode": "product", "theta": 90, "stage": 2},CAMERA=false;
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
function validate(s){E.analyze([s.a,s.b],[s.c,s.d]);}function render(){const g=E.analyze([state.a,state.b],[state.c,state.d]);view=D.draw($('graph'),state,g);const z=p=>num(p[0])+'+('+num(p[1])+')i';formula(['z_1&\\approx '+z([state.a,state.b]),'z_2&\\approx '+z([state.c,state.d]),'z_1+z_2&\\approx '+z(g.sum),'z_1z_2&\\approx '+z(g.product),'|z_1z_2|&\\approx '+num(g.lengths[2]),'|z_1||z_2|&\\approx '+num(g.lengths[0]*g.lengths[1]),...g.args.map((v,i)=>(i===2?'\\arg(z_1z_2)':'\\arg z_{'+(i+1)+'}')+'&'+(v===null?':\\text{未定義}':'\\approx '+num(v)+'\\,\\mathrm{rad}'))]);message(g.args.some(v=>v===null)?'零複素数の偏角は未定義です。0倍は原点へ縮みます。':'乗算は|z₂|倍の伸縮とarg z₂の回転です。偏角の表示区間は(−π,π]です。');}
function moveHandle(k,p){const [x,y]=p.map(v=>Math.max(-5,Math.min(5,v)));commit({...state,...(k==='z1'?{a:x,b:y}:{c:x,d:y})},true);}function moveKey(k,key){const p=k==='z1'?[state.a,state.b]:[state.c,state.d],i=key==='ArrowLeft'||key==='ArrowRight'?0:1;p[i]+=(key==='ArrowLeft'||key==='ArrowDown'?-.1:.1);moveHandle(k,p);}
$('i').onclick=()=>commit({...state,c:0,d:1},true);$('negative').onclick=()=>commit({...state,c:-1,d:0},true);$('onei').onclick=()=>commit({...state,c:1,d:1},true);$('rotation').onclick=()=>commit({...state,c:Math.cos(state.theta*Math.PI/180),d:Math.sin(state.theta*Math.PI/180)},true);
sync();render();
})();
