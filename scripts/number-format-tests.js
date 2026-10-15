'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const F = require('../number-format.js');
let count = 0;
function test(name, run) { run(); console.log('PASS', name); count++; }
test('specified integers, decimals, rounding and trailing zeros', () => {
  for (const [value, expected] of [[1,'1'],[1.2,'1.2'],[1.23,'1.23'],[1.234,'1.234'],
    [1.23456,'1.235'],[2.9999,'3'],[1/3,'0.333'],[-1.23456,'-1.235'],
    [3.14000,'3.14'],[0,'0'],[-0,'0'],[0.000000,'0'],[0.0001,'0'],[-0.0001,'0'],
    [1.2345,'1.235'],[-1.2345,'-1.235'],[0.0005,'0.001'],[-0.0005,'-0.001']]) {
    assert.equal(F.formatNumber(value), expected);
  }
});
test('invalid values have a safe placeholder without coercion', () => {
  for (const value of [NaN,Infinity,-Infinity,undefined,null,'1.23456',{},1n]) {
    assert.equal(F.formatNumber(value),'—'); assert.equal(F.formatNonzero(value),'—');
  }
});
test('large numbers remain finite display strings', () => {
  assert.equal(F.formatNumber(1e21),'1000000000000000000000');
  for (const x of [Number.MAX_VALUE,-Number.MAX_VALUE]) {
    assert.ok(!F.formatNumber(x).match(/NaN|Infinity|undefined|e/));
  }
});
test('tiny values, their signs and exact zero stay distinct', () => {
  assert.equal(F.formatNonzero(0),'0'); assert.equal(F.formatNonzero(-0),'0');
  assert.equal(F.formatNonzero(1e-14),'1 × 10^-14');
  assert.equal(F.formatNonzero(-1e-14),'-1 × 10^-14');
  assert.equal(F.formatNonzero(Number.MIN_VALUE),'5 × 10^-324');
  assert.equal(F.formatNonzero(0.00049999),'5 × 10^-4');
  assert.equal(F.formatScientific(-1,-400),'-1 × 10^-400');
  assert.equal(F.formatScientific(9.9999,-10),'1 × 10^-9');
  assert.equal(F.formatScientific(-9.9999,-10),'-1 × 10^-9');
  assert.equal(F.formatScientific(NaN,0),'—');
});
test('formatting never changes the calculation value', () => {
  const value = 1/3;
  assert.equal(F.formatNumber(value),'0.333'); assert.equal(value*3,1);
  for (let i=-1000; i<=1000; i++) {
    const x=i/7919;
    for (const result of [F.formatNumber(x),F.formatNonzero(x)]) {
      assert.ok(!result.match(/\d+\.\d{4}|NaN|Infinity|undefined/));
    }
  }
});
test('browser global and lesson loading order', () => {
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../number-format.js'),'utf8'),context);
  assert.equal(context.window.NumberDisplay.formatNumber(1.23456),'1.235');
  for (const file of ['Quadratic_function/max_min.html','trigonometric_functions/index.html',
    'differentiation/index.html','integration/index.html','vectors_inner_product/index.html','derangement/index.html']) {
    const html=fs.readFileSync(path.join(__dirname,'../subjects/math',file),'utf8');
    const scripts=[...html.matchAll(/<script\s+defer\s+src="([^"]+)"/g)].map(m=>m[1]);
    assert.ok(scripts.includes('../../../number-format.js'),file);
    assert.ok(scripts.indexOf('../../../math-display.js')<scripts.indexOf('script.js')||file.startsWith('derangement/'));
    for(const src of scripts) assert.ok(fs.existsSync(path.resolve(__dirname,'../subjects/math',path.dirname(file),src)));
  }
});
// Run real controllers with a small DOM; this does not replace browser checks.
function controller(folder, engineName, drawingName, defaults) {
  const elements = new Map();
  class Element {
    constructor() { this.children=[]; this.listeners={}; this.value=''; this.checked=true; this.textContent=''; }
    get valueAsNumber() { return Number(this.value); }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children=children; }
    addEventListener(name,callback) { this.listeners[name]=callback; }
    setAttribute() {} removeAttribute() {}
    emit(name) { this.listeners[name]?.({target:this}); }
  }
  const directory=path.join(__dirname,'../subjects/math',folder);
  const html=fs.readFileSync(path.join(directory,'index.html'),'utf8');
  for(const m of html.matchAll(/id="([^"]+)"/g)) elements.set(m[1],new Element());
  for(const [key,value] of Object.entries(defaults)) elements.get(key).value=value;
  const graphs=new Map();
  const engine=require(path.join(directory,folder==='trigonometric_functions'?'math.js':'engine.js'));
  const drawing={circle(){},graph(svg,config){graphs.set(svg,config);},draw(){},view(){return {left:-2,right:2};}};
  const context={window:{NumberDisplay:F,[engineName]:engine,[drawingName]:drawing,addEventListener(){}},
    document:{getElementById:id=>elements.get(id),createElement:()=>new Element(),querySelectorAll:()=>[],addEventListener(){}},
    requestAnimationFrame(){return 1;},cancelAnimationFrame(){}};
  context.window.console={error(message,latex,error){throw new Error('Math validation failed: '+latex+' '+(error?.message||''));}};
