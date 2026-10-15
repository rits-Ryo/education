'use strict';
// DOM simulation exercises the actual controller; browser rendering is checked separately.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const elements=new Map();
class Element{
 constructor(){this.listeners={};this.value='';this.checked=true;this.children=[];this.attrs={};this.textContent='';}
 get valueAsNumber(){return this.value===''?NaN:Number(this.value);}
 addEventListener(name,fn){this.listeners[name]=fn;}
 replaceChildren(...children){this.children=children;}
 append(...children){this.children.push(...children);}
 setAttribute(k,v){this.attrs[k]=String(v);}
 removeAttribute(k){delete this.attrs[k];}
 emit(name,event={}){this.listeners[name]?.({target:this,...event});}
 getAttribute(k){return this.attrs[k]||null;}
 setPointerCapture(id){this.capture=id;}
 hasPointerCapture(id){return this.capture===id;}
 releasePointerCapture(){this.capture=null;}
 getScreenCTM(){return {inverse(){return {};}};}
 querySelector(){return {focus(){}};}
}
const html=fs.readFileSync(__dirname+'/index.html','utf8');
for(const m of html.matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element());
for(const [id,value] of Object.entries({a1:4,a2:0,b1:3,b2:2}))elements.get(id).value=String(value);
elements.get('snap').checked=false;
const E=require('./engine.js');let drawn,resize;
const context={document:{getElementById:id=>elements.get(id),createElement:()=>new Element()},window:{VectorEngine:E,VectorDrawing:{extent:()=>8,draw(svg,state,result,range){drawn={a:[...state.a],b:[...state.b],show:{...state.show},result,range};}},addEventListener(name,fn){resize=fn;}},DOMPoint:class{constructor(x,y){this.x=x;this.y=y;}matrixTransform(){return this;}}};
context.window.NumberDisplay=require('../../../number-format.js');
context.window.console={error(message,latex,error){throw new Error('Math validation failed: '+latex+' '+(error?.message||''));}};
context.window.katex={render(latex,element,options){require('../../../vendor/katex-0.19.0/katex.min.js').renderToString(latex,options);element.textContent=latex;}};
context.document.addEventListener=()=>{};
vm.runInNewContext(fs.readFileSync(__dirname+'/../../../math-display.js','utf8'),context);
vm.runInNewContext(fs.readFileSync(__dirname+'/script.js','utf8'),context);
let count=0;function test(name,fn){fn();console.log('PASS '+name);count++;}const $=id=>elements.get(id),g=$('graph');
function input(id,value){$(id).value=String(value);$(id).emit('input');}
function target(key){return {getAttribute:()=>key};}
test('initial diagram and values',()=>{assert.equal(drawn.result.dot,12);assert.equal($('values').children.length,8);});
test('component input and rejection preserve valid state',()=>{input('b1',-3);assert.equal(drawn.result.sign,'negative');input('b1','');assert.ok($('error').textContent);assert.equal(drawn.b[0],-3);input('b1',3);assert.equal($('error').textContent,'');});
test('presets keep exact right angle',()=>{$('preset').value='90';$('preset').emit('change');assert.equal(drawn.result.angle,90);assert.equal(drawn.result.dot,0);});
test('display switches',()=>{$('show-projection').checked=false;$('show-projection').emit('change');assert.equal(drawn.show.projection,false);$('show-calculation').checked=false;$('show-calculation').emit('change');assert.equal($('calculation').hidden,true);});
test('pointer drag including touch and snap',()=>{$('snap').checked=true;g.emit('pointerdown',{target:target('b'),pointerId:8,pointerType:'touch',button:0,preventDefault(){}});g.emit('pointermove',{pointerId:8,clientX:380,clientY:270,preventDefault(){}});assert.deepEqual(drawn.b,[2,1]);g.emit('pointerup',{pointerId:8});assert.equal(g.capture,null);});
test('pointer cancel ends drag',()=>{g.emit('pointerdown',{target:target('a'),pointerId:9,button:0,preventDefault(){}});g.emit('pointercancel',{pointerId:9});const old=drawn.a.slice();g.emit('pointermove',{pointerId:9,clientX:0,clientY:0,preventDefault(){}});assert.deepEqual(drawn.a,old);});
test('keyboard and resize retain state',()=>{g.emit('keydown',{target:target('a'),key:'ArrowUp',preventDefault(){}});assert.equal(drawn.a[1],1);resize();assert.equal(drawn.a[1],1);});
test('reset restores vectors and controls',()=>{$('reset').emit('click');assert.deepEqual(drawn.a,[4,0]);assert.deepEqual(drawn.b,[3,2]);assert.equal($('snap').checked,false);assert.equal(drawn.show.projection,true);assert.equal($('calculation').hidden,false);});
console.log(`${count} UI simulation groups passed; 0 failed`);
// Execute the real drawing module too, including obtuse and zero-vector cases.
class SVGElement {
 constructor(tag){this.tag=tag;this.attrs={};this.children=[];}
 setAttribute(k,v){this.attrs[k]=String(v);}
 getAttribute(k){return this.attrs[k];}
 append(e){this.children.push(e);}
 replaceChildren(){this.children=[];}
}
const drawingContext={window:{VectorEngine:E},document:{createElementNS(ns,tag){return new SVGElement(tag);}}};
vm.runInNewContext(fs.readFileSync(__dirname+'/drawing.js','utf8'),drawingContext);
function diagram(a,b){const svg=new SVGElement('svg'),r=E.calculate(a,b);drawingContext.window.VectorDrawing.draw(svg,{a,b,show:{angle:true,projection:true,perpendicular:true,components:true}},r,8);return svg;}
test('actual SVG obtuse projection is on opposite side',()=>{const svg=diagram([4,0],[-3,2]);const h=svg.children.find(e=>e.tag==='circle'&&e.attrs.fill==='#7544ae');assert.ok(Number(h.attrs.cx)<320);assert.equal(Number(h.attrs.cy),320);assert.equal(svg.children.filter(e=>e.attrs['data-vector']).length,2);});
test('actual SVG zero vector has no undefined coordinates',()=>{for(const [a,b] of [[[0,0],[0,0]],[[4,0],[0,0]],[[0,0],[3,2]]]){const svg=diagram(a,b);assert.ok(!JSON.stringify(svg).match(/NaN|Infinity/));assert.equal(svg.children.filter(e=>e.attrs['data-vector']).length,2);}});
test('actual SVG scale is equal horizontally and vertically',()=>{const svg=diagram([4,0],[0,4]);const a=svg.children.find(e=>e.attrs['data-vector']==='a'),b=svg.children.find(e=>e.attrs['data-vector']==='b');assert.equal(Number(a.attrs.cx)-320,320-Number(b.attrs.cy));});
function consistentReadout(){
  const r=drawn.result,rows=$('values').children;
  assert.equal(rows[6].textContent,String.raw`\text{成分公式の内積}\approx`+context.window.MathDisplay.token(r.dotText));
  assert.equal(rows[7].textContent,String.raw`\text{幾何学的な内積}\approx`+context.window.MathDisplay.token(r.dotText));
  assert.equal($('sign').className,'callout '+r.sign);
  assert.ok(!rows.map(p=>p.textContent).join(' ').match(/NaN|Infinity/));
}
test('regression input shows actual decimal formula and consistent negative dot',()=>{
  input('a1',1);input('a2',3);input('b1','0.8999999999999999');input('b2',-0.3);
  consistentReadout();assert.equal(drawn.result.dot,-1e-16);
  assert.equal($('b1').value,'0.8999999999999999');
  assert.ok($('calculation').textContent.includes('0.9'));
  assert.ok(!$('calculation').textContent.match(/\d+\.\d{4}/));
  assert.ok($('sign').textContent.includes('ほぼ直交'));
  assert.ok(!$('sign').textContent.includes('非常に小さいため指数表記'));
  input('b1',0.9);consistentReadout();assert.equal(drawn.result.dot,0);
  assert.ok($('sign').textContent.includes('厳密に直交'));
  input('b1','0.9000000000000001');consistentReadout();assert.equal(drawn.result.sign,'positive');
});
test('continuous drag updates positive zero and negative readouts together',()=>{
  $('reset').emit('click');$('snap').checked=false;
  g.emit('pointerdown',{target:target('b'),pointerId:12,button:0,preventDefault(){}});
  for(const [x,sign] of [[350,'positive'],[320,'zero'],[290,'negative'],[320.000001,'positive']]){
    g.emit('pointermove',{pointerId:12,clientX:x,clientY:270,preventDefault(){}});
    consistentReadout();assert.equal(drawn.result.sign,sign);
  }
  g.emit('pointerup',{pointerId:12});consistentReadout();
});
test('tiny values and zero vectors retain consistent UI meanings',()=>{
  input('a1',1e-200);input('a2',0);input('b1',-1e-200);input('b2',0);
  consistentReadout();assert.equal(drawn.result.sign,'negative');assert.equal(drawn.result.underflow,true);
  assert.ok($('values').children[6].textContent.includes('10^{-400}'));
  input('a1',0);consistentReadout();assert.equal(drawn.result.angle,null);
  assert.ok($('sign').textContent.includes('零ベクトル'));
  $('reset').emit('click');consistentReadout();assert.equal(drawn.result.dot,12);
});
console.log(`${count} total UI/drawing groups passed; 0 failed`);
