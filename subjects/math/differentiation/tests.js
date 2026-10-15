'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');
let count = 0;

function test(name, run) {
  run();
  count += 1;
  console.log('PASS', name);
}

function near(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

test('all six analytic derivatives', () => {
  const expected = {
    square: x => 2 * x,
    cube: x => 3 * x * x,
    cubic: x => 3 * x * x - 3,
    downward: x => -2 * x + 4,
    sine: Math.cos,
    cosine: x => -Math.sin(x)
  };
  for (const [id, derivative] of Object.entries(expected)) {
    for (const a of [-2, -1, 0, 0.5, 1, 2, Math.PI / 2, Math.PI]) {
      near(E.model(id).derivative(a), derivative(a));
    }
  }
});

test('average rates agree with direct differences for positive and negative h', () => {
  for (const id of Object.keys(E.FUNCTIONS)) {
    const f = E.model(id);
    for (const a of [-1, 0, 0.3, 1]) {
      for (const h of [-0.8, -0.1, 0.1, 0.8]) {
        near(E.averageRate(id, a, h), (f.value(a + h) - f.value(a)) / h);
      }
    }
  }
});

test('h zero is undefined for every function', () => {
  for (const id of Object.keys(E.FUNCTIONS)) {
    assert.equal(E.averageRate(id, 1, 0), null);
    assert.equal(E.averageRate(id, 1, -0), null);
  }
});

test('tiny h uses stable formulas even when a+h equals a numerically', () => {
  for (const id of ['square', 'cube', 'cubic', 'downward', 'sine', 'cosine']) {
    for (const a of [-1, 0.3, 1]) {
      for (const h of [-1e-15, 1e-15, -1e-100, 1e-100]) {
        const rate = E.averageRate(id, a, h);
        assert.ok(Number.isFinite(rate));
        near(rate, E.model(id).derivative(a));
      }
    }
  }
});

test('tiny h at a trigonometric stationary point retains the one-sided rate', () => {
  for (const h of [-1e-20, 1e-20]) {
    near(E.averageRate('sine', Math.PI / 2, h) / h, -0.5, 1e-14);
    near(E.averageRate('cosine', 0, h) / h, -0.5, 1e-14);
  }
  assert.ok(E.model('sine').value(1e-20) > 0);
  assert.ok(E.model('cosine').derivative(1e-20) < 0);
});

test('tangent passes through P and has the derivative as its slope', () => {
  for (const id of ['square', 'cube', 'cubic', 'downward', 'sine', 'cosine']) {
    for (const a of [-1, 0, 1]) {
      const tangent = E.tangent(id, a);
      near(tangent.value(a), E.model(id).value(a));
      near(tangent.value(a + 0.5) - tangent.value(a), tangent.slope * 0.5);
      near(tangent.value(0), tangent.intercept);
      assert.equal(tangent.slope, E.model(id).derivative(a));
    }
  }
});

test('moving P changes the tangent slope', () => {
  assert.equal(E.tangent('square', -1).slope, -2);
  assert.equal(E.tangent('square', 0).slope, 0);
  assert.equal(E.tangent('square', 1).slope, 2);
});

test('increase and decrease intervals', () => {
  assert.deepEqual(E.intervals('cubic', -3, 3), [
    { left: -3, right: -1, sign: '正' },
    { left: -1, right: 1, sign: '負' },
    { left: 1, right: 3, sign: '正' }
  ]);
  assert.deepEqual(E.intervals('cube', -2, 2).map(interval => interval.sign), ['正', '正']);
  assert.equal(E.direction(null), '未定義');
});

test('stationary does not imply extremum', () => {
  assert.deepEqual(E.stationaryPoints('cube', -2, 2), [{ x: 0, y: 0, type: '極値ではない停留点' }]);
  assert.deepEqual(E.stationaryPoints('cubic', -2, 2), [
    { x: -1, y: 2, type: '極大' },
    { x: 1, y: -2, type: '極小' }
  ]);
  assert.equal(E.stationaryPoints('square', -2, 2)[0].type, '極小');
  assert.equal(E.stationaryPoints('downward', -1, 5)[0].type, '極大');
});

test('trigonometric stationary points have exact zero slopes', () => {
  for (const id of ['sine', 'cosine']) {
    const points = E.stationaryPoints(id, -2 * Math.PI, 2 * Math.PI);
    assert.ok(points.length >= 4);
    for (const point of points) assert.equal(E.model(id).derivative(point.x) === 0, true);
    assert.equal(E.stationaryPoints(id, 2.8, 3.5).length, id === 'sine' ? 0 : 1);
  }
});

test('absolute value is not differentiable at zero', () => {
  assert.equal(E.model('absolute').derivative(0), null);
  assert.equal(E.tangent('absolute', 0), null);
  for (const h of [1, 1e-10, 1e-100]) {
    assert.equal(E.averageRate('absolute', 0, h), 1);
    assert.equal(E.averageRate('absolute', 0, -h), -1);
  }
  assert.equal(E.tangent('absolute', -1).slope, -1);
  assert.equal(E.tangent('absolute', 1).slope, 1);
  assert.equal(E.stationaryPoints('absolute', -2, 2).length, 0);
});

test('invalid input is rejected without arbitrary code execution', () => {
  for (const bad of [NaN, Infinity, -Infinity]) {
    assert.throws(() => E.averageRate('square', bad, 1), RangeError);
    assert.throws(() => E.averageRate('square', 1, bad), RangeError);
    assert.throws(() => E.tangent('square', bad), RangeError);
  }
  assert.throws(() => E.model('constructor'), RangeError);
});

console.log(`${count} test groups passed`);
