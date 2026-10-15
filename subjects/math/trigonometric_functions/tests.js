'use strict';

const assert = require('node:assert/strict');
const M = require('./math.js');
let tests = 0;

function test(name, run) {
  run();
  tests += 1;
  console.log('PASS', name);
}

function near(actual, expected, tolerance = 1e-10) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);
}

const angles = [
  [0, 0, 1, 0],
  [30, 0.5, Math.sqrt(3) / 2, Math.sqrt(3) / 3],
  [45, Math.SQRT1_2, Math.SQRT1_2, 1],
  [60, Math.sqrt(3) / 2, 0.5, Math.sqrt(3)],
  [90, 1, 0, null],
  [180, 0, -1, 0],
  [270, -1, 0, null],
  [360, 0, 1, 0],
  [-90, -1, 0, null],
  [-30, -0.5, Math.sqrt(3) / 2, -Math.sqrt(3) / 3]
];

for (const [degrees, sin, cos, tan] of angles) {
  test(`representative angle ${degrees}`, () => {
    const values = M.trig(M.toRadians(degrees));
    near(values.sin, sin);
    near(values.cos, cos);
    if (tan === null) assert.equal(values.tan, null);
    else near(values.tan, tan);
    assert.ok(values.exact);
  });
}

test('all representative angles and signs', () => {
  for (const degrees of [120, 135, 150, 210, 225, 240, 300, 315, 330]) {
    const angle = M.toRadians(degrees);
    const values = M.trig(angle);
    assert.ok(values.exact);
    near(values.sin, Math.sin(angle));
    near(values.cos, Math.cos(angle));
    near(values.tan, Math.tan(angle));
  }
});

test('conversion and multiple revolutions', () => {
  near(M.toRadians(180), Math.PI);
  near(M.toDegrees(Math.PI * 2), 360);
  near(M.normalize(-Math.PI / 2), Math.PI * 1.5);
  assert.equal(M.normalize(4 * Math.PI), 0);
});

test('quadrants and axes', () => {
  [45, 135, 225, 315].forEach((degrees, index) => {
    assert.equal(M.quadrant(M.toRadians(degrees)), `第${index + 1}象限`);
  });
  for (const degrees of [0, 90, 180, 270, -360]) assert.equal(M.quadrant(M.toRadians(degrees)), '座標軸上');
});

test('periodicity, symmetry and identity across general angles', () => {
  for (let i = -200; i <= 200; i += 1) {
    const angle = i / 19;
    const value = M.trig(angle);
    const periodic = M.trig(angle + M.TAU);
    near(value.sin, periodic.sin);
    near(value.cos, periodic.cos);
    near(value.sin ** 2 + value.cos ** 2, 1);
    near(M.trig(-angle).sin, -value.sin);
    near(M.trig(-angle).cos, value.cos);
    near(M.trig(angle + Math.PI).tan, value.tan, 1e-8);
  }
});

test('undefined tan and one-sided behavior', () => {
  for (let k = -4; k <= 4; k += 1) {
    const pole = Math.PI / 2 + k * Math.PI;
    assert.equal(M.trig(pole).tan, null);
    assert.ok(M.trig(pole - 1e-7).tan > 1e6);
    assert.ok(M.trig(pole + 1e-7).tan < -1e6);
  }
  assert.deepEqual(M.asymptotes(-Math.PI, Math.PI), [-Math.PI / 2, Math.PI / 2]);
});

test('transformations, phase shift and negative coefficients', () => {
  const coefficients = { a: -2, b: -3, c: 0.7, d: 1 };
  for (const kind of ['sin', 'cos']) {
    const properties = M.properties(kind, coefficients);
    assert.equal(properties.amplitude, 2);
    near(properties.period, M.TAU / 3);
    near(properties.shift, 0.7 / 3);
    for (const x of [-1, 0, 0.5, 2]) {
      near(M.transformed(kind, x, coefficients), -2 * Math[kind](-3 * x + 0.7) + 1);
      near(M.transformed(kind, x + properties.period, coefficients), M.transformed(kind, x, coefficients));
    }
  }
});

test('zero coefficients produce constants without period or phase', () => {
  for (const kind of ['sin', 'cos']) {
    const zeroA = { a: 0, b: 2, c: 1, d: -3 };
    assert.equal(M.properties(kind, zeroA).constant, -3);
    const zeroB = { a: 2, b: 0, c: Math.PI / 2, d: 1 };
    const properties = M.properties(kind, zeroB);
    near(properties.constant, 2 * Math[kind](Math.PI / 2) + 1);
    assert.equal(properties.period, null);
    assert.equal(properties.shift, null);
    near(M.transformed(kind, -10, zeroB), properties.constant);
  }
});

test('invalid inputs and near-axis values', () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.throws(() => M.trig(value), RangeError);
    assert.throws(() => M.toRadians(value), RangeError);
  }
  assert.ok(M.trig(1e-8).sin > 0);
  assert.equal(M.trig(Math.PI / 2 - 1e-8).exact, null);
  assert.ok(Number.isFinite(M.trig(Math.PI / 2 - 1e-8).tan));
});

console.log(`${tests} test groups passed`);
