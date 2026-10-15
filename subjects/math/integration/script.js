(function () {
  'use strict';

  const M = window.MathDisplay, L = M.token;
  const E = window.IntegrationEngine;
  const D = window.IntegrationDrawing;
  const get = id => document.getElementById(id);
  const put = (id, text) => { if(['area-formula','area-values','current-sigma','square-example','primitive-values'].includes(id))M.renderMath(get(id),text,{displayMode:true});else get(id).textContent=text; };
  const area = { id: 'square', a: 0, b: 2, mode: 'curve', dragBounds: null };
  const sum = { id: 'square', a: 0, b: 1, n: 4, mode: 'compare', dragBounds: null };
  const playback = { active: false, frame: null, lastTime: null, elapsed: 0 };
  let updateFrame = null;
  const pending = new Set();

  const format = window.NumberDisplay.formatNonzero;

  function endpoint(value) {
    for (const [number, label] of [[Math.PI, 'π'], [-Math.PI, '−π'], [2 * Math.PI, '2π'], [-2 * Math.PI, '−2π']]) {
      if (value === number) return label;
    }
    return format(value);
  }

  function integralText(state) {
    const exact = E.exactIntegral(state.id, state.a, state.b);
    const approximate = format(E.integral(state.id, state.a, state.b));
    return exact === null ? '\\approx '+L(approximate) : '= '+L(exact)+(exact.includes('/')?'\\approx '+L(approximate):'');
  }

  function syncEndpoints(prefix, state) {
    for (const name of ['a', 'b']) {
      for (const type of ['slider', 'number']) {
        const input = get(`${prefix}-${name}-${type}`);
        input.value = state[name];
        input.removeAttribute('aria-invalid');
      }
    }
  }

  function renderArea() {
    D.draw(get('area-graph'), area);
    const geometry = E.geometry(area.id, area.a, area.b);
    put('area-formula',String.raw`\int_{${L(endpoint(area.a))}}^{${L(endpoint(area.b))}}${L(E.model(area.id).formula)}\,dx ${integralText(area)}`);
    put('area-values',String.raw`\begin{aligned}\text{上側の面積 }P&\approx ${L(format(geometry.positive))}\\\text{下側の面積 }N&\approx ${L(format(geometry.negative))}\\P-N&${integralText(area)}\\\text{幾何学的な面積 }P+N&\approx ${L(format(geometry.area))}\end{aligned}`);
  }

  function reading(label, value) {
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    M.renderMath(term,L(label));
    M.renderMath(description,value.includes('\\')?value:L(value));
    get('sum-values').append(term, description);
  }

  function renderSum() {
    const result = E.rectangleSum(sum.id, sum.a, sum.b, sum.n);
    D.draw(get('sum-graph'), sum, result);
    get('sum-values').replaceChildren();
    reading('f(x)', E.model(sum.id).formula);
    reading('[a, b]', `[${endpoint(sum.a)}, ${endpoint(sum.b)}]`);
    reading('n', String(sum.n));
    reading('Δx', `≒ ${format(result.width)}`);
    reading('Sₙ', `≒ ${format(result.sum)}`);
    reading('I', integralText(sum));
    reading('|Sₙ − I|', `≒ ${format(result.error)}`);
    put('current-sigma',String.raw`\Delta x\approx${L(format(result.width))},\quad x_k=${L(endpoint(sum.a))}+k\Delta x,\quad S_{${sum.n}}=\Delta x\sum_{k=1}^{${sum.n}}f(x_k)\approx${L(format(result.sum))}`);
    const example = E.squareExample(sum.n);
    put('square-example',String.raw`\begin{aligned}\text{具体例： }f(x)=x^2,\ [0,1],\quad n&=${sum.n}\\S_{${sum.n}}&=${L(example.exactSum)}\approx${L(format(example.sum))}\\I&=\frac13\\S_{${sum.n}}-\frac13&\approx${L(format(example.error))}\end{aligned}`);
    put('primitive-values',String.raw`\begin{aligned}f(x)&=${L(E.model(sum.id).formula)}\\F(x)&=${L(E.model(sum.id).primitive)}\\I=F(${L(endpoint(sum.b))})-F(${L(endpoint(sum.a))})&${integralText(sum)}\\S_{${sum.n}}&\approx${L(format(result.sum))}\quad\text{（有限の和）}\end{aligned}`);
  }

  // 入力イベントが続いた場合は1フレームにまとめ、他方の図は再描画しない。
  function schedule(which) {
    pending.add(which);
    if (updateFrame !== null) return;
    updateFrame = requestAnimationFrame(() => {
      if (pending.has('area')) renderArea();
      if (pending.has('sum')) renderSum();
      pending.clear();
      updateFrame = null;
    });
  }

  function stop() {
    playback.active = false;
    playback.lastTime = null;
    cancelAnimationFrame(playback.frame);
    put('play', 'nを増やして再生');
  }

  function setCount(n) {
    sum.n = n;
    get('n-slider').value = n;
    get('n-number').value = n;
    get('n-number').removeAttribute('aria-invalid');
    put('sum-error', '');
    schedule('sum');
  }

  function animate(time) {
    if (!playback.active) return;
    if (playback.lastTime !== null) playback.elapsed += Math.min(250, time - playback.lastTime);
    playback.lastTime = time;
    if (playback.elapsed >= Number(get('speed').value)) {
      playback.elapsed = 0;
      setCount(Math.min(200, sum.n * 2));
      if (sum.n === 200) {
        stop();
        return;
      }
    }
    playback.frame = requestAnimationFrame(animate);
  }

  function populateFunctions(select, state, which, prefix) {
    for (const [id, model] of Object.entries(E.MODELS)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = 'f(x) = ' + model.formula;
      select.append(option);
    }
    select.value = state.id;
    select.addEventListener('change', () => {
      stop();
      state.id = select.value;
      [state.a, state.b] = E.model(state.id).initial;
      syncEndpoints(prefix, state);
      put(which + '-error', '');
      schedule(which);
    });
  }

  function buildEndpoints(container, prefix, state, which) {
    for (const name of ['a', 'b']) {
      const label = document.createElement('label');
      label.textContent = name + ' ';
      const slider = document.createElement('input');
      slider.type = 'range';
      // 2πを含む範囲でも、初期値0・1や数値入力を刻みのずれで変更しない。
      slider.step = 'any';
      slider.id = `${prefix}-${name}-slider`;
      slider.setAttribute('aria-label', `${which === 'area' ? '面積図' : '近似図'}の${name}スライダー`);
      const number = document.createElement('input');
      number.type = 'number';
      number.step = 'any';
      number.id = `${prefix}-${name}-number`;
      number.setAttribute('aria-label', `${which === 'area' ? '面積図' : '近似図'}の${name}の数値`);
      for (const input of [slider, number]) {
        input.min = -E.LIMIT;
        input.max = E.LIMIT;
        input.value = state[name];
        input.addEventListener('input', () => {
          stop();
          let value = input.valueAsNumber;
          if (input === slider) value = name === 'a' ? Math.min(value, state.b) : Math.max(value, state.a);
          try {
            E.validateInterval(name === 'a' ? value : state.a, name === 'b' ? value : state.b);
          } catch (error) {
            put(which + '-error', error.message);
            input.setAttribute('aria-invalid', 'true');
            return;
          }
          state[name] = value;
          put(which + '-error', '');
          input.removeAttribute('aria-invalid');
          if (input === slider) { slider.value = value; number.value = value; }
          else slider.value = value;
          schedule(which);
        });
      }
      label.append(slider, number);
      container.append(label);
    }
  }

  function bindBoundary(svg, state, prefix, which) {
    let pointer = null;
    let boundary = null;
    let map = null;
    svg.addEventListener('pointerdown', event => {
      if (pointer !== null || !event.target.hasAttribute('data-boundary')) return;
      stop();
      boundary = event.target.getAttribute('data-boundary');
      pointer = event.pointerId;
      state.dragBounds = D.view(state.id, state.a, state.b);
      map = D.coordinates(state.dragBounds, Number(svg.getAttribute('viewBox').split(' ')[2]));
      svg.setPointerCapture(pointer);
      event.preventDefault();
    });
    svg.addEventListener('pointermove', event => {
      if (event.pointerId !== pointer) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
      const value = Math.max(-E.LIMIT, Math.min(E.LIMIT, map.fromX(point.x)));
      state[boundary] = boundary === 'a' ? Math.min(value, state.b) : Math.max(value, state.a);
      syncEndpoints(prefix, state);
      put(which + '-error', '');
      schedule(which);
      event.preventDefault();
    });
    function finish(event) {
      if (event.pointerId !== pointer) return;
      pointer = null;
      boundary = null;
      state.dragBounds = null;
      schedule(which);
    }
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) svg.addEventListener(name, finish);
  }

  function bindCountAndPlayback() {
    for (const id of ['n-slider', 'n-number']) {
      get(id).addEventListener('input', () => {
        stop();
        const count = get(id).valueAsNumber;
        try { E.validateCount(count); }
        catch (error) {
          put('sum-error', error.message);
          get(id).setAttribute('aria-invalid', 'true');
          return;
        }
        setCount(count);
      });
    }
    for (const button of document.querySelectorAll('[data-n]')) {
      button.addEventListener('click', () => { stop(); setCount(Number(button.dataset.n)); });
    }
    get('mode').addEventListener('change', () => { sum.mode = get('mode').value; schedule('sum'); });
    get('play').addEventListener('click', () => {
      if (playback.active) return stop();
      if (sum.n === 200) setCount(1);
      playback.active = true;
      playback.elapsed = 0;
      playback.lastTime = null;
      put('play', '一時停止');
      playback.frame = requestAnimationFrame(animate);
    });
    get('reset').addEventListener('click', () => { stop(); setCount(4); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  }

  buildEndpoints(get('area-endpoints'), 'area', area, 'area');
  buildEndpoints(get('sum-endpoints'), 'sum', sum, 'sum');
  populateFunctions(get('area-function'), area, 'area', 'area');
  populateFunctions(get('function'), sum, 'sum', 'sum');
  bindBoundary(get('area-graph'), area, 'area', 'area');
  bindBoundary(get('sum-graph'), sum, 'sum', 'sum');
  bindCountAndPlayback();
  window.addEventListener('resize', () => { schedule('area'); schedule('sum'); });
  renderArea();
  renderSum();
})();