context.window.katex={render(latex,element,options){require('../vendor/katex-0.19.0/katex.min.js').renderToString(latex,options);element.textContent=latex;}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../math-display.js'),'utf8'),context);
  vm.runInNewContext(fs.readFileSync(path.join(directory,'script.js'),'utf8'),context);
  return {elements,graphs};
}
test('trigonometry preserves exact values and precise coefficients and angles', () => {
  const {elements:e,graphs}=controller('trigonometric_functions','TrigMath','TrigDrawing',{'graph-span':'2','transform-kind':'sin'});
  assert.ok(e.get('cos-label').textContent.includes(String.raw`\sqrt{3}`));
  const number=e.get('coefficient-controls').children[0].children[2];
  number.value='1.23456'; number.emit('input');
  assert.ok(e.get('transform-formula').textContent.includes('1.235'));
  const curve=graphs.get(e.get('transform-graph')).curves[1];
  assert.equal(curve.evaluate(Math.PI/2),1.23456);
  assert.equal(number.value,'1.23456');
  e.get('unit').value='rad'; e.get('unit').emit('change');
  e.get('angle-number').value='1.23456789';e.get('angle-number').emit('input');e.get('angle-number').emit('change');
  assert.equal(e.get('angle-number').value,'1.23456789');
  for(const id of ['transform-formula','transform-properties','point-label','angle-label','identity-values'])
    assert.ok(!e.get(id).textContent.match(/\d+\.\d{4}|NaN|Infinity|undefined/),id);
});
test('differentiation shows precise input only in input fields and preserves tiny slopes', () => {
  const {elements:e}=controller('differentiation','DifferentiationEngine','DifferentiationDrawing',{});
  e.get('a-number').value='1.23456'; e.get('a-number').emit('input');
  assert.equal(e.get('a-number').value,'1.23456');
  assert.ok(e.get('tangent-values').textContent.includes('2.469'));
  for(const id of ['rate-values','tangent-values','linked-values'])
    assert.ok(!e.get(id).textContent.match(/\d+\.\d{4}|NaN|Infinity|undefined/),id);
  e.get('a-number').value='0.00001';e.get('a-number').emit('input');
  assert.ok(e.get('tangent-values').textContent.includes(String.raw`2\times10^{-5}`));
  assert.ok(e.get('tangent-values').textContent.includes(String.raw`\text{正}`));
  e.get('h-number').value='0'; e.get('h-number').emit('input');
  assert.ok(e.get('rate-values').textContent.includes('未定義'));
});

console.log(`${count} test groups passed; 0 failed`);
