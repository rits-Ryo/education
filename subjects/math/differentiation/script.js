(function () {
  'use strict';

  const M=window.MathDisplay,L=M.token;
  const E = window.DifferentiationEngine;
  const D = window.DifferentiationDrawing;
  const get = id => document.getElementById(id);
  const put = (id, value) => { if(['function-label','original-title','derivative-title','rate-values','tangent-values','linked-values','stationary-list'].includes(id))M.renderMath(get(id),value,{displayMode:id.includes('values')});else get(id).textContent=value; };
  const state = { id: 'square', a: 1, h: 0.8, mode: null, frame: null, lastTime: null };
  const graphIds = ['secant-graph', 'tangent-graph', 'original-graph', 'variation-graph'];

  // 0でない小さな値を0と表示しない。内部の値は丸めない。
  const format = value => value === null ? '未定義' : window.NumberDisplay.formatNonzero(value);

  function syncInputs() {
    const range = E.model(state.id).range;
    for (const id of ['a-number', 'a-slider']) {
      get(id).min = range[0];
      get(id).max = range[1];
      get(id).value = state.a;
      get(id).removeAttribute('aria-invalid');
    }
    for (const id of ['h-number', 'h-slider']) {
      get(id).value = state.h;
      get(id).removeAttribute('aria-invalid');
    }
    put('input-error', '');
    put('h-error', '');
  }

  function render(hOnly = false) {
    const f = E.model(state.id);
    const tangent = E.tangent(state.id, state.a);
    const rate = E.averageRate(state.id, state.a, state.h);
    const variation = get('show-variation').checked;
    const stationary = get('show-stationary').checked;
    put('function-label',String.raw`f(x)=${L(f.formula)},\qquad f'(x)=${L(f.derivativeFormula)}`);
    put('original-title',String.raw`y=${L(f.formula)}`);
    put('derivative-title',String.raw`y=${L(f.derivativeFormula)}`);

    D.draw(get('secant-graph'), state.id, { a: state.a, h: state.h, tangent: get('show-tangent').checked, secant: get('show-secant').checked });
    if (hOnly !== true) {
      for (const id of ['tangent-graph', 'original-graph']) {
        D.draw(get(id), state.id, { a: state.a, tangent: get('show-tangent').checked, variation, stationary });
      }
      D.draw(get('derivative-graph'), state.id, { a: state.a, derivative: true, variation, stationary });
      D.draw(get('variation-graph'), state.id, { a: state.a, variation, stationary });
    }

    put('rate-values',String.raw`\begin{aligned}a&\approx${L(format(state.a))},\quad h\approx${L(format(state.h))}\\P&\approx(${L(format(state.a))},${L(format(f.value(state.a)))})\\Q&\approx(${L(format(state.a+state.h))},${L(format(f.value(state.a+state.h)))})\\\text{平均変化率}&${rate===null?M.text('h=0のため未定義'):'\\approx '+L(format(rate))}\\f'(a)&\approx${L(format(tangent.slope))}\end{aligned}`);
    put('tangent-values',String.raw`\begin{aligned}P&\approx(${L(format(state.a))},${L(format(tangent.height))})\\f'(a)&\approx${L(format(tangent.slope))}\quad${M.text(E.direction(tangent.slope))}\\y&\approx(${L(format(tangent.slope))})(x-(${L(format(state.a))}))+(${L(format(tangent.height))})\end{aligned}`);
    put('linked-values',String.raw`R\approx(${L(format(state.a))},${L(format(tangent.slope))}),\qquad f'(a)\approx${L(format(tangent.slope))}`);
    if (hOnly !== true) renderVariation();
  }

  function renderVariation() {
    const range = D.view(state.id);
    const list = get('interval-list');
    list.replaceChildren();
    for (const interval of E.intervals(state.id, range.left, range.right)) {
      const row = document.createElement('p');
      M.renderMath(row,String.raw`${L(format(interval.left))}<x<${L(format(interval.right))}:\ f'(x)\text{は}${M.text(interval.sign)}\quad${M.text(interval.sign==='正'?'増加（緑の実線）':'減少（赤の破線）')}`);
      list.append(row);
    }
    const points = E.stationaryPoints(state.id, range.left, range.right);
    put('stationary-list',points.map(point=>String.raw`x\approx${L(format(point.x))}:\ ${M.text(point.type)},\ f(x)\approx${L(format(point.y))}`).join('\\quad '));
  }

  function stop() {
    cancelAnimationFrame(state.frame);
    state.mode = null;
    state.lastTime = null;
    put('play', '点Pを再生');
    put('approach', 'hを0へ近づける');
  }

  function animate(time) {
    if (!state.mode) return;
    const seconds = state.lastTime === null ? 0 : Math.min(0.1, (time - state.lastTime) / 1000);
    state.lastTime = time;
    let finished = false;
    if (state.mode === 'point') {
      const right = E.model(state.id).range[1];
      state.a = Math.min(right, state.a + seconds * Number(get('speed').value));
      finished = state.a === right;
    } else {
      state.h *= Math.exp(-seconds * 1.5);
      if (Math.abs(state.h) <= 1e-8) {
        state.h = Math.sign(state.h) * 1e-8;
        finished = true;
      }
    }
    syncInputs();
    render(state.mode === 'approach');
    if (finished) stop();
    else state.frame = requestAnimationFrame(animate);
  }

  function start(mode) {
    if (state.mode === mode) return stop();
    stop();
    state.mode = mode;
    if (mode === 'point') {
      const range = E.model(state.id).range;
      if (state.a === range[1]) state.a = range[0];
      put('play', '一時停止');
    } else {
      if (state.h === 0 || Math.abs(state.h) <= 1e-8) state.h = state.h < 0 ? -0.8 : 0.8;
      put('approach', '接近を一時停止');
    }
    state.frame = requestAnimationFrame(animate);
  }

  function bindInputs() {
    get('function').addEventListener('change', () => {
      stop();
      state.id = get('function').value;
      state.a = 1;
      state.h = 0.8;
      syncInputs();
      render();
    });
    for (const name of ['a', 'h']) {
      for (const kind of ['slider', 'number']) {
        const input = get(name + '-' + kind);
        input.addEventListener('input', () => {
          stop();
          const value = input.valueAsNumber;
          const range = name === 'a' ? E.model(state.id).range : [-1, 1];
          if (!Number.isFinite(value) || value < range[0] || value > range[1]) {
            input.setAttribute('aria-invalid', 'true');
            put(name === 'a' ? 'input-error' : 'h-error', `${name}は${format(range[0])}〜${format(range[1])}の有限の数を入力してください。`);
            return;
          }
          state[name] = value;
          input.removeAttribute('aria-invalid');
          put(name === 'a' ? 'input-error' : 'h-error', '');
          get(name + '-' + (kind === 'number' ? 'slider' : 'number')).value = value;
          render(name === 'h');
        });
        input.addEventListener('change', syncInputs);
      }
    }
    for (const id of ['show-tangent', 'show-secant', 'show-variation', 'show-stationary']) get(id).addEventListener('change', render);
    get('play').addEventListener('click', () => start('point'));
    get('approach').addEventListener('click', () => start('approach'));
    get('reset').addEventListener('click', () => { stop(); state.a = 1; syncInputs(); render(); });
    get('h-reset').addEventListener('click', () => { stop(); state.h = 0.8; syncInputs(); render(true); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  }

  function bindDragging(svg) {
    let pointer = null;
    let selected = null;
    svg.addEventListener('pointerdown', event => {
      if (pointer !== null || !event.target.hasAttribute('data-point')) return;
      stop();
      selected = event.target.getAttribute('data-point');
      pointer = event.pointerId;
      svg.setPointerCapture(pointer);
      event.preventDefault();
    });
    svg.addEventListener('pointermove', event => {
      if (event.pointerId !== pointer) return;
      const local = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
      const range = E.model(state.id).range;
      const width = Number(svg.getAttribute('viewBox').split(' ')[2]);
      const x = D.coordinates(D.view(state.id), width).fromX(local.x);
      if (selected === 'Q') state.h = Math.max(-1, Math.min(1, x - state.a));
      else state.a = Math.max(range[0], Math.min(range[1], x));
      syncInputs();
      render(selected === 'Q');
      event.preventDefault();
    });
    function finish(event) {
      if (event.pointerId === pointer) { pointer = null; selected = null; }
    }
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) svg.addEventListener(event, finish);
  }

  bindInputs();
  for (const id of graphIds) bindDragging(get(id));
  window.addEventListener('resize', () => {
    render();
    D.draw(get('absolute-graph'), 'absolute', { oneSided: true });
  });
  D.draw(get('absolute-graph'), 'absolute', { oneSided: true });
  syncInputs();
  render();
})();
