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
  function solve(tree, scope, L, R) {
    const p = polynomial(tree, scope);
    if (!p || p.length !== 3 || !p.every(Number.isFinite) || p[2] === 0) {
      throw Error('二次関数のみ対応しています。f(x) = A*x^2+B*x+C（A ≠ 0）となる式を入力してください。現在のパラメータで二次の係数が0になる場合も対象外です。');
    }
    if (!Number.isFinite(L) || !Number.isFinite(R) || L > R)
      throw Error('定義域は有限で、左端 ≦ 右端にしてください。');
    const f = (x) => evaluate(tree, { ...scope, x });
    const A = p[2], B = p[1];
    const vertex = -B / (2 * A) || 0;
    const near = Math.max(L, Math.min(R, vertex)) || 0;
    const mid = L + (R - L) / 2;
    const far = L === R ? [L] : vertex < mid ? [R] : vertex > mid ? [L] : [L, R];
    const minX = A > 0 ? [near] : far;
    const maxX = A > 0 ? far : [near];
    const min = f(minX[0]), max = f(maxX[0]);
    if (![vertex, min, max].every(Number.isFinite))
      throw Error('計算可能な数値の範囲を超えました。');
    return { exact: true, p, vertex, min, max, minX, maxX, constant: false };
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
