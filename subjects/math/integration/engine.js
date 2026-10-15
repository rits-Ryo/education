(function (root) {
  'use strict';

  const LIMIT = 2 * Math.PI;
  const MODELS = {
    linear: { formula: 'x', primitive: 'x²/2', coefficients: [0, 1], zeros: [0], initial: [0, 1] },
    square: { formula: 'x²', primitive: 'x³/3', coefficients: [0, 0, 1], zeros: [0], initial: [0, 1] },
    cube: { formula: 'x³', primitive: 'x⁴/4', coefficients: [0, 0, 0, 1], zeros: [0], initial: [-1, 1] },
    affine: { formula: '2x + 1', primitive: 'x² + x', coefficients: [1, 2], zeros: [-0.5], initial: [0, 1] },
    arch: { formula: 'x(1 − x)', primitive: 'x²/2 − x³/3', coefficients: [0, 1, -1], zeros: [0, 1], initial: [0, 1] },
    sine: { formula: 'sin x', primitive: '−cos x', initial: [0, Math.PI] },
    shifted: { formula: 'x² − 1', primitive: 'x³/3 − x', coefficients: [-1, 0, 1], zeros: [-1, 1], initial: [-2, 2] }
  };

  function model(id) {
    if (!Object.prototype.hasOwnProperty.call(MODELS, id)) throw new RangeError('未対応の関数です。');
    return MODELS[id];
  }

  function validateInterval(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > LIMIT || Math.abs(b) > LIMIT) {
      throw new RangeError('区間の両端は−2π〜2πの有限の数にしてください。');
    }
    if (a > b) throw new RangeError('a ≦ bにしてください。');
  }

  function validateCount(n) {
    if (!Number.isInteger(n) || n < 1 || n > 200) throw new RangeError('nは1〜200の整数にしてください。');
  }

  function value(id, x) {
    const f = model(id);
    if (id === 'sine') {
      const nearest = Math.round(x / Math.PI) * Math.PI;
      if (x === 0 || (nearest !== 0 && Math.abs(x - nearest) <= 4 * Number.EPSILON * Math.max(1, Math.abs(x)))) return 0;
      return Math.sin(x);
    }
    return f.coefficients.reduceRight((total, coefficient) => total * x + coefficient, 0);
  }

  // b^p − a^pを直接引かずに因数分解し、短い区間での桁落ちを抑える。
  function integral(id, a, b) {
    validateInterval(a, b);
    const f = model(id);
    if (a === b) return 0;
    if (id === 'sine') return 2 * value('sine', (a + b) / 2) * Math.sin((b - a) / 2);
    let result = 0;
    f.coefficients.forEach((coefficient, degree) => {
      let powers = 0;
      for (let j = 0; j <= degree; j += 1) powers += b ** (degree - j) * a ** j;
      result += coefficient * (b - a) * powers / (degree + 1);
    });
    return result;
  }

  function roots(id, a, b) {
    const f = model(id);
    if (id !== 'sine') return f.zeros.filter(x => x > a && x < b);
    const result = [];
    for (let k = Math.ceil(a / Math.PI); k <= Math.floor(b / Math.PI); k += 1) {
      const x = k * Math.PI;
      if (x > a && x < b) result.push(x);
    }
    return result;
  }

  function signedRegions(id, a, b) {
    validateInterval(a, b);
    const boundaries = [a, ...roots(id, a, b), b];
    return boundaries.slice(0, -1).filter((left, i) => left !== boundaries[i + 1]).map((left, i) => {
      const right = boundaries[i + 1];
      return { left, right, sign: Math.sign(value(id, (left + right) / 2)), integral: integral(id, left, right) };
    });
  }

  function geometry(id, a, b) {
    const regions = signedRegions(id, a, b);
    const positive = regions.reduce((sum, region) => sum + Math.max(0, region.integral), 0);
    const negative = regions.reduce((sum, region) => sum + Math.max(0, -region.integral), 0);
    return { regions, positive, negative, area: positive + negative };
  }

  function rectangleSum(id, a, b, n) {
    validateInterval(a, b);
    validateCount(n);
    model(id);
    const width = (b - a) / n;
    const rectangles = [];
    let sum = 0;
    let compensation = 0;
    for (let k = 1; k <= n; k += 1) {
      const left = a + (k - 1) * width;
      const right = k === n ? b : a + k * width;
      const height = value(id, right);
      const contribution = height * width;
      // 正負の寄与が混ざる場合にも加算誤差を抑える。
      const adjusted = contribution - compensation;
      const next = sum + adjusted;
      compensation = (next - sum) - adjusted;
      sum = next;
      rectangles.push({ k, left, right, height, contribution });
    }
    const exactValue = integral(id, a, b);
    return { n, width, rectangles, sum, integral: exactValue, error: Math.abs(sum - exactValue) };
  }

  // 有限小数の多項式積分をBigIntの分数で表し、解析式と小数を区別する。
  function gcd(a, b) {
    a = a < 0n ? -a : a;
    while (b !== 0n) [a, b] = [b, a % b];
    return a;
  }

  function fraction(numerator, denominator = 1n) {
    const divisor = gcd(numerator, denominator);
    return { numerator: numerator / divisor, denominator: denominator / divisor };
  }

  function add(a, b) {
    return fraction(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
  }

  function multiply(a, b) {
    return fraction(a.numerator * b.numerator, a.denominator * b.denominator);
  }

  function decimalFraction(x) {
    const [mantissa, exponent = '0'] = x.toString().split('e');
    const decimals = (mantissa.split('.')[1] || '').length;
    const numerator = BigInt(mantissa.replace('.', ''));
    const power = decimals - Number(exponent);
    return power >= 0 ? fraction(numerator, 10n ** BigInt(power)) : fraction(numerator * 10n ** BigInt(-power));
  }

  function fractionText(result) {
    const { numerator, denominator } = result;
    if (numerator.toString().length > 18 || denominator.toString().length > 18) return null;
    return denominator === 1n ? numerator.toString() : `${numerator}/${denominator}`;
  }

  function exactIntegral(id, a, b) {
    validateInterval(a, b);
    const f = model(id);
    if (a === b) return '0';
    if (id === 'sine') {
      function exactCos(x) {
        const halfTurns = Math.round(x / (Math.PI / 2));
        if (Math.abs(x - halfTurns * Math.PI / 2) > 4 * Number.EPSILON * Math.max(1, Math.abs(x))) return null;
        return [1, 0, -1, 0][((halfTurns % 4) + 4) % 4];
      }
      const left = exactCos(a);
      const right = exactCos(b);
      return left === null || right === null ? null : String(left - right);
    }
    function primitive(x) {
      const rational = decimalFraction(x);
      let power = fraction(1n);
      let sum = fraction(0n);
      f.coefficients.forEach((coefficient, degree) => {
        power = multiply(power, rational);
        sum = add(sum, multiply(power, fraction(BigInt(coefficient), BigInt(degree + 1))));
      });
      return sum;
    }
    const left = primitive(a);
    const right = primitive(b);
    return fractionText(add(right, fraction(-left.numerator, left.denominator)));
  }

  function squareExample(n) {
    validateCount(n);
    const count = BigInt(n);
    return {
      sum: Number((count + 1n) * (2n * count + 1n)) / (6 * n * n),
      exactSum: fractionText(fraction((count + 1n) * (2n * count + 1n), 6n * count * count)),
      error: 1 / (2 * n) + 1 / (6 * n * n)
    };
  }

  const api = { LIMIT, MODELS, model, value, validateInterval, validateCount, integral, roots, signedRegions, geometry, rectangleSum, exactIntegral, squareExample };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.IntegrationEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
