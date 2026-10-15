'use strict';

// 入力と描画要求の同期を検証するDOMシミュレーション。
// SVGの見た目・実際のPointer Eventsはブラウザで別途確認する。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const engine = require('./engine.js');
const elements = new Map();
const frames = new Map();
const drawings = new Map();
let sequence = 0;

class Element {
  constructor() {
    this.children = [];
    this.listeners = new Map();
    this.attributes = new Map();
    this.value = '';
    this.textContent = '';
  }

  set id(value) { this.identifier = value; elements.set(value, this); }
  get id() { return this.identifier; }
  get valueAsNumber() { return this.value === '' ? NaN : Number(this.value); }
  append(...children) { this.children.push(...children); }
  replaceChildren() { this.children = []; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  addEventListener(name, handler) { this.listeners.set(name, handler); }
  emit(name) { this.listeners.get(name)?.({ target: this }); }
}

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
for (const match of html.matchAll(/id="([^"]+)"/g)) {
  const element = new Element();
  element.id = match[1];
}
elements.get('speed').value = '500';
elements.get('mode').value = 'compare';
const document = {
  hidden: false,
  getElementById: id => elements.get(id),
  createElement: () => new Element(),
  querySelectorAll: () => [],
  addEventListener() {}
};
const context = {
  document,
  window: {
    NumberDisplay: require('../../../number-format.js'),
    IntegrationEngine: engine,
    IntegrationDrawing: {
      draw(svg, state, result) { drawings.set(svg.id, { ...state, result }); }
    },
    addEventListener() {}
  },
  requestAnimationFrame(callback) { frames.set(++sequence, callback); return sequence; },
  cancelAnimationFrame(id) { frames.delete(id); }
};
context.window.console={error(message,latex,error){throw new Error('Math validation failed: '+latex+' '+(error?.message||''));}};
context.window.katex={render(latex,element,options){require('../../../vendor/katex-0.19.0/katex.min.js').renderToString(latex,options);element.textContent=latex;}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../../../math-display.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8'), context);

function flush(time = 0) {
  const pending = [...frames.values()];
  frames.clear();
  for (const callback of pending) callback(time);
}

function input(id, value, event = 'input') {
  const element = elements.get(id);
  element.value = String(value);
  element.emit(event);
  flush();
}

function state() { return drawings.get('sum-graph'); }
let count = 0;
function test(name, run) {
  run();
  count += 1;
  console.log('PASS', name);
}

test('初期図と読み出し', () => {
  assert.equal(state().n, 4);
  assert.equal(state().result.sum, 0.46875);
  assert.equal(drawings.get('area-graph').b, 2);
  assert.ok(elements.get('square-example').textContent.includes(String.raw`\frac13`));
  assert.ok(elements.get('square-example').textContent.includes('0.469'));
  assert.ok(!elements.get('square-example').textContent.match(/\d+\.\d{4}/));
});
test('n入力・スライダー・再描画の同期', () => {
  input('n-number', 100);
  assert.equal(Number(elements.get('n-slider').value), 100);
  assert.equal(state().result.rectangles.length, 100);
});
test('不正なnは状態を維持する', () => {
  input('n-number', 4.5);
  assert.equal(state().n, 100);
  assert.ok(elements.get('sum-error').textContent);
});
test('逆転区間の拒否と零幅区間', () => {
  input('sum-a-number', 2);
  assert.equal(state().a, 0);
  input('sum-b-number', 0);
  assert.equal(state().result.sum, 0);
  assert.equal(state().result.integral, 0);
});
test('関数変更と二つの図の独立性', () => {
  input('function', 'sine', 'change');
  assert.equal(state().b, Math.PI);
  assert.equal(state().result.integral, 2);
  assert.equal(drawings.get('area-graph').id, 'square');
});
test('表示モードの同期', () => {
  input('mode', 'rectangles', 'change');
  assert.equal(state().mode, 'rectangles');
});
test('再生・一時停止・再開・リセット', () => {
  elements.get('reset').emit('click');
  flush();
  elements.get('play').emit('click');
  for (const time of [0, 250, 500, 501]) flush(time);
  assert.equal(state().n, 8);
  elements.get('play').emit('click');
  flush(1000);
  assert.equal(state().n, 8);
  elements.get('play').emit('click');
  for (const time of [1000, 1250, 1500, 1501]) flush(time);
  assert.equal(state().n, 16);
  elements.get('reset').emit('click');
  flush();
  assert.equal(state().n, 4);
});
test('表示だけを丸め、入力精度と微小な非零誤差を維持する', () => {
  input('function', 'square', 'change');
  input('sum-b-number', 0.01);
  input('n-number', 200);
  assert.ok(state().result.error > 0 && state().result.error < 0.0005);
  const error = elements.get('sum-values').children.at(-1).textContent;
  assert.ok(error.includes(String.raw`\times10^`));
  assert.notEqual(error, String.raw`\approx 0`);
  input('sum-b-number', 1.23456);
  assert.equal(state().b, 1.23456);
  assert.equal(elements.get('sum-b-number').value, '1.23456');
  const text = elements.get('sum-values').children.map(e => e.textContent).join(' ');
  assert.ok(text.includes('1.235'));
  assert.ok(!text.match(/\d+\.\d{4}|NaN|Infinity|undefined/));
  input('sum-b-number', 0);
  assert.equal(state().result.error, 0);
  assert.equal(elements.get('sum-values').children.at(-1).textContent.replace(/\s+/g,' ').trim(), String.raw`\approx 0`);
});
console.log(`${count} UI simulation groups passed`);
