(function (root) {
  'use strict';

  function finite(value) {
    if (!Number.isFinite(value)) throw new RangeError('有限の数を指定してください。');
    return value;
  }

  // 三角関数の解析的な零点で生じる浮動小数点の誤差だけを補正する。
  function isMultiple(value, offset, period) {
    const k = Math.round((value - offset) / period);
    const target = offset + k * period;
    if (target === 0) return value === 0;
    return Math.abs(value - target) <= 4 * Number.EPSILON * Math.max(1, Math.abs(value));
  }

  function sin(x) {
    return isMultiple(x, 0, Math.PI) ? 0 : Math.sin(x);
  }

  function cos(x) {
    return isMultiple(x, Math.PI / 2, Math.PI) ? 0 : Math.cos(x);
  }

  function sinc(x) {
    if (Math.abs(x) < 1e-4) return 1 - x * x / 6 + x ** 4 / 120;
    return Math.sin(x) / x;
  }

  function periodicPoints(left, right, offset, period) {
    const points = [];
    const first = Math.ceil((left - offset) / period);
    const last = Math.floor((right - offset) / period);
    for (let k = first; k <= last; k += 1) points.push(offset + k * period);
    return points;
  }

  // 式、導関数、安定した平均変化率、操作範囲を同じ定義で管理する。
  const FUNCTIONS = {
    square: {
      formula: 'x²', derivativeFormula: '2x', range: [-2, 2],
      value: x => x * x, derivative: x => 2 * x,
      quotient: (a, h) => 2 * a + h, zeros: () => [0]
    },
    cube: {
      formula: 'x³', derivativeFormula: '3x²', range: [-2, 2],
      value: x => x ** 3, derivative: x => 3 * x * x,
      quotient: (a, h) => 3 * a * a + 3 * a * h + h * h, zeros: () => [0]
    },
    cubic: {
      formula: 'x³ − 3x', derivativeFormula: '3x² − 3', range: [-2, 2],
      value: x => x ** 3 - 3 * x, derivative: x => 3 * (x - 1) * (x + 1),
      quotient: (a, h) => 3 * a * a + 3 * a * h + h * h - 3, zeros: () => [-1, 1]
    },
    downward: {
      formula: '−x² + 4x', derivativeFormula: '−2x + 4', range: [-1, 5],
      value: x => -x * x + 4 * x, derivative: x => -2 * x + 4,
      quotient: (a, h) => -2 * a - h + 4, zeros: () => [2]
    },
    sine: {
      formula: 'sin x', derivativeFormula: 'cos x', range: [-2 * Math.PI, 2 * Math.PI],
      value: sin, derivative: cos,
      quotient: (a, h) => (cos(a) * Math.cos(h / 2) - sin(a) * Math.sin(h / 2)) * sinc(h / 2),
      zeros: (left, right) => periodicPoints(left, right, Math.PI / 2, Math.PI)
    },
    cosine: {
      formula: 'cos x', derivativeFormula: '−sin x', range: [-2 * Math.PI, 2 * Math.PI],
      value: cos, derivative: x => -sin(x),
      quotient: (a, h) => -(sin(a) * Math.cos(h / 2) + cos(a) * Math.sin(h / 2)) * sinc(h / 2),
      zeros: (left, right) => periodicPoints(left, right, 0, Math.PI)
    },
    absolute: {
      formula: '|x|', derivativeFormula: '−1 (x < 0)、1 (x > 0)、x = 0では未定義', range: [-2, 2],
      value: Math.abs, derivative: x => x === 0 ? null : Math.sign(x),
      quotient: (a, h) => {
        const q = a + h;
        if (a >= 0 && q >= 0) return 1;
        if (a <= 0 && q <= 0) return -1;
        return (Math.abs(q) - Math.abs(a)) / h;
      },
      zeros: () => [], breaks: [0]
    }
  };

  function model(id) {
    if (!Object.prototype.hasOwnProperty.call(FUNCTIONS, id)) throw new RangeError('未対応の関数です。');
    return FUNCTIONS[id];
  }

  function averageRate(id, a, h) {
    finite(a);
    finite(h);
    if (h === 0) return null;
    return model(id).quotient(a, h);
  }

  function tangent(id, a) {
    finite(a);
    const f = model(id);
    const slope = f.derivative(a);
    if (slope === null) return null;
    const height = f.value(a);
    return { slope, height, intercept: height - slope * a, value: x => slope * (finite(x) - a) + height };
  }

  function direction(slope) {
    return slope === null ? '未定義' : slope === 0 ? '0' : slope > 0 ? '正' : '負';
  }

  function stationaryPoints(id, left, right) {
    const f = model(id);
    const candidates = f.zeros(left, right).filter(x => x >= left && x <= right);
    return candidates.map((x, index) => {
      // 隣の停留点との中間で左右の符号を判定する。
      const before = f.derivative((x + (candidates[index - 1] ?? x - 1)) / 2);
      const after = f.derivative((x + (candidates[index + 1] ?? x + 1)) / 2);
      const type = before > 0 && after < 0 ? '極大' : before < 0 && after > 0 ? '極小' : '極値ではない停留点';
      return { x, y: f.value(x), type };
    });
  }

  function intervals(id, left, right) {
    const f = model(id);
    const boundaries = [left, ...f.zeros(left, right), ...(f.breaks || []), right]
      .filter(x => x >= left && x <= right);
    const sorted = [...new Set(boundaries)].sort((a, b) => a - b);
    return sorted.slice(0, -1).map((start, index) => ({
      left: start, right: sorted[index + 1], sign: direction(f.derivative((start + sorted[index + 1]) / 2))
    }));
  }

  const api = { FUNCTIONS, model, averageRate, tangent, direction, stationaryPoints, intervals };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DifferentiationEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
