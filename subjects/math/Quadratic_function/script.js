'use strict';
const E = MathEngine,
  $ = (id) => document.getElementById(id),
  fmt = (v) => (Number.isFinite(v) ? Number(v.toPrecision(9)).toString() : '—');
let model = null,
  scope = {},
  configs = {},
  result = null,
  domain = null,
  view = null,
  frame = 0,
  boundaryTimer = 0;
const presets = {
  A: ['(x-a)^2', '0', '4'],
  B: ['x^2', 'a', 'a+2'],
  C: ['-(x-a)^2+4', '0', '4'],
  D: ['(x-a)^2', 'a-1', '3']
};
let selectedPreset = $('preset').value;
let freeFormula = ['', '0', '4'];

function syncFormulaInputs() {
  const fixed = presets[$('preset').value];
  ['formula', 'left', 'right'].forEach((id, i) => {
    $(id).readOnly = !!fixed;
    if (fixed) $(id).value = fixed[i];
  });
  $('applyFormula').disabled = !!fixed;
}

function clearFormula() {
  clearTimeout(boundaryTimer);
  model = null;
  result = null;
  domain = null;
  view = { xmin: -5, xmax: 5, ymin: -5, ymax: 5 };
  $('error').hidden = true;
  $('error').textContent = '';
  for (const id of ['minValue', 'maxValue']) $(id).textContent = '—';
  for (const id of [
    'minAt', 'maxAt', 'explanation', 'boundaries', 'parameters',
    'boundaryParam', 'mathDisplay'
  ]) $(id).replaceChildren();
  $('boundaryLabel').hidden = true;
  $('resetParams').disabled = true;
  draw();
}
function el(tag, text, className) {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (className) n.className = className;
  return n;
}
function apply() {
  syncFormulaInputs();
  if (!$('formula').value.trim()) {
    clearFormula();
    return;
  }
  try {
    const f = E.parse($('formula').value),
      l = E.parse($('left').value),
      r = E.parse($('right').value);
    if (E.variables(l).has('x') || E.variables(r).has('x'))
      throw Error('定義域の端点に x は使えません。');
    const names = [
      ...new Set([...E.variables(f), ...E.variables(l), ...E.variables(r)])
    ]
      .filter((n) => n !== 'x')
      .sort();
    model = { f, l, r, names };
    $('resetParams').disabled = false;
    for (const n of names) {
      if (!configs[n]) configs[n] = { min: -5, max: 6, step: 0.05, initial: 0 };
      if (!(n in scope)) scope[n] = 0;
    }
    buildParameters();
    update(true);
  } catch (e) {
    showError(e.message);
  }
}
function buildParameters() {
  $('parameters').replaceChildren();
  for (const n of model.names) {
    const c = configs[n],
      box = el('div', undefined, 'parameter'),
      row = el('div', undefined, 'row'),
      label = el('label', n),
      number = el('input');
    number.type = 'number';
    number.step = 'any';
    number.value = scope[n];
    number.setAttribute('aria-label', n + ' の値');
    row.append(label, number);
    const slider = el('input');
    slider.type = 'range';
    slider.min = c.min;
    slider.max = c.max;
    slider.step = c.step;
    slider.value = scope[n];
    slider.setAttribute('aria-label', n + ' スライダー');
    const setValue = (v) => {
      if (!Number.isFinite(v)) return;
      scope[n] = v;
      number.value = v;
      slider.value = v;
      queueUpdate();
    };
    slider.addEventListener('input', () => setValue(Number(slider.value)));
    number.addEventListener('input', () => {
      if (number.value !== '') setValue(Number(number.value));
    });
    const details = el('details'),
      summary = el('summary', '範囲と刻み幅'),
      settings = el('div', undefined, 'settings');
    for (const [key, title] of [
      ['min', '最小'],
      ['max', '最大'],
      ['step', '刻み']
    ]) {
      const lab = el('label', title),
        input = el('input');
      input.type = 'number';
      input.step = 'any';
      input.value = c[key];
      lab.append(input);
      settings.append(lab);
      input.addEventListener('change', () => {
        const v = Number(input.value),
          next = { ...c, [key]: v };
        if (!Number.isFinite(v) || next.min >= next.max || next.step <= 0) {
          input.value = c[key];
          return;
        }
        Object.assign(c, next);
        slider.min = c.min;
        slider.max = c.max;
        slider.step = c.step;
        update(false);
      });
    }
    details.append(summary, settings);
    box.append(row, slider, details);
    $('parameters').append(box);
  }
  if (!model.names.length)
    $('parameters').append(
      el('p', 'この式にはパラメータがありません。', 'hint')
    );
  const prior = $('boundaryParam').value;
  $('boundaryParam').replaceChildren(
    ...model.names.map((n) => {
      const o = el('option', n);
      o.value = n;
      return o;
    })
  );
  if (model.names.includes(prior)) $('boundaryParam').value = prior;
  $('boundaryLabel').hidden = !model.names.length;
}
function queueUpdate() {
  if (!frame)
    frame = requestAnimationFrame(() => {
      frame = 0;
      update(false);
    });
}
function showError(message) {
  result = null;
  $('error').hidden = false;
  $('error').textContent = message;
  for (const id of ['minValue', 'maxValue']) $(id).textContent = '—';
  for (const id of ['minAt', 'maxAt', 'explanation', 'boundaries'])
    $(id).replaceChildren();
  draw();
}
function pretty(source) {
  const frag = document.createDocumentFragment();
  let pieces = source.split(/(\^[+-]?\d+(?:\.\d+)?)/g);
  for (const part of pieces) {
    if (part.startsWith('^')) frag.append(el('sup', part.slice(1)));
    else
      frag.append(
        document.createTextNode(part.replace(/\*/g, ' · ').replace(/-/g, '−'))
      );
  }
  return frag;
}
function update(fit) {
  if (!model) return;
  try {
    domain = [E.evaluate(model.l, scope), E.evaluate(model.r, scope)];
    result = E.solve(model.f, scope, ...domain);
    $('error').hidden = true;
    $('mathDisplay').replaceChildren(
      document.createTextNode('f(x) = '),
      pretty($('formula').value),
      el('br'),
      document.createTextNode(`${fmt(domain[0])} ≦ x ≦ ${fmt(domain[1])}`)
    );
    for (const kind of ['min', 'max']) {
      $(kind + 'Value').textContent =
        (result.exact ? '' : '≈ ') + fmt(result[kind]);
      $(kind + 'At').textContent = result.constant
        ? '定義域のすべての x'
        : `x ${result.exact ? '=' : '≈'} ${result[kind + 'X'].slice(0, 12).map(fmt).join(', ')}${result[kind + 'X'].length > 12 ? ' …（ほかにも候補あり）' : ''}`;
    }
    explain();
    if (fit || !view) fitView();
    draw();
    clearTimeout(boundaryTimer);
    boundaryTimer = setTimeout(findBoundaries, 100);
  } catch (e) {
    showError(e.message);
  }
}
function completedSquare(p) {
  const A = p[2], B = p[1] || 0, C = p[0] || 0;
  const v = -B / (2 * A) || 0;
  const k = C + (B / 2) * v;
  const coefficient = A === 1 ? '' : A === -1 ? '-' : `${fmt(A)}*`;
  const square = v === 0 ? 'x^2'
    : `(x${v > 0 ? '-' : '+'}${fmt(Math.abs(v))})^2`;
  const constant = k === 0 ? '' : `${k > 0 ? '+' : '-'}${fmt(Math.abs(k))}`;
  const rounded = [A, v, k].some((value) => Number(fmt(value)) !== value);
  return `f(x) ${rounded ? '≈' : '='} ${coefficient}${square}${constant}`;
}

