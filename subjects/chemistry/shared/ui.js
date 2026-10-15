(function(root){
'use strict';
const M=root.MathDisplay,N=root.NumberDisplay;
function number(v){if(!Number.isFinite(v))return M.text('モデル範囲外');if(v!==0&&(Math.abs(v)>=1e6||Math.abs(v)<.0005)){const [m,e]=v.toExponential().split('e');return M.token(N.formatScientific(Number(m),Number(e)));}return M.number(v);}
function start(config){
 const $=id=>document.getElementById(id);let state=structuredClone(config.defaults),result,frame=null,last=null,elapsed=0;
 function sync(except){for(const input of document.querySelectorAll('[data-key]'))if(input!==except)input.value=state[input.dataset.key];}
 function render(){result=config.compute(state);config.draw($('graph'),state,result,elapsed);if(config.second)config.second($('secondary'),state,result,elapsed);M.renderMath($('result'),'\\begin{aligned}'+config.latex(state,result).join('\\\\{}')+'\\end{aligned}',{displayMode:true});$('status').textContent=config.describe(state,result);}
 function apply(next,edited){try{config.prepare?.(next);config.compute(next);state=next;sync(edited);$('error').textContent='';edited?.removeAttribute('aria-invalid');render();return true;}catch(e){$('error').textContent=e.message;edited?.setAttribute('aria-invalid','true');return false;}}
 function stop(){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=null;$('play')&&($('play').textContent='再生');}
 function tick(time){const delta=last===null?0:Math.min(.1,(time-last)/1000);elapsed+=delta;last=time;config.animate?.(state,elapsed,delta);sync();render();frame=requestAnimationFrame(tick);}
 for(const input of document.querySelectorAll('[data-key]'))input.addEventListener('input',()=>{stop();const raw=input.value,value=input.type==='number'||input.type==='range'||input.dataset.number==='true'?(raw===''?NaN:Number(raw)):raw;if(typeof value==='number'&&(!Number.isFinite(value)||input.min!==''&&value<Number(input.min)||input.max!==''&&value>Number(input.max)||input.dataset.integer==='true'&&!Number.isInteger(value))){$('error').textContent='範囲内の有効な数値を入力してください。直前の状態を保ちます。';input.setAttribute('aria-invalid','true');return;}apply({...state,[input.dataset.key]:value},input);});
 $('reset').addEventListener('click',()=>{stop();elapsed=0;apply(structuredClone(config.defaults));});
 $('play')?.addEventListener('click',()=>{if(frame!==null){stop();return;}$('play').textContent='停止';last=null;frame=requestAnimationFrame(tick);});
 if(config.camera){let drag=null;const graph=$('graph');graph.classList.add('interactive');graph.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,phi:state.phi,tilt:state.tilt};graph.setPointerCapture(e.pointerId);});graph.addEventListener('pointermove',e=>{if(!drag)return;e.preventDefault();let phi=drag.phi+(e.clientX-drag.x)*.5;phi=((phi+180)%360+360)%360-180;apply({...state,phi,tilt:Math.max(-80,Math.min(80,drag.tilt-(e.clientY-drag.y)*.4))});});for(const k of ['pointerup','pointercancel','lostpointercapture'])graph.addEventListener(k,()=>drag=null);}
 for(const [id,action] of Object.entries(config.actions||{}))$(id)?.addEventListener('click',()=>{stop();apply({...state,...action(state,result)});});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});root.addEventListener('pagehide',stop);
 config.prepare?.(state);sync();render();return {stop};
}
root.ChemistryUI={start,number,text:M.text};
})(window);
