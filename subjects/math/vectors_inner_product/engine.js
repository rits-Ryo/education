(function (root) {
  'use strict';
  const display = typeof module !== 'undefined' && module.exports
    ? require('../../../number-format.js') : root.NumberDisplay;
  const LIMIT = 1000000;
  const NEAR_ORTHOGONAL = 1e-12;
  function valid(v) {
    return Array.isArray(v) && v.length === 2 &&
      v.every(x => Number.isFinite(x) && Math.abs(x) <= LIMIT);
  }

  // Interpret the finite Number's shortest decimal representation as the input.
  // This preserves decimal cancellation without rounding each product to binary64.
  // BigInt is bounded here: components have at most 17 digits and exponents >= -324.
  function decimal(x) {
    const [digits, power = '0'] = String(x).toLowerCase().split('e');
    const fraction = (digits.split('.')[1] || '').length;
    return { n: BigInt(digits.replace('.', '')), e: Number(power) - fraction };
  }
  function exactDot(a, b) {
    const products = a.map((x, i) => {
      const left = decimal(x), right = decimal(b[i]);
      return { n: left.n * right.n, e: left.e + right.e };
    });
    const e = Math.min(...products.map(p => p.e));
    return { n: products.reduce((sum, p) => sum + p.n * 10n ** BigInt(p.e - e), 0n), e };
  }
  function scientific(value) {
    if (value.n === 0n) return { m: 0, e: 0 };
    const negative = value.n < 0n;
    const digits = (negative ? -value.n : value.n).toString();
    return {
      m: (negative ? -1 : 1) * Number(digits[0] + '.' + digits.slice(1)),
      e: value.e + digits.length - 1
    };
  }
  function numberFromScientific(s) {
    // String conversion avoids prematurely underflowing 10 ** exponent.
    return Number(`${s.m}e${s.e}`);
  }
  function ratioScientific(s, denominators) {
    let m = s.m, e = s.e;
    for (const denominator of denominators) {
      const d = scientific(decimal(denominator));
      m /= d.m;
      e -= d.e;
    }
    const normalized = scientific(decimal(m));
    return { m: normalized.m, e: normalized.e + e };
  }
  function calculate(a, b) {
    if (!valid(a) || !valid(b)) {
      throw new RangeError('成分は−1000000〜1000000の有限な数で入力してください。');
    }
    const lengthA = Math.hypot(...a), lengthB = Math.hypot(...b);
    const zeroA = a.every(x => x === 0), zeroB = b.every(x => x === 0);
    const maxA = Math.max(...a.map(Math.abs)), maxB = Math.max(...b.map(Math.abs));
    const aa = zeroA ? null : a.map(x => x / maxA);
    const bb = zeroB ? null : b.map(x => x / maxB);
    const normA = aa ? Math.hypot(...aa) : null;
    const normB = bb ? Math.hypot(...bb) : null;
    const u = aa ? aa.map(x => x / normA) : null;
    const v = bb ? bb.map(x => x / normB) : null;

    const exact = exactDot(a, b), magnitude = scientific(exact);
    const dot = numberFromScientific(magnitude);
    const sign = exact.n === 0n ? 'zero' : exact.n > 0n ? 'positive' : 'negative';
    const underflow = exact.n !== 0n && dot === 0;
    const dotText = formatScientific(magnitude);
    const cosine = zeroA || zeroB ? null : ratioScientific(magnitude, [maxA, maxB, normA, normB]);
    const cos = cosine === null ? null : Math.max(-1, Math.min(1, numberFromScientific(cosine)));
    const cosText = cosine === null ? format(null) : formatScientific(cosine);
    const cross = u && v ? u[0] * v[1] - u[1] * v[0] : null;
    const exactOrthogonal = !zeroA && !zeroB && exact.n === 0n;
    // This is an angular proximity hint, never a rule for replacing the dot by 0.
    const nearOrthogonal = !zeroA && !zeroB && !exactOrthogonal && Math.abs(cos) < NEAR_ORTHOGONAL;
    const angle = cos === null ? null : exactOrthogonal ? 90 :
      Math.atan2(Math.abs(cross), cos) * 180 / Math.PI;
    const scalarMagnitude = zeroA ? null : ratioScientific(magnitude, [maxA, normA]);
    const scalar = scalarMagnitude === null ? null : numberFromScientific(scalarMagnitude);
    const scalarText = scalarMagnitude === null ? format(null) : formatScientific(scalarMagnitude);
    const projection = u ? u.map(x => x * scalar || 0) : null;
    const projectionText = u ? u.map(x => {
      const factor = scientific(decimal(x));
      const product = scientific(decimal(factor.m * scalarMagnitude.m));
      return formatScientific({ m: product.m, e: product.e + factor.e + scalarMagnitude.e });
    }) : null;
    // Geometry uses the same mathematical dot. Re-multiplication is retained only
    // as a numerical estimate for tests; it must not become another sign authority.
    const geometricEstimate = cos === null ? 0 : lengthA * (lengthB * cos);
    const geometric = dot;
    return { unitA: u, unitB: v, underflow, dotText, lengthA, lengthB, dot, cos, angle,
      scalar, scalarText, cosText, projection, projectionText, geometric, geometricEstimate, zeroA, zeroB,
      exactOrthogonal, nearOrthogonal, sign };
  }
  function preset(degrees) {
    if (![0,45,90,120,180].includes(degrees)) throw new RangeError('未対応の角度');
    const coords = {0:[4,0],45:[2*Math.SQRT2,2*Math.SQRT2],90:[0,4],120:[-2,2*Math.sqrt(3)],180:[-4,0]};
    return { a:[4,0], b:coords[degrees].slice() };
  }
  function formatScientific(s) {
    const value = numberFromScientific(s);
    if (s.m !== 0 && value === 0) {
      return display.formatScientific(s.m, s.e);
    }
    return format(value);
  }
  function format(x) {
    if (x === null) return '定義されない';
    return display.formatNonzero(x);
  }
  const api = { LIMIT, NEAR_ORTHOGONAL, calculate, preset, format };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.VectorEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
