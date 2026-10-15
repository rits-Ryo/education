(function (root) {
  'use strict';

  const E = root.DifferentiationEngine;
  const WIDTH = 720;
  const HEIGHT = 420;
  const PAD_X = 55;
  const PAD_Y = 40;
  const COLORS = { curve: '#235f9f', derivative: '#946400', tangent: '#7253b0', increase: '#18754c', decrease: '#b32948' };

  function node(tag, attributes = {}, text) {
    const result = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) result.setAttribute(key, value);
    if (text !== undefined) result.textContent = text;
    return result;
  }

  function tickStep(span) {
    const raw = span / 6;
    const power = 10 ** Math.floor(Math.log10(raw));
    return [1, 2, 5, 10].find(value => value * power >= raw) * power;
  }

  function view(id, derivative = false) {
    const f = E.model(id);
    const left = f.range[0] - 1;
    const right = f.range[1] + 1;
    const evaluate = derivative ? f.derivative : f.value;
    let bottom = 0;
    let top = 0;
    for (let i = 0; i <= 500; i += 1) {
      const value = evaluate(left + (right - left) * i / 500);
      if (value === null) continue;
      bottom = Math.min(bottom, value);
      top = Math.max(top, value);
    }
    const margin = Math.max(0.5, (top - bottom) * 0.12);
    return { left, right, bottom: bottom - margin, top: top + margin };
  }

  function coordinates(bounds, width = WIDTH) {
    return {
      x: value => PAD_X + (value - bounds.left) / (bounds.right - bounds.left) * (width - PAD_X * 2),
      y: value => HEIGHT - PAD_Y - (value - bounds.bottom) / (bounds.top - bounds.bottom) * (HEIGHT - PAD_Y * 2),
      fromX: value => bounds.left + (value - PAD_X) / (width - PAD_X * 2) * (bounds.right - bounds.left)
    };
  }

  function draw(svg, id, options = {}) {
    const f = E.model(id);
    const derivative = !!options.derivative;
    const evaluate = derivative ? f.derivative : f.value;
    const bounds = view(id, derivative);
    // 狭い画面ではviewBoxも狭くし、文字とグラフの高さを確保する。
    const width = Math.min(WIDTH, Math.max(320, svg.clientWidth || WIDTH));
    svg.setAttribute('viewBox', `0 0 ${width} ${HEIGHT}`);
    const map = coordinates(bounds, width);
    svg.replaceChildren();

    const clipId = svg.id + '-clip';
    const defs = node('defs');
    const clip = node('clipPath', { id: clipId });
    clip.append(node('rect', { x: PAD_X, y: PAD_Y, width: width - PAD_X * 2, height: HEIGHT - PAD_Y * 2 }));
    defs.append(clip);
    svg.append(defs);
    const plot = node('g', { 'clip-path': `url(#${clipId})` });

    function line(parent, x1, y1, x2, y2, color, dash = '', width = 1.5) {
      parent.append(node('line', { x1: map.x(x1), y1: map.y(y1), x2: map.x(x2), y2: map.y(y2), stroke: color, 'stroke-width': width, 'stroke-dasharray': dash }));
    }

    function text(x, y, value, color = '#20324a', anchor = 'start') {
      svg.append(node('text', { x, y, fill: color, 'text-anchor': anchor }, value));
    }

    const xStep = tickStep(bounds.right - bounds.left);
    const yStep = tickStep(bounds.top - bounds.bottom);
    for (let value = Math.ceil(bounds.left / xStep) * xStep; value <= bounds.right; value += xStep) {
      line(svg, value, bounds.bottom, value, bounds.top, '#e0e7f1');
      text(map.x(value), HEIGHT - 15, root.NumberDisplay.formatNumber(value), '#586b84', 'middle');
    }
    for (let value = Math.ceil(bounds.bottom / yStep) * yStep; value <= bounds.top; value += yStep) {
      line(svg, bounds.left, value, bounds.right, value, '#e0e7f1');
      text(PAD_X - 8, map.y(value) + 5, root.NumberDisplay.formatNumber(value), '#586b84', 'end');
    }
    line(svg, bounds.left, 0, bounds.right, 0, '#61738b');
    line(svg, 0, bounds.bottom, 0, bounds.top, '#61738b');
    text(width - 26, HEIGHT - 15, 'x');
    text(18, 22, 'y');

    const sections = E.intervals(id, bounds.left, bounds.right);
    for (const section of sections) {
      let path = '';
      let penDown = false;
      const count = Math.max(40, Math.ceil(650 * (section.right - section.left) / (bounds.right - bounds.left)));
      for (let i = 0; i <= count; i += 1) {
        const x = section.left + (section.right - section.left) * i / count;
        const y = evaluate(x);
        if (y === null || !Number.isFinite(y)) {
          penDown = false;
          continue;
        }
        path += `${penDown ? 'L' : 'M'}${map.x(x).toFixed(2)},${map.y(y).toFixed(2)} `;
        penDown = true;
      }
      const color = options.variation ? section.sign === '正' ? COLORS.increase : COLORS.decrease : derivative ? COLORS.derivative : COLORS.curve;
      plot.append(node('path', { d: path, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-dasharray': options.variation && section.sign === '負' ? '8 4' : '' }));
    }

    if (options.stationary) {
      for (const point of E.stationaryPoints(id, bounds.left, bounds.right)) {
        plot.append(node('circle', { cx: map.x(point.x), cy: map.y(derivative ? 0 : point.y), r: 9, fill: 'none', stroke: '#946400', 'stroke-width': 2 }));
      }
    }

    function marker(x, y, name, color, labelBelow = false, draggable = false) {
      if (y === null) return;
      plot.append(node('circle', { cx: map.x(x), cy: map.y(y), r: 6, fill: color, stroke: '#fff', 'stroke-width': 1.5 }));
      if (draggable) plot.append(node('circle', { cx: map.x(x), cy: map.y(y), r: 22, fill: 'transparent', 'data-point': name, class: 'drag-handle' }));
      text(map.x(x) + 12, map.y(y) + (labelBelow ? 28 : -14), name, color);
    }

    if (options.a !== undefined) {
      const a = options.a;
      line(plot, a, bounds.bottom, a, bounds.top, '#7253b0', '4 6');
      const tangent = E.tangent(id, a);
      if (!derivative && options.tangent && tangent) {
        line(plot, bounds.left, tangent.value(bounds.left), bounds.right, tangent.value(bounds.right), COLORS.tangent, '', 2.5);
      }
      if (!derivative && options.h !== undefined) {
        const rate = E.averageRate(id, a, options.h);
        if (options.secant && rate !== null) {
          line(plot, bounds.left, f.value(a) + rate * (bounds.left - a), bounds.right, f.value(a) + rate * (bounds.right - a), COLORS.curve, '8 5', 2.5);
          line(plot, a, f.value(a), a + options.h, f.value(a), '#8195ac', '3 5');
          line(plot, a + options.h, f.value(a), a + options.h, f.value(a + options.h), '#8195ac', '3 5');
        }
        marker(a + options.h, f.value(a + options.h), 'Q', COLORS.curve, true, true);
      }
      marker(a, evaluate(a), derivative ? 'R' : 'P', COLORS.tangent, false, !derivative);
    }

    if (options.oneSided) {
      line(plot, bounds.left, -bounds.left, 0, 0, COLORS.decrease, '8 5', 2.5);
      line(plot, 0, 0, bounds.right, bounds.right, COLORS.increase, '', 2.5);
      marker(-0.6, 0.6, 'Q−', COLORS.decrease);
      marker(0.6, 0.6, 'Q＋', COLORS.increase, true);
      marker(0, 0, 'P', COLORS.tangent);
    }
    svg.append(plot);
    return { bounds, map };
  }

  root.DifferentiationDrawing = { draw, view, coordinates, tickStep };
})(globalThis);
