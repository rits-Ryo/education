(function (root) {
  'use strict';

  const TAU = 2 * Math.PI;
  // 代表角の判定にだけ使用する。未定義点付近の値を0には丸めない。
  const ANGLE_EPSILON = 1e-12;

  function finite(value) {
    if (!Number.isFinite(value)) throw new RangeError('有限の数を入力してください。');
    return value;
  }

  function toRadians(degrees) {
    return finite(degrees) * Math.PI / 180;
  }

  function toDegrees(radians) {
    return finite(radians) * 180 / Math.PI;
  }

  function normalize(angle) {
    finite(angle);
    return ((angle % TAU) + TAU) % TAU;
  }

  const EXACT = [
    [0, '0', '1', '0'],
    [30, '1/2', '√3/2', '√3/3'],
    [45, '√2/2', '√2/2', '1'],
    [60, '√3/2', '1/2', '√3'],
    [90, '1', '0', null],
    [120, '√3/2', '−1/2', '−√3'],
    [135, '√2/2', '−√2/2', '−1'],
    [150, '1/2', '−√3/2', '−√3/3'],
    [180, '0', '−1', '0'],
    [210, '−1/2', '−√3/2', '√3/3'],
    [225, '−√2/2', '−√2/2', '1'],
    [240, '−√3/2', '−1/2', '√3'],
    [270, '−1', '0', null],
    [300, '−√3/2', '1/2', '−√3'],
    [315, '−√2/2', '√2/2', '−1'],
    [330, '−1/2', '√3/2', '−√3/3']
  ];

  function trig(angle) {
    const reduced = normalize(angle);
    const exact = EXACT.find(row => Math.abs(reduced - toRadians(row[0])) < ANGLE_EPSILON)
      || (Math.abs(reduced - TAU) < ANGLE_EPSILON ? EXACT[0] : null);
    let sin = Math.sin(reduced);
    let cos = Math.cos(reduced);
    if (exact) {
      if (exact[1] === '0') sin = 0;
      if (exact[2] === '0') cos = 0;
    }
    return {
      sin,
      cos,
      tan: cos === 0 ? null : sin / cos,
      exact: exact ? { sin: exact[1], cos: exact[2], tan: exact[3] } : null
    };
  }

  function quadrant(angle) {
    const values = trig(angle);
    if (values.sin === 0 || values.cos === 0) return '座標軸上';
    if (values.sin > 0) return values.cos > 0 ? '第1象限' : '第2象限';
    return values.cos < 0 ? '第3象限' : '第4象限';
  }

  function transformed(kind, x, coefficients) {
    const { a, b, c, d } = coefficients;
    [a, b, c, d, x].forEach(finite);
    return a * trig(b * x + c)[kind] + d;
  }

  function properties(kind, coefficients) {
    const { a, b, c, d } = coefficients;
    [a, b, c, d].forEach(finite);
    if (a === 0 || b === 0) {
      return { constant: transformed(kind, 0, coefficients), amplitude: 0, period: null, shift: null };
    }
    return { constant: null, amplitude: Math.abs(a), period: TAU / Math.abs(b), shift: -c / b };
  }

  // tanの各連続区間を別々に描くための境界。
  function asymptotes(left, right) {
    const result = [];
    const first = Math.ceil((left - Math.PI / 2) / Math.PI);
    const last = Math.floor((right - Math.PI / 2) / Math.PI);
    for (let k = first; k <= last; k += 1) result.push(Math.PI / 2 + k * Math.PI);
    return result;
  }

  const api = { TAU, toRadians, toDegrees, normalize, trig, quadrant, transformed, properties, asymptotes };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TrigMath = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
