(function(){
'use strict';
const E=window.LessonEngine,D=window.LessonDrawing,M=window.MathDisplay,$=id=>document.getElementById(id),num=M.number;
const DEFAULTS={"ax": 3, "ay": 1, "az": 2, "bx": -1, "by": 3, "bz": 1, "azimuth": 35, "elevation": 25, "zoom": 1},CAMERA=true;
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
function validate(s){E.analyze([s.ax,s.ay,s.az],[s.bx,s.by,s.bz]);}function render(){const g=E.analyze([state.ax,state.ay,state.az],[state.bx,state.by,state.bz]);view=D.draw($('graph'),state,g);formula(['\\vec a&\\approx('+[state.ax,state.ay,state.az].map(num).join(',')+')','\\vec b&\\approx('+[state.bx,state.by,state.bz].map(num).join(',')+')','(|\\vec a|,|\\vec b|)&\\approx('+g.lengths.map(num).join(',')+')','\\vec a\\cdot\\vec b&'+(g.outOfRange?':\\text{数値の表現範囲外}':'\\approx '+num(g.dot)),'\\cos\\theta&'+(g.cos===null?':\\text{未定義}':'\\approx '+num(g.cos)),'\\theta&'+(g.angle===null?':\\text{未定義}':'\\approx '+num(g.angle*180/Math.PI)+'^\\circ')]);message(g.angle===null?'零ベクトルのため、なす角は未定義です。':g.orthogonal?'両者は非零で内積0：空間で直交しています。':'図の投影角度と実角度は一般に異なります。視点変更は数値を変えません。');}
let cameraStart=null;function startHandle(k,event){cameraStart={x:event.clientX,y:event.clientY,a:state.azimuth,e:state.elevation};}function moveHandle(k,p,event){if(!cameraStart)return;let a=cameraStart.a+(event.clientX-cameraStart.x)*.4;a=((a+180)%360+360)%360-180;commit({...state,azimuth:a,elevation:Math.max(-85,Math.min(85,cameraStart.e-(event.clientY-cameraStart.y)*.3))},true);}
$('orthogonal').onclick=()=>commit({...state,ax:1,ay:0,az:0,bx:0,by:1,bz:0},true);$('parallel').onclick=()=>commit({...state,ax:1,ay:2,az:2,bx:2,by:4,bz:4},true);$('zero').onclick=()=>commit({...state,ax:0,ay:0,az:0},true);
sync();render();
})();
