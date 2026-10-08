/* Safe expression AST and extrema engine; no dynamic JavaScript execution. */
(function (root) {
  'use strict';
  const funcs = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    abs: Math.abs,
    sqrt: Math.sqrt,
    exp: Math.exp,
    log: Math.log,
    ln: Math.log,
    floor: Math.floor,
    ceil: Math.ceil
  };
  function parse(source) {
    const s = source
      .replace(/[−–]/g, '-')
      .replace(/[×]/g, '*')
      .replace(/[÷]/g, '/')
      .replace(/π/g, 'pi')
      .replace(/\*\*/g, '^');
    const tokens =
      s.match(
        /(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?|[A-Za-z]+|[()+*/^,-]/g
      ) || [];
    if (tokens.join('') !== s.replace(/\s/g, '') || tokens.length > 250)
      throw Error('数式に使用できない文字があるか、式が長すぎます。');
    let i = 0;
    const peek = () => tokens[i];
    function atom() {
      let t = tokens[i++];
      if (!t) throw Error('数式が途中で終わっています。');
      if (t === '(') {
        const n = expr(0);
        if (tokens[i++] !== ')') throw Error('括弧が対応していません。');
        return n;
      }
      if (t === '+' || t === '-')
        return { op: t === '-' ? 'neg' : 'pos', a: expr(25) };
      if (/^\d|^\./.test(t)) return { op: 'num', v: Number(t) };
      if (/^[A-Za-z]+$/.test(t)) {
        if (funcs[t]) {
          if (tokens[i++] !== '(')
            throw Error(t + ' は括弧で引数を指定してください。');
          let a = expr(0);
          if (tokens[i++] !== ')')
            throw Error('関数の括弧が対応していません。');
          return { op: 'fn', name: t, a };
        }
        if (t === 'pi' || t === 'e')
          return { op: 'num', v: t === 'pi' ? Math.PI : Math.E };
        if (!/^[a-z]$/.test(t))
          throw Error('変数は x または a〜z の1文字です。');
        return { op: 'var', name: t };
      }
      throw Error('数式の書き方を確認してください。');
    }
    function expr(min) {
      let a = atom();
      while (i < tokens.length) {
        let t = peek(),
          implicit = /^(?:\d|\.|[A-Za-z]|\()/.test(t);
        let p =
          t === '+' || t === '-'
            ? 10
            : t === '*' || t === '/' || implicit
              ? 20
              : t === '^'
                ? 30
                : -1;
        if (p < min) break;
        if (!implicit) i++;
        let b = expr(t === '^' ? p : p + 1);
        a = { op: implicit ? '*' : t, a, b };
      }
      return a;
    }
    const tree = expr(0);
    if (i !== tokens.length) throw Error('余分な記号があります。');
    return tree;
  }
  function evaluate(n, scope) {
    switch (n.op) {
      case 'num':
        return n.v;
      case 'var':
        if (!(n.name in scope)) throw Error('未設定の変数 ' + n.name);
        return scope[n.name];
      case 'neg':
        return -evaluate(n.a, scope);
      case 'pos':
        return evaluate(n.a, scope);
      case 'fn':
        return funcs[n.name](evaluate(n.a, scope));
    }
    const a = evaluate(n.a, scope),
      b = evaluate(n.b, scope);
    switch (n.op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
      case '^':
        return a ** b;
    }
  }
  function variables(n, set = new Set()) {
    if (n.op === 'var') set.add(n.name);
    if (n.a) variables(n.a, set);
    if (n.b) variables(n.b, set);
    return set;
  }
  function polynomial(n, scope) {
    if (n.op === 'num') return [n.v];
    if (n.op === 'var') return n.name === 'x' ? [0, 1] : [scope[n.name]];
    if (!variables(n).has('x')) {
      const v = evaluate(n, scope);
      return Number.isFinite(v) ? [v] : null;
    }
    const a = n.a && polynomial(n.a, scope),
      b = n.b && polynomial(n.b, scope);
    if (!a) return null;
    if (n.op === 'neg') return a.map((v) => -v);
    if (n.op === 'pos') return a;
    if (!b) return null;
    let r;
    if (n.op === '+' || n.op === '-')
      r = Array.from(
        { length: Math.max(a.length, b.length) },
        (_, i) => (a[i] || 0) + (n.op === '+' ? 1 : -1) * (b[i] || 0)
      );
    else if (n.op === '*') {
      r = Array(a.length + b.length - 1).fill(0);
      a.forEach((v, i) => b.forEach((w, j) => (r[i + j] += v * w)));
    } else if (n.op === '/' && b.length === 1 && b[0] !== 0)
      r = a.map((v) => v / b[0]);
    else if (
      n.op === '^' &&
      b.length === 1 &&
      Number.isInteger(b[0]) &&
      b[0] >= 0 &&
      b[0] <= 2
    ) {
      r = [1];
      for (let k = 0; k < b[0]; k++) {
        let z = Array(r.length + a.length - 1).fill(0);
        r.forEach((v, i) => a.forEach((w, j) => (z[i + j] += v * w)));
        r = z;
      }
    } else return null;
    while (r.length > 1 && r.at(-1) === 0) r.pop();
    return r.length <= 3 && r.every(Number.isFinite) ? r : null;
  }
  // Interval arithmetic proves real-valued continuity only for a conservative subset.
  function interval(n, s, L, R) {
    if (n.op === 'num') return [n.v, n.v];
    if (n.op === 'var') return n.name === 'x' ? [L, R] : [s[n.name], s[n.name]];
    let a = interval(n.a, s, L, R);
    if (!a) return null;
    if (n.op === 'neg') return [-a[1], -a[0]];
    if (n.op === 'pos') return a;
    if (n.op === 'fn') {
      switch (n.name) {
        case 'sin':
        case 'cos':
          return [-1, 1];
        case 'abs':
          return [
            a[0] <= 0 && a[1] >= 0
              ? 0
              : Math.min(Math.abs(a[0]), Math.abs(a[1])),
            Math.max(Math.abs(a[0]), Math.abs(a[1]))
          ];
        case 'sqrt':
          return a[0] >= 0 ? [Math.sqrt(a[0]), Math.sqrt(a[1])] : null;
        case 'log':
        case 'ln':
          return a[0] > 0 ? [Math.log(a[0]), Math.log(a[1])] : null;
        case 'exp':
          return [Math.exp(a[0]), Math.exp(a[1])];
        default:
          return null;
      }
    }
    let b = interval(n.b, s, L, R);
    if (!b) return null;
    switch (n.op) {
      case '+':
        return [a[0] + b[0], a[1] + b[1]];
      case '-':
        return [a[0] - b[1], a[1] - b[0]];
      case '*': {
        const v = [a[0] * b[0], a[0] * b[1], a[1] * b[0], a[1] * b[1]];
        return [Math.min(...v), Math.max(...v)];
      }
      case '/': {
        if (b[0] <= 0 && b[1] >= 0) return null;
        const v = [a[0] / b[0], a[0] / b[1], a[1] / b[0], a[1] / b[1]];
        return [Math.min(...v), Math.max(...v)];
      }
      case '^': {
        if (b[0] !== b[1]) return null;
        const p = b[0];
        if (
          (!Number.isInteger(p) && a[0] < 0) ||
          (p < 0 && a[0] <= 0 && a[1] >= 0)
        )
          return null;
        const v = [a[0] ** p, a[1] ** p];
        if (
          Number.isInteger(p) &&
          p > 0 &&
          p % 2 === 0 &&
          a[0] <= 0 &&
          a[1] >= 0
        )
          v.push(0);
        return [Math.min(...v), Math.max(...v)];
      }
    }
    return null;
  }
  function solve(tree, s, L, R) {
    if (!Number.isFinite(L) || !Number.isFinite(R) || L > R)
      throw Error('定義域は有限で、左端 ≦ 右端にしてください。');
    const p = polynomial(tree, s),
      f = (x) => evaluate(tree, { ...s, x });
    if (L === R) {
      let y = f(L);
      if (!Number.isFinite(y)) throw Error('この点では関数が定義されません。');
      return {
        exact: !!p,
        min: y,
        max: y,
        minX: [L],
        maxX: [L],
        p,
        constant: true
      };
    }
    let pts = [L, R],
      vertex = null;
    if (p) {
      let A = p[2] || 0,
        B = p[1] || 0;
      let minX, maxX;
      if (A === 0) {
        minX = B > 0 ? [L] : B < 0 ? [R] : [L, R];
        maxX = B > 0 ? [R] : B < 0 ? [L] : [L, R];
      } else {
        vertex = -B / (2 * A) || 0;
        const near = Math.max(L, Math.min(R, vertex)) || 0,
          mid = L + (R - L) / 2,
          far = vertex < mid ? [R] : vertex > mid ? [L] : [L, R];
        minX = A > 0 ? [near] : far;
        maxX = A > 0 ? far : [near];
      }
      const min = f(minX[0]),
        max = f(maxX[0]);
      if (
        !Number.isFinite(min) ||
        !Number.isFinite(max) ||
        (vertex !== null && !Number.isFinite(vertex))
      )
        throw Error('計算可能な数値の範囲を超えました。');
      return {
        exact: true,
        p,
        vertex,
        min,
        max,
        minX,
        maxX,
        constant: p.length === 1
      };
    } else {
      const range = interval(tree, s, L, R);
      if (!range || !range.every(Number.isFinite))
        throw Error(
          '定義域全体での連続性・定義を確認できません。最大・最小は判定できません。式や定義域を変更してください。'
        );
      for (let i = 1; i < 2048; i++) pts.push(L + ((R - L) * i) / 2048);
      // Refine sampled local extrema with bounded golden-section search.
      const sampled = pts.slice(2).sort((a, b) => a - b);
      let xs = [L, ...sampled, R],
        ys = xs.map(f);
      if (ys.some((y) => !Number.isFinite(y)))
        throw Error('未定義点が検出されました。');
      for (let i = 1; i < xs.length - 1; i++)
        for (const sign of [1, -1])
          if (
            sign * ys[i] <= sign * ys[i - 1] &&
            sign * ys[i] <= sign * ys[i + 1] &&
            (ys[i] !== ys[i - 1] || ys[i] !== ys[i + 1])
          ) {
            let l = xs[i - 1],
              r = xs[i + 1];
            for (let k = 0; k < 45; k++) {
              let u = l + (r - l) * 0.381966,
                v = l + (r - l) * 0.618034;
              if (sign * f(u) < sign * f(v)) r = v;
              else l = u;
            }
            pts.push((l + r) / 2);
          }
    }
    let vals = pts.map(f);
    if (vals.some((y) => !Number.isFinite(y)))
      throw Error('有限の値を計算できません。');
    let min = Math.min(...vals),
      max = Math.max(...vals);
    const collect = (v) =>
      pts
        .filter(
          (x, i) => Math.abs(vals[i] - v) <= 1e-9 * Math.max(1, Math.abs(v))
        )
        .sort((a, b) => a - b)
        .filter(
          (x, i, arr) =>
            i === 0 || Math.abs(x - arr[i - 1]) > 1e-6 * Math.max(1, R - L)
        );
    return {
      exact: !!p,
      p,
      vertex,
      min,
      max,
      minX: collect(min),
      maxX: collect(max),
      constant: p && p.length === 1
    };
  }
  function boundaryEquations(tree, left, right, scope, param) {
    const num = (v) => ({ op: 'num', v }),
      op = (o, a, b) => ({ op: o, a, b }),
      zero = num(0),
      two = num(2);
    function symbolic(n) {
      if (!variables(n).has('x')) return [n];
      if (n.op === 'var') return [zero, num(1)];
      let a = n.a && symbolic(n.a),
        b = n.b && symbolic(n.b);
      if (!a) return null;
      if (n.op === 'neg' || n.op === 'pos')
        return a.map((v) => (n.op === 'neg' ? { op: 'neg', a: v } : v));
      if (!b) return null;
      let r;
      if (n.op === '+' || n.op === '-')
        r = Array.from({ length: Math.max(a.length, b.length) }, (_, i) =>
          op(n.op, a[i] || zero, b[i] || zero)
        );
      else if (n.op === '*') {
        r = Array(a.length + b.length - 1).fill(zero);
        a.forEach((v, i) =>
          b.forEach((w, j) => (r[i + j] = op('+', r[i + j], op('*', v, w))))
        );
      } else if (n.op === '/' && b.length === 1)
        r = a.map((v) => op('/', v, b[0]));
      else if (n.op === '^' && n.b.op === 'num' && [0, 1, 2].includes(n.b.v)) {
        if (n.b.v === 0) r = [num(1)];
        if (n.b.v === 1) r = a;
        if (n.b.v === 2) {
          r = Array(2 * a.length - 1).fill(zero);
          a.forEach((v, i) =>
            a.forEach((w, j) => (r[i + j] = op('+', r[i + j], op('*', v, w))))
          );
        }
      }
      return r && r.length <= 3 ? r : null;
    }
    const coeff = symbolic(tree);
    if (!coeff) return null;
    const A = coeff[2] || zero,
      B = coeff[1] || zero;
    const equations = [
      op('+', B, op('*', op('*', two, A), left)),
      op('+', B, op('*', op('*', two, A), right)),
      op('+', B, op('*', A, op('+', left, right))),
      A,
      op('-', right, left)
    ];
    function swap(n) {
      if (n.op === 'var' && n.name === param) return { op: 'var', name: 'x' };
      return {
        ...n,
        ...(n.a ? { a: swap(n.a) } : {}),
        ...(n.b ? { b: swap(n.b) } : {})
      };
    }
    return equations.map((n) => {
      const p = polynomial(swap(n), scope);
      if (!p) return null;
      const [C = 0, B = 0, A = 0] = p;
      let roots = [];
      if (A !== 0) {
        const d = B * B - 4 * A * C;
        if (d === 0) roots = [-B / (2 * A)];
        else if (d > 0) {
          const q = -0.5 * (B + (B >= 0 ? 1 : -1) * Math.sqrt(d));
          roots = [q / A, C / q];
        }
      } else if (B !== 0) roots = [-C / B];
      return { roots, identity: A === 0 && B === 0 && C === 0 };
    });
  }
  root.MathEngine = {
    parse,
    evaluate,
    variables,
    polynomial,
    solve,
    boundaryEquations
  };
  if (typeof module !== 'undefined') module.exports = root.MathEngine;
})(typeof window !== 'undefined' ? window : globalThis);
