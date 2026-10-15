'use strict';

const assert = require('node:assert/strict');
const E = require('./engine.js');
let count = 0;

function test(name, run) {
  run();
  count += 1;
  console.log('PASS', name);
}

function near(actual, expected, tolerance = 1e-11) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
}

for (const n of [1, 2, 4, 100]) {
  test(`x² [0,1] n=${n}`, () => {
    const result = E.rectangleSum('square', 0, 1, n);
    const expected = (n + 1) * (2 * n + 1) / (6 * n * n);
    near(result.sum, expected);
    near(result.integral, 1 / 3);
    near(result.width, 1 / n);
    assert.equal(result.rectangles.length, n);
    result.rectangles.forEach((rectangle, i) => {
      near(rectangle.right, (i + 1) / n);
      near(rectangle.height, ((i + 1) / n) ** 2);
    });
  });
}

test('initial example values and exact fractions', () => {
  near(E.rectangleSum('square', 0, 1, 4).sum, 0.46875);
  near(E.rectangleSum('square', 0, 1, 4).error, 0.13541666666666666);
  assert.equal(E.exactIntegral('square', 0, 1), '1/3');
  assert.equal(E.exactIntegral('square', 0, 2), '8/3');
  assert.equal(E.squareExample(4).exactSum, '15/32');
});

test('x² formula agrees with rectangle sums and converges from above', () => {
  let previous = Infinity;
  for (let n = 1; n <= 200; n += 1) {
    const result = E.rectangleSum('square', 0, 1, n);
    const example = E.squareExample(n);
    near(result.sum, example.sum);
    near(result.error, example.error);
    assert.ok(result.sum > 1 / 3 && result.sum < previous);
    previous = result.sum;
  }
});

test('all polynomial integrals and exact finite decimal bounds', () => {
  for (const [id, value] of [['linear', 0.5], ['square', 1 / 3], ['cube', 0.25], ['affine', 2], ['arch', 1 / 6], ['shifted', -2 / 3]]) {
    near(E.integral(id, 0, 1), value);
  }
  assert.equal(E.exactIntegral('linear', 0, 0.5), '1/8');
  assert.equal(E.exactIntegral('arch', 0, 1), '1/6');
  assert.equal(E.exactIntegral('shifted', -2, 2), '4/3');
  near(E.integral('cube', -1, 1), 0);
  assert.equal(E.exactIntegral('cube', -1, 1), '0');
});

test('sin uses radians and analytic antiderivative', () => {
  near(E.integral('sine', 0, Math.PI), 2);
  near(E.integral('sine', -Math.PI, Math.PI), 0);
  near(E.integral('sine', 0.2, 1.3), Math.cos(0.2) - Math.cos(1.3));
  assert.equal(E.exactIntegral('sine', 0, Math.PI), '2');
  assert.equal(E.exactIntegral('sine', -Math.PI, Math.PI), '0');
  assert.equal(E.exactIntegral('sine', 0.2, 1.3), null);
  assert.equal(E.value('sine', Math.PI), 0);
});

test('short intervals avoid subtractive cancellation', () => {
  const a = 1;
  const b = 1 + 1e-12;
  near(E.integral('square', a, b) / (b - a), 1, 1e-10);
  near(E.integral('sine', a, b) / (b - a), Math.sin(1), 1e-10);
});

test('negative and mixed rectangle contributions are signed', () => {
  const negative = E.rectangleSum('linear', -2, -1, 2);
  near(negative.sum, -1.25);
  assert.ok(negative.rectangles.every(rectangle => rectangle.height < 0));
  const mixed = E.rectangleSum('cube', -1, 1, 4);
  near(mixed.sum, 0.5);
  assert.ok(mixed.rectangles.some(rectangle => rectangle.height < 0));
  assert.ok(mixed.rectangles.some(rectangle => rectangle.height > 0));
});

test('geometric area differs from signed integral at crossings', () => {
  const cube = E.geometry('cube', -1, 1);
  near(cube.positive, 0.25);
  near(cube.negative, 0.25);
  near(cube.area, 0.5);
  near(E.integral('cube', -1, 1), 0);
  const shifted = E.geometry('shifted', -2, 2);
  near(shifted.area, 4);
  near(E.integral('shifted', -2, 2), 4 / 3);
  assert.deepEqual(E.roots('shifted', -2, 2), [-1, 1]);
  near(E.geometry('sine', -Math.PI, Math.PI).area, 4);
});

test('zero-width intervals return zero for every function', () => {
  for (const id of Object.keys(E.MODELS)) {
    const result = E.rectangleSum(id, 1, 1, 200);
    assert.equal(result.width, 0);
    assert.equal(result.sum, 0);
    assert.equal(result.integral, 0);
    assert.equal(result.error, 0);
    assert.equal(E.geometry(id, 1, 1).area, 0);
    assert.equal(E.exactIntegral(id, 1, 1), '0');
  }
});

test('right-end rule on arbitrary intervals equals explicit Σ', () => {
  for (const id of Object.keys(E.MODELS)) {
    for (const n of [1, 7, 200]) {
      const a = -0.7;
      const b = 1.4;
      const dx = (b - a) / n;
      let expected = 0;
      for (let k = 1; k <= n; k += 1) expected += E.value(id, a + k * dx) * dx;
      near(E.rectangleSum(id, a, b, n).sum, expected);
    }
  }
});

test('invalid intervals and counts are rejected', () => {
  for (const n of [0, -1, 201, 1.5, NaN, Infinity]) assert.throws(() => E.rectangleSum('square', 0, 1, n), RangeError);
  for (const [a, b] of [[1, 0], [NaN, 1], [0, Infinity], [-7, 0]]) assert.throws(() => E.integral('square', a, b), RangeError);
  assert.throws(() => E.model('constructor'), RangeError);
});

console.log(`${count} test groups passed`);