function explain() {
  const box = $('explanation');
  box.replaceChildren();
  const [L, R] = domain;
  if (!result.exact) {
    box.append(
      el(
        'p',
        '閉区間全体で連続となることを対応する式の範囲で確認し、2048分割と局所探索で候補を求めています。細かい振動や狭い山・谷を見落とす可能性があります。一般の関数の厳密な場合分けは生成しません。'
      )
    );
    return;
  }
  const p = result.p,
    A = p[2] || 0,
    B = p[1] || 0;
  const square = el('p', undefined, 'completed-square');
  square.append(document.createTextNode('平方完成：'), el('br'),
    pretty(completedSquare(p)));
  box.append(square);
  if (L === R) {
    box.append(
      el('p', '定義域は1点です。この点の値が最大値でも最小値でもあります。')
    );
    return;
  }
  if (A === 0) {
    box.append(
      el(
        'p',
        B === 0
          ? '定数関数です。定義域全体で最大値と最小値が一致します。'
          : B > 0
            ? '一次関数で増加します。定義域の左端で最小、定義域の右端で最大です。'
            : '一次関数で減少します。定義域の左端で最大、定義域の右端で最小です。'
      )
    );
    return;
  }
  const v = result.vertex,
    up = A > 0,
    inner = up ? '最小' : '最大',
    outer = up ? '最大' : '最小',
    mid = L + (R - L) / 2;
  box.append(
    el(
      'p',
      `${inner}：${v < L ? `頂点が定義域の左端より左にあるため、定義域の左端で${inner}になります` : v > R ? `頂点が定義域の右端より右にあるため、定義域の右端で${inner}になります` : v === L ? '頂点と定義域の左端が一致します' : v === R ? '頂点と定義域の右端が一致します' : `頂点が定義域内にあるため、頂点で${inner}になります`}。`
    )
  );
  const diff = A * (L - R) * (L + R - 2 * v);
  box.append(
    el(
      'p',
      `${outer}：${v === mid ? '左右の端点の値が等しいため、両端' : (up ? diff > 0 : diff < 0) ? '定義域の左端が頂点から遠いため、定義域の左端' : '定義域の右端が頂点から遠いため、定義域の右端'}で${outer}になります。区間の中点のx座標は ${fmt(mid)} です。`
    )
  );
}
function findBoundaries() {
  const box = $('boundaries');
  box.replaceChildren();
  if (!model || !result) return;
  const n = $('boundaryParam').value;
  if (!n) {
    box.append(el('p', 'パラメータがないため境界比較はありません。', 'hint'));
    return;
  }
  if (!result.exact) {
    box.append(el('p', '一般の関数の境界値は自動判定しません。', 'hint'));
    return;
  }
  const c = configs[n],
    width = c.max - c.min;
  const quantities = (t) => {
    const s = { ...scope, [n]: t },
      p = E.polynomial(model.f, s),
      L = E.evaluate(model.l, s),
      R = E.evaluate(model.r, s);
    if (!p) return null;
    const A = p[2] || 0,
      B = p[1] || 0;
    return [B + 2 * A * L, B + 2 * A * R, B + A * (L + R), A, R - L];
  };
  let roots = [];
  const analytic = E.boundaryEquations(model.f, model.l, model.r, scope, n);
  // These are numerical roots of the derived equations, not symbolic parameter inequalities.
  for (let k = 0; k < 5; k++) {
    if (analytic?.[k]) {
      for (const t of analytic[k].roots)
        if (Number.isFinite(t) && t >= c.min && t <= c.max)
          roots.push({ t, k, analytic: true });
      continue;
    }
    let lastT = c.min,
      last = quantities(lastT)?.[k];
    let values = Array.from(
      { length: 65 },
      (_, i) => quantities(c.min + (width * i) / 64)?.[k]
    );
    if (values.every((v) => v === 0)) continue;
    for (let i = 1; i <= 512; i++) {
      let t = c.min + (width * i) / 512,
        v = quantities(t)?.[k];
      if (Number.isFinite(last) && Number.isFinite(v)) {
        if (last === 0) roots.push({ t: lastT, k });
        if (last * v < 0) {
          let lo = lastT,
            hi = t,
            z = last;
          for (let j = 0; j < 45; j++) {
            let mid = (lo + hi) / 2,
              w = quantities(mid)?.[k];
            if (!Number.isFinite(w)) break;
            if (z * w <= 0) hi = mid;
            else {
              lo = mid;
              z = w;
            }
          }
          roots.push({ t: (lo + hi) / 2, k });
        }
        if (i === 512 && v === 0) roots.push({ t, k });
      }
      lastT = t;
      last = v;
    }
  }
  roots.sort((a, b) => a.t - b.t);
  roots = roots.filter(
    (r, i, arr) =>
      !arr
        .slice(0, i)
        .some((q) => q.k === r.k && Math.abs(q.t - r.t) < width * 1e-7)
  );
  if (!roots.length) {
    box.append(
      el(
        'p',
        '設定した範囲では境界候補を検出していません。接するだけの根など、探索で見落とす場合があります。',
        'hint'
      )
    );
    return;
  }
  for (const root of roots.slice(0, 20)) {
    const s = { ...scope, [n]: root.t },
      p = E.polynomial(model.f, s),
      L = E.evaluate(model.l, s),
      R = E.evaluate(model.r, s);
    if (root.k < 3 && (!p || !p[2] || L > R)) continue;
    const card = el(
      'div',
      undefined,
      'boundary' +
        (Math.abs(scope[n] - root.t) < 1e-7 * Math.max(1, Math.abs(root.t))
          ? ' active'
          : '')
    );
    card.append(el('strong', `${n} ${root.analytic ? '=' : '≈'} ${fmt(root.t)}`));
    const row = el('div', undefined, 'row');
    const eps = Math.max(width / 1000, Math.min(c.step, width / 100));
    for (const [label, offset] of [
      ['直前', -eps],
      ['境界', 0],
      ['直後', eps]
    ]) {
      const b = el('button', label);
      b.title = `${n} = ${fmt(root.t + offset)}`;
      b.onclick = () => {
        scope[n] = root.t + offset;
        buildParameters();
        update(false);
      };
      row.append(b);
    }
    card.append(row);
    box.append(card);
  }
}
function fitView() {
  if (!domain) return;
  const [L, R] = domain,
    span = Math.max(2, R - L),
    xmin = L - span * 0.3,
    xmax = R + span * 0.3;
  let ys = [0];
  for (let i = 0; i <= 100; i++) {
    const y = E.evaluate(model.f, { ...scope, x: L + ((R - L) * i) / 100 });
    if (Number.isFinite(y)) ys.push(y);
  }
  if (result) ys.push(result.min, result.max);
  let low = Math.min(...ys),
    high = Math.max(...ys),
    height = Math.max(2, high - low);
  view = { xmin, xmax, ymin: low - height * 0.2, ymax: high + height * 0.25 };
}
function draw() {
  const canvas = $('graph'),
    rect = canvas.getBoundingClientRect(),
    dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = rect.width,
    H = rect.height;
  if (!view) return;
  const { xmin, xmax, ymin, ymax } = view,
    X = (x) => ((x - xmin) / (xmax - xmin)) * W,
    Y = (y) => H - ((y - ymin) / (ymax - ymin)) * H;
  const step = (span) => {
    let raw = span / 8,
      p = 10 ** Math.floor(Math.log10(raw));
    return (raw / p < 2 ? 1 : raw / p < 5 ? 2 : 5) * p;
  };
  ctx.font = '12px ' + getComputedStyle(canvas).fontFamily;
  ctx.lineWidth = 1;
  const occupied = [];
  const overlaps = (a, b) =>
    a.x < b.x + b.w && a.x + a.w > b.x &&
    a.y < b.y + b.h && a.y + a.h > b.y;
  const axisText = (text, x, baseline) => {
    const box = { x: x - 3, y: baseline - 14,
      w: ctx.measureText(text).width + 6, h: 19 };
    if (occupied.some((other) => overlaps(box, other))) return;
    ctx.fillText(text, x, baseline);
    occupied.push(box);
  };
  for (const [lo, hi, s, vertical] of [
    [xmin, xmax, step(xmax - xmin), true],
    [ymin, ymax, step(ymax - ymin), false]
  ]) {
    for (
      let t = Math.ceil(lo / s) * s, j = 0;
      t <= hi && j < 100;
      t += s, j++
    ) {
      ctx.strokeStyle = '#e4eaf2';
      ctx.beginPath();
      vertical
        ? (ctx.moveTo(X(t), 0), ctx.lineTo(X(t), H))
        : (ctx.moveTo(0, Y(t)), ctx.lineTo(W, Y(t)));
      ctx.stroke();
      ctx.fillStyle = '#607088';
      // Show the origin once instead of drawing both axes' zero labels.
      if (!vertical && Math.abs(t) < s * 1e-8) continue;
      axisText(
        fmt(Math.abs(t) < s * 1e-8 ? 0 : t),
        vertical ? X(t) + 4 : 5,
        vertical ? Math.min(H - 5, Math.max(15, Y(0) + 16)) : Y(t) - 4
      );
    }
  }
  ctx.strokeStyle = '#6f8097';
  ctx.beginPath();
  ctx.moveTo(X(0), 0);
  ctx.lineTo(X(0), H);
  ctx.moveTo(0, Y(0));
  ctx.lineTo(W, Y(0));
  ctx.stroke();
  axisText('x', W - 14, Math.min(H - 8, Math.max(16, Y(0) - 8)));
  axisText('y', Math.min(W - 16, Math.max(8, X(0) + 8)), 14);
  if (!model || !result) return;
  const curve = (lo, hi, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    let started = false,
      prev = null;
    for (let i = 0; i <= Math.ceil(W * 2); i++) {
      let x = lo + ((hi - lo) * i) / Math.ceil(W * 2),
        y = E.evaluate(model.f, { ...scope, x }),
        py = Y(y);
      if (
        !Number.isFinite(y) ||
        Math.abs(py) > H * 20 ||
        (prev !== null && Math.abs(py - prev) > H * 2)
      ) {
        started = false;
        prev = py;
        continue;
      }
      if (!started) {
        ctx.moveTo(X(x), py);
        started = true;
      } else ctx.lineTo(X(x), py);
      prev = py;
    }
    ctx.stroke();
  };
  curve(xmin, xmax, '#bdc6d2', 2);
  if (domain && domain[0] <= domain[1]) {
    ctx.fillStyle = 'rgba(34,107,214,.045)';
    ctx.fillRect(X(domain[0]), 0, X(domain[1]) - X(domain[0]), H);
    curve(Math.max(xmin, domain[0]), Math.min(xmax, domain[1]), '#226bd6', 3);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#226bd6';
    ctx.lineWidth = 1;
    for (const x of domain) {
      ctx.beginPath();
      ctx.moveTo(X(x), 0);
      ctx.lineTo(X(x), H);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }
  const pointLabels = [];
  const point = (x, y, color, r, label, arc = null) => {
    if (X(x) < -10 || X(x) > W + 10 || Y(y) < -10 || Y(y) > H + 10) return;
    ctx.beginPath();
    if (!arc || arc.fill) {
      ctx.arc(X(x), Y(y), r, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.beginPath();
    }
    ctx.arc(X(x), Y(y), r, arc ? arc.start : 0,
      arc ? arc.end : Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    occupied.push({ x: X(x) - r - 4, y: Y(y) - r - 4,
      w: 2 * r + 8, h: 2 * r + 8 });
    if (label) {
      let group = pointLabels.find((item) =>
        Math.hypot(item.x - X(x), item.y - Y(y)) < 2);
      if (!group) {
        group = { x: X(x), y: Y(y), parts: [] };
        pointLabels.push(group);
      }
      if (!group.parts.some((part) => part.text === label))
        group.parts.push({ text: label, color });
    }
  };
  if (result) {
    if (result.vertex !== null && result.vertex !== undefined) {
      const v = result.vertex;
      ctx.strokeStyle = '#8855bb';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(X(v), 0);
      ctx.lineTo(X(v), H);
      ctx.stroke();
      ctx.setLineDash([]);
      point(v, E.evaluate(model.f, { ...scope, x: v }), '#8855bb', 9, '頂点');
    }
    for (const x of domain)
      point(x, E.evaluate(model.f, { ...scope, x }), '#226bd6', 4);
    const extremaRadius = 5;
    const sharedExtremum = (x, others) =>
      result.min === result.max && others.includes(x);
    for (const x of result.maxX.slice(0, 50)) {
      const arc = sharedExtremum(x, result.minX)
        ? { start: Math.PI, end: Math.PI * 2, fill: true } : null;
      point(x, result.max, '#cc3f47', extremaRadius, '最大', arc);
    }
    for (const x of result.minX.slice(0, 50)) {
      const arc = sharedExtremum(x, result.maxX)
        ? { start: 0, end: Math.PI, fill: false } : null;
      point(x, result.min, '#087e60', extremaRadius, '最小', arc);
    }
  }
  // Render annotations last. Merge coincident points, then avoid tick text,
  // point markers and previously placed annotations using measured text widths.
  for (const group of pointLabels) {
    const separatorWidth = ctx.measureText('・').width;
    const width = group.parts.reduce((sum, part) =>
      sum + ctx.measureText(part.text).width, 0) +
      separatorWidth * (group.parts.length - 1) + 12;
    const height = 24;
    const candidates = [];
    for (const gap of [18, 36, 60, 90]) {
      candidates.push(
        { x: group.x + gap, y: group.y - height - gap },
        { x: group.x - width - gap, y: group.y - height - gap },
        { x: group.x + gap, y: group.y + gap },
        { x: group.x - width - gap, y: group.y + gap },
        { x: group.x - width / 2, y: group.y - height - gap },
        { x: group.x - width / 2, y: group.y + gap }
      );
    }
    let box;
    for (const candidate of candidates) {
      const possible = { ...candidate, w: width, h: height };
      if (possible.x < 4 || possible.y < 4 ||
          possible.x + width > W - 4 || possible.y + height > H - 4) continue;
      if (!occupied.some((other) => overlaps(possible, other))) {
        box = possible;
        break;
      }
    }
    if (!box) continue;
    occupied.push(box);
    ctx.strokeStyle = '#8b95a4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(group.x, group.y);
    ctx.lineTo(Math.max(box.x, Math.min(group.x, box.x + box.w)),
      Math.max(box.y, Math.min(group.y, box.y + box.h)));
    ctx.stroke();
    let textX = box.x + 6;
    group.parts.forEach((part, index) => {
      if (index) {
        ctx.fillStyle = '#607088';
        ctx.fillText('・', textX, box.y + 16);
        textX += separatorWidth;
      }
      ctx.fillStyle = part.color;
      ctx.fillText(part.text, textX, box.y + 16);
      textX += ctx.measureText(part.text).width;
    });
  }
}
function zoom(factor) {
  if (!view) return;
  const cx = (view.xmin + view.xmax) / 2,
    cy = (view.ymin + view.ymax) / 2,
    dx = ((view.xmax - view.xmin) * factor) / 2,
    dy = ((view.ymax - view.ymin) * factor) / 2;
  view = { xmin: cx - dx, xmax: cx + dx, ymin: cy - dy, ymax: cy + dy };
  draw();
}
$('formulaForm').onsubmit = (e) => {
  e.preventDefault();
  apply();
};
$('preset').onchange = () => {
  if (selectedPreset === 'E') {
    freeFormula = ['formula', 'left', 'right'].map((id) => $(id).value);
  }
  selectedPreset = $('preset').value;
  const p = presets[$('preset').value];
  ['formula', 'left', 'right'].forEach((id, i) => {
    $(id).value = (p || freeFormula)[i];
  });
  scope = {};
  configs = {};
  apply();
  if (!p) $('formula').focus();
};
$('formula').addEventListener('input', () => {
  if ($('preset').value === 'E' && !$('formula').value.trim()) clearFormula();
});
$('resetParams').onclick = () => {
  if (!model) return;
  for (const n of model.names) scope[n] = configs[n].initial;
  buildParameters();
  update(false);
};
$('boundaryParam').onchange = findBoundaries;
$('zoomIn').onclick = () => zoom(0.8);
$('zoomOut').onclick = () => zoom(1.25);
$('fit').onclick = () => {
  fitView();
  draw();
};
// Keep a snapshot of the active pointers so switching between pan and pinch
// does not jump when a finger is added or lifted.
const graphPointers = new Map();
let graphGesture = null;

function pointerGeometry(points) {
  const first = points[0];
  if (points.length === 1)
    return { x: first.x, y: first.y, distance: null };
  const second = points[1];
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
    distance: Math.hypot(second.x - first.x, second.y - first.y)
  };
}

function resetGraphGesture() {
  graphGesture = graphPointers.size && view
    ? {
        ...pointerGeometry([...graphPointers.values()]),
        view: { ...view }
      }
    : null;
}

$('graph').addEventListener('pointerdown', (e) => {
  if (!view || (e.pointerType === 'mouse' && e.button !== 0)) return;
  graphPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  $('graph').setPointerCapture(e.pointerId);
  resetGraphGesture();
});

$('graph').addEventListener('pointermove', (e) => {
  if (!graphPointers.has(e.pointerId) || !graphGesture) return;
  graphPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const current = pointerGeometry([...graphPointers.values()]);
  const rect = $('graph').getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  // A growing finger distance narrows the graph range (zoom in). The graph
  // coordinate under the initial midpoint follows the moving midpoint.
  let factor = 1;
  if (current.distance !== null) {
    if (graphGesture.distance < 1 || current.distance < 1) {
      resetGraphGesture();
      return;
    }
    factor = graphGesture.distance / current.distance;
  }
  const initial = graphGesture.view;
  const width = (initial.xmax - initial.xmin) * factor;
  const height = (initial.ymax - initial.ymin) * factor;
  const anchorX = initial.xmin +
    ((graphGesture.x - rect.left) / rect.width) * (initial.xmax - initial.xmin);
  const anchorY = initial.ymax -
    ((graphGesture.y - rect.top) / rect.height) * (initial.ymax - initial.ymin);
  const xmin = anchorX - ((current.x - rect.left) / rect.width) * width;
  const ymax = anchorY + ((current.y - rect.top) / rect.height) * height;
  const nextView = {
    xmin,
    xmax: xmin + width,
    ymin: ymax - height,
    ymax
  };
  if (!Object.values(nextView).every(Number.isFinite) ||
      nextView.xmin >= nextView.xmax || nextView.ymin >= nextView.ymax) return;
  view = nextView;
  draw();
});

function endGraphPointer(e) {
  if (!graphPointers.delete(e.pointerId)) return;
  resetGraphGesture();
}

for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'])
  $('graph').addEventListener(event, endGraphPointer);
$('graph').addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    zoom(e.deltaY > 0 ? 1.1 : 0.9);
  },
  { passive: false }
);
new ResizeObserver(draw).observe($('graphWrap'));
if (document.fonts) {
  document.fonts.ready.then(draw);
  document.fonts.addEventListener('loadingdone', draw);
}
apply();
