(function () {
  'use strict';

  const K=window.MathDisplay,L=K.token;
  const M = window.TrigMath;
  const D = window.TrigDrawing;
  const get = id => document.getElementById(id);
  const state = {
    angle: M.toRadians(30),
    unit: 'deg',
    playing: false,
    lastTime: null,
    frame: null,
    dragAngle: null,
    coefficients: { a: 1, b: 1, c: 0, d: 0 }
  };
  const LIMIT = 4 * Math.PI;
  const format = window.NumberDisplay.formatNonzero;
  const put = (id, text) => { if(['angle-label','point-label','sin-label','cos-label','tan-label','arc-label','identity-values','graph-values','transform-formula','transform-properties'].includes(id))K.renderMath(get(id),text,{displayMode:id==='transform-formula'||id==='transform-properties'||id==='arc-label'});else get(id).textContent=text; };

  function displayValue(values, kind) {
    if (values[kind] === null) return K.text('定義されません');
    return L(values.exact ? values.exact[kind] : format(values[kind]));
  }

  function angleText(angle) {
    const degrees = M.toDegrees(angle);
    const units = Math.round(degrees / 15);
    if (Math.abs(degrees - units * 15) < 1e-8) {
      let numerator = units;
      let denominator = 12;
      const gcd = (a, b) => b ? gcd(b, a % b) : a;
      const divisor = gcd(Math.abs(numerator), denominator);
      numerator /= divisor;
      denominator /= divisor;
      const radian = numerator === 0 ? '0' : `${numerator === 1 ? '' : numerator === -1 ? '−' : numerator}π${denominator === 1 ? '' : '/' + denominator}`;
      return String.raw`${L(format(degrees))}^{\circ}=${L(radian)}\,\mathrm{rad}`;
    }
    return String.raw`${L(format(degrees))}^{\circ}\approx${L(format(angle))}\,\mathrm{rad}`;
  }

  function syncAngleInputs() {
    const value = state.unit === 'deg' ? M.toDegrees(state.angle) : state.angle;
    get('angle-slider').value = value;
    // 入力値は表示用の丸めで精度を失わないようにする。
    get('angle-number').value = String(value);
    put('input-error', '');
    get('angle-number').removeAttribute('aria-invalid');
    get('angle-slider').removeAttribute('aria-invalid');
  }

  function renderAngle() {
    const values = M.trig(state.angle);
    D.circle(get('circle'), state.angle, { interactive: true });
    D.circle(get('linked-circle'), state.angle);
    D.circle(get('arc-circle'), state.angle, { arc: true });
    D.circle(get('triangle-circle'), state.angle, { triangle: true });
    put('angle-label',angleText(state.angle));
    put('point-label',String.raw`P\approx(${L(format(values.cos))},${L(format(values.sin))})`);
    for (const kind of ['sin', 'cos', 'tan']) {
      const relation = values.exact || values[kind] === null ? '=' : '≒';
      put(kind+'-label','\\'+kind+String.raw`\theta ${relation==='='?'=':'\\approx'} ${displayValue(values,kind)}`);
    }
    const sign = value => value === null ? '未定義' : value === 0 ? '0' : value > 0 ? '正' : '負';
    put('quadrant-label', `${M.quadrant(state.angle)} ／ sin：${sign(values.sin)}、cos：${sign(values.cos)}、tan：${sign(values.tan)}`);
    const turns = Math.trunc(state.angle / M.TAU);
    put('arc-label',String.raw`\begin{aligned}\theta&:${angleText(state.angle)}\\\text{整数周回数}&:${turns}\\\text{残りの回転}&:${angleText(state.angle%M.TAU)}\\\ell=|\theta|&\approx${L(format(Math.abs(state.angle)))}\quad(r=1)\end{aligned}`);
    put('identity-values',String.raw`\sin^2\theta\approx${L(format(values.sin**2))},\quad\cos^2\theta\approx${L(format(values.cos**2))},\quad\sin^2\theta+\cos^2\theta=1`);
    renderGraph();
  }

  function renderGraph() {
    const span = Number(get('graph-span').value) * Math.PI;
    // 表示中心をπ単位で追従させ、ドラッグ中の細かな揺れを避ける。
    const center = Math.round(state.angle / Math.PI) * Math.PI;
    const kinds = ['sin', 'cos', 'tan'].filter(kind => get('show-' + kind).checked);
    D.graph(get('graph'), {
      left: center - span / 2,
      right: center + span / 2,
      bottom: -3,
      top: 3,
      angle: state.angle,
      curves: kinds.map(kind => ({ kind, evaluate: x => M.trig(x)[kind] }))
    });
    const values = M.trig(state.angle);
    put('graph-values',angleText(state.angle)+'\\quad '+kinds.map(kind=>'\\'+kind+String.raw`\theta:${displayValue(values,kind)}`).join('\\quad '));
  }

  function pause() {
    state.playing = false;
    state.lastTime = null;
    cancelAnimationFrame(state.frame);
    put('play', '再生');
  }

  function setAngle(angle, synchronize = true) {
    state.angle = Math.max(-LIMIT, Math.min(LIMIT, angle));
    if (synchronize) syncAngleInputs();
    renderAngle();
  }

  function animate(time) {
    if (!state.playing) return;
    if (state.lastTime !== null) {
      const seconds = Math.min((time - state.lastTime) / 1000, 0.1);
      setAngle(state.angle + M.toRadians(Number(get('speed').value)) * seconds);
    }
    state.lastTime = time;
    if (state.angle >= LIMIT) {
      pause();
      return;
    }
    state.frame = requestAnimationFrame(animate);
  }

  function bindAngleControls() {
    get('unit').addEventListener('change', () => {
      state.unit = get('unit').value;
      const limit = state.unit === 'deg' ? 720 : LIMIT;
      for (const id of ['angle-slider', 'angle-number']) {
        get(id).min = -limit;
        get(id).max = limit;
      }
      // ±4πを起点とする刻みに値を丸めず、代表角・直接入力と同期する。
      get('angle-slider').step = 'any';
      syncAngleInputs();
    });
    for (const id of ['angle-slider', 'angle-number']) {
      get(id).addEventListener('input', () => {
        pause();
        const value = get(id).valueAsNumber;
        const angle = state.unit === 'deg' ? value * Math.PI / 180 : value;
        if (!Number.isFinite(angle) || Math.abs(angle) > LIMIT + 1e-10) {
          put('input-error', '角度は−720°〜720°（−4π〜4π rad）の範囲で入力してください。');
          get(id).setAttribute('aria-invalid', 'true');
          return;
        }
        put('input-error', '');
        get(id).removeAttribute('aria-invalid');
        setAngle(angle, id !== 'angle-number');
        if (id === 'angle-number') get('angle-slider').value = value;
      });
      get(id).addEventListener('change', syncAngleInputs);
    }
    for (const button of document.querySelectorAll('[data-angle]')) {
      button.addEventListener('click', () => { pause(); setAngle(M.toRadians(Number(button.dataset.angle))); });
    }
    for (const id of ['show-sin', 'show-cos', 'show-tan', 'graph-span']) get(id).addEventListener('change', renderGraph);
    get('play').addEventListener('click', () => {
      if (state.playing) return pause();
      if (state.angle >= LIMIT) setAngle(0);
      state.playing = true;
      put('play', '一時停止');
      state.frame = requestAnimationFrame(animate);
    });
    get('reset').addEventListener('click', () => { pause(); setAngle(0); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  }

  function bindCircleDrag() {
    const svg = get('circle');
    let activePointer = null;
    function pointerAngle(event) {
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
      return Math.atan2(220 - point.y, point.x - 220);
    }
    svg.addEventListener('pointerdown', event => {
      if (activePointer !== null || !event.target.hasAttribute('data-handle')) return;
      pause();
      activePointer = event.pointerId;
      state.dragAngle = pointerAngle(event);
      svg.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    svg.addEventListener('pointermove', event => {
      if (event.pointerId !== activePointer) return;
      const next = pointerAngle(event);
      let delta = next - state.dragAngle;
      if (delta > Math.PI) delta -= M.TAU;
      if (delta < -Math.PI) delta += M.TAU;
      state.dragAngle = next;
      setAngle(state.angle + delta);
      event.preventDefault();
    });
    function end(event) {
      if (event.pointerId === activePointer) {
        activePointer = null;
        state.dragAngle = null;
      }
    }
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) svg.addEventListener(name, end);
  }

  function renderTransformation() {
    const kind = get('transform-kind').value;
    const coefficients = state.coefficients;
    const { a, b, c, d } = coefficients;
    const properties = M.properties(kind, coefficients);
    const extent = Math.max(2, Math.abs(d) + Math.abs(a) + 1);
    D.graph(get('transform-graph'), {
      left: -2 * Math.PI,
      right: 2 * Math.PI,
      bottom: -extent,
      top: extent,
      curves: [
        { kind, color: '#8a9bb4', dash: '5 5', evaluate: x => M.trig(x)[kind] },
        { kind: 'transformed', evaluate: x => M.transformed(kind, x, coefficients) }
      ]
    });
    put('transform-formula',String.raw`y\approx(${L(format(a))})${'\\'+kind}\left((${L(format(b))})x+(${L(format(c))})\right)+(${L(format(d))})`);
    put('transform-properties', properties.constant!==null?String.raw`y\approx${L(format(properties.constant))}\quad\text{定数関数：最小の正の周期なし}`:String.raw`\begin{aligned}\text{振幅}&\approx${L(format(properties.amplitude))}\\\text{基本周期 }\frac{2\pi}{|b|}&\approx${L(format(properties.period))}\\\text{横方向の移動 }-\frac cb&\approx${L(format(properties.shift))}\,\mathrm{rad}\\\text{中心線 }y&\approx${L(format(d))}\\\text{最小値}&\approx${L(format(d-Math.abs(a)))}\\\text{最大値}&\approx${L(format(d+Math.abs(a)))}\end{aligned}`);


  }

  function bindCoefficients() {
    for (const name of ['a', 'b', 'c', 'd']) {
      const label = document.createElement('label');
      const title = document.createElement('span');
      title.textContent = name;
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = -5;
      slider.max = 5;
      // 数値入力の精度をスライダーへの代入でも維持する。
      slider.step = 'any';
      slider.value = state.coefficients[name];
      slider.setAttribute('aria-label', `${name} のスライダー`);
      const number = document.createElement('input');
      number.type = 'number';
      number.min = -5;
      number.max = 5;
      number.step = 'any';
      number.value = slider.value;
      number.setAttribute('aria-label', `${name} の数値`);
      label.append(title, slider, number);
      get('coefficient-controls').append(label);
      for (const control of [slider, number]) {
        control.addEventListener('input', () => {
          const value = control.valueAsNumber;
          if (!Number.isFinite(value) || Math.abs(value) > 5 || (value !== 0 && Math.abs(value) < 1e-6)) {
            put('coefficient-error', '係数は−5〜5で入力してください。0以外の絶対値は0.000001以上にしてください。');
            control.setAttribute('aria-invalid', 'true');
            return;
          }
          put('coefficient-error', '');
          control.removeAttribute('aria-invalid');
          state.coefficients[name] = value;
          if (control === slider) number.value = value;
          else slider.value = value;
          renderTransformation();
        });
      }
    }
    get('transform-kind').addEventListener('change', renderTransformation);
    get('transform-reset').addEventListener('click', () => {
      state.coefficients = { a: 1, b: 1, c: 0, d: 0 };
      const labels = get('coefficient-controls').querySelectorAll('label');
      labels.forEach((label, index) => {
        const name = ['a', 'b', 'c', 'd'][index];
        for (const input of label.querySelectorAll('input')) {
          input.value = state.coefficients[name];
          input.removeAttribute('aria-invalid');
        }
      });
      put('coefficient-error', '');
      renderTransformation();
    });
  }

  bindAngleControls();
  bindCircleDrag();
  bindCoefficients();
  syncAngleInputs();
  renderAngle();
  renderTransformation();
})();
