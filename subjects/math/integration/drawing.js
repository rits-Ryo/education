(function (root) {
  'use strict';

  const E = root.IntegrationEngine;
  const HEIGHT = 460;
  const PAD_X = 55;
  const PAD_Y = 48;
  const cache = new WeakMap();

  function node(tag, attributes = {}, text) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function view(id, a, b) {
    const margin = Math.max(0.4, (b - a) * 0.2);
    const left = a - margin;
    const right = b + margin;
    let bottom = 0;
    let top = 0;
    for (let i = 0; i <= 400; i += 1) {
      const y = E.value(id, left + (right - left) * i / 400);
      bottom = Math.min(bottom, y);
      top = Math.max(top, y);
    }
    const verticalMargin = Math.max(0.3, (top - bottom) * 0.15);
    return { left, right, bottom: bottom - verticalMargin, top: top + verticalMargin };
  }

  function coordinates(bounds, width) {
    return {
      x: value => PAD_X + (value - bounds.left) / (bounds.right - bounds.left) * (width - PAD_X * 2),
      y: value => HEIGHT - PAD_Y - (value - bounds.bottom) / (bounds.top - bounds.bottom) * (HEIGHT - PAD_Y * 2),
      fromX: value => bounds.left + (value - PAD_X) / (width - PAD_X * 2) * (bounds.right - bounds.left)
    };
  }

  function tickStep(span) {
    const power = 10 ** Math.floor(Math.log10(span / 5));
    return [1, 2, 5, 10].find(value => value * power >= span / 5) * power;
  }

  function makeBase(svg, state, bounds, width) {
    const { id, a, b } = state;
    const map = coordinates(bounds, width);
    svg.setAttribute('viewBox', `0 0 ${width} ${HEIGHT}`);
    svg.replaceChildren();
    const defs = node('defs');
    const clipId = svg.id + '-clip';
    const patternId = svg.id + '-negative';
    const clip = node('clipPath', { id: clipId });
    clip.append(node('rect', { x: PAD_X, y: PAD_Y, width: width - PAD_X * 2, height: HEIGHT - PAD_Y * 2 }));
    const pattern = node('pattern', { id: patternId, width: 9, height: 9, patternUnits: 'userSpaceOnUse' });
    pattern.append(node('rect', { width: 9, height: 9, fill: '#b3294822' }));
    pattern.append(node('path', { d: 'M-2,2 L2,-2 M0,9 L9,0 M7,11 L11,7', stroke: '#b32948', 'stroke-opacity': 0.35, 'stroke-width': 1 }));
    defs.append(clip, pattern);
    svg.append(defs);

    function line(parent, x1, y1, x2, y2, color, dash = '') {
      parent.append(node('line', { x1: map.x(x1), y1: map.y(y1), x2: map.x(x2), y2: map.y(y2), stroke: color, 'stroke-dasharray': dash }));
    }

    function label(x, y, text, anchor = 'start') {
      svg.append(node('text', { x, y, fill: '#20324a', 'text-anchor': anchor }, text));
    }

    const xStep = tickStep(bounds.right - bounds.left);
    const yStep = tickStep(bounds.top - bounds.bottom);
    for (let value = Math.ceil(bounds.left / xStep) * xStep; value <= bounds.right; value += xStep) {
      line(svg, value, bounds.bottom, value, bounds.top, '#e0e7f1');
      label(map.x(value), HEIGHT - 15, root.NumberDisplay.formatNumber(value), 'middle');
    }
    for (let value = Math.ceil(bounds.bottom / yStep) * yStep; value <= bounds.top; value += yStep) {
      line(svg, bounds.left, value, bounds.right, value, '#e0e7f1');
      label(PAD_X - 8, map.y(value) + 5, root.NumberDisplay.formatNumber(value), 'end');
    }
    line(svg, bounds.left, 0, bounds.right, 0, '#61738b');
    if (bounds.left <= 0 && bounds.right >= 0) line(svg, 0, bounds.bottom, 0, bounds.top, '#61738b');
    label(width - 23, HEIGHT - 15, 'x');
    label(18, 25, 'y');

    const areas = node('g', { 'clip-path': `url(#${clipId})` });
    const rectangles = node('g', { 'clip-path': `url(#${clipId})` });
    const curve = node('g', { 'clip-path': `url(#${clipId})` });
    const boundary = node('g');

    for (const region of E.signedRegions(id, a, b)) {
      let path = `M${map.x(region.left)},${map.y(0)} `;
      for (let i = 0; i <= 150; i += 1) {
        const x = region.left + (region.right - region.left) * i / 150;
        path += `L${map.x(x).toFixed(2)},${map.y(E.value(id, x)).toFixed(2)} `;
      }
      path += `L${map.x(region.right)},${map.y(0)} Z`;
      areas.append(node('path', { d: path, fill: region.sign >= 0 ? '#226bd633' : `url(#${patternId})` }));
    }

    let path = '';
    for (let i = 0; i <= 600; i += 1) {
      const x = bounds.left + (bounds.right - bounds.left) * i / 600;
      path += `${i === 0 ? 'M' : 'L'}${map.x(x).toFixed(2)},${map.y(E.value(id, x)).toFixed(2)} `;
    }
    curve.append(node('path', { d: path, fill: 'none', stroke: '#203f72', 'stroke-width': 3 }));

    for (const [name, value] of [['a', a], ['b', b]]) {
      const x = map.x(value);
      const y = name === 'a' ? 23 : 47;
      line(boundary, value, bounds.bottom, value, bounds.top, '#7253b0', '5 5');
      boundary.append(node('circle', { cx: x, cy: y, r: 15, fill: '#7253b0', 'data-boundary': name, class: 'boundary-handle' }));
      boundary.append(node('text', { x, y: y + 5, fill: '#fff', 'text-anchor': 'middle', 'pointer-events': 'none' }, name));
      // 線上にも広めのヒット領域を置く。両端一致時は上の別々のハンドルを使う。
      boundary.append(node('line', { x1: x, x2: x, y1: 64, y2: HEIGHT - PAD_Y, stroke: 'transparent', 'stroke-width': 20, 'data-boundary': name, class: 'boundary-handle' }));
    }
    svg.append(areas, rectangles, curve, boundary);
    return { bounds, map, width, areas, rectangles, curve };
  }

  function draw(svg, state, result = null) {
    const width = Math.min(720, Math.max(320, svg.clientWidth || 720));
    const bounds = state.dragBounds || view(state.id, state.a, state.b);
    const key = JSON.stringify([state.id, state.a, state.b, width, bounds]);
    let base = cache.get(svg);
    if (!base || base.key !== key) {
      base = { ...makeBase(svg, state, bounds, width), key };
      cache.set(svg, base);
    }
    const mode = state.mode || 'curve';
    base.areas.setAttribute('display', mode === 'rectangles' ? 'none' : 'inline');
    base.curve.setAttribute('display', mode === 'rectangles' ? 'none' : 'inline');
    base.rectangles.replaceChildren();
    if (result && mode !== 'curve' && result.width !== 0) {
      const fragment = document.createDocumentFragment();
      for (const rectangle of result.rectangles) {
        const top = Math.max(0, rectangle.height);
        fragment.append(node('rect', {
          x: base.map.x(rectangle.left),
          y: base.map.y(top),
          width: Math.max(0, base.map.x(rectangle.right) - base.map.x(rectangle.left)),
          height: Math.abs(base.map.y(rectangle.height) - base.map.y(0)),
          fill: rectangle.height >= 0 ? '#7253b033' : '#b3294844',
          stroke: rectangle.height >= 0 ? '#7253b0' : '#b32948',
          'stroke-width': result.n <= 40 ? 1.3 : 0.25
        }));
      }
      base.rectangles.append(fragment);
    }
    return base;
  }

  root.IntegrationDrawing = { draw, view, coordinates };
})(globalThis);
