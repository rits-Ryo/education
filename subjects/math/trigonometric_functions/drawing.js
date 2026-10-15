(function (root) {
  'use strict';

  const M = root.TrigMath;
  const COLORS = { sin: '#b32948', cos: '#17609c', tan: '#946400', transformed: '#7253b0' };
  const DASHES = { sin: '', cos: '9 5', tan: '2 5' };

  function element(tag, attributes = {}, text) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function line(svg, x1, y1, x2, y2, color = '#9bacc2', dash = '') {
    svg.append(element('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': 1.5, 'stroke-dasharray': dash }));
  }

  function label(svg, x, y, text, color = '#20324a') {
    svg.append(element('text', { x, y, fill: color }, text));
  }

  function circle(svg, angle, options = {}) {
    svg.replaceChildren();
    const center = 220;
    const radius = 145;
    const { sin, cos } = M.trig(angle);
    const px = center + radius * cos;
    const py = center - radius * sin;

    line(svg, 25, center, 415, center);
    line(svg, center, 25, center, 415);
    svg.append(element('circle', { cx: center, cy: center, r: radius, fill: 'none', stroke: '#8a9bb4', 'stroke-width': 2 }));
    label(svg, 405, 210, 'x');
    label(svg, 230, 30, 'y');
    label(svg, 202, 242, 'O');
    label(svg, 360, 242, '1');
    label(svg, 57, 242, '−1');
    label(svg, 230, 79, '1');
    label(svg, 230, 368, '−1');

    if (options.triangle) {
      svg.append(element('polygon', {
        points: `${center},${center} ${px},${center} ${px},${py}`,
        fill: '#7253b018', stroke: '#7253b0'
      }));
      label(svg, (center + px) / 2 - 25, center + (sin >= 0 ? 28 : -15), '|cos θ|', COLORS.cos);
      label(svg, px + (cos >= 0 ? 10 : -65), (center + py) / 2, '|sin θ|', COLORS.sin);
      label(svg, (center + px) / 2, (center + py) / 2 - 10, '1');
      label(svg, px + 5, center + (sin >= 0 ? 17 : -10), 'H');
    }

    line(svg, px, py, px, center, COLORS.sin, '5 5');
    line(svg, px, py, center, py, COLORS.cos, '5 5');
    line(svg, center, center, px, py, '#7253b0');

    // 残りの回転を符号付きで描く。1周ごとの全長は文章で示す。
    const remainder = angle % M.TAU;
    const arcRadius = options.arc ? radius + 12 : 38;
    if (Math.abs(remainder) > 1e-10) {
      const count = Math.max(2, Math.ceil(Math.abs(remainder) * 30));
      const points = [];
      for (let i = 0; i <= count; i += 1) {
        const theta = remainder * i / count;
        points.push(`${center + arcRadius * Math.cos(theta)},${center - arcRadius * Math.sin(theta)}`);
      }
      svg.append(element('polyline', { points: points.join(' '), fill: 'none', stroke: '#7253b0', 'stroke-width': options.arc ? 5 : 2 }));
    }
    label(svg, 264, 198, options.arc ? '円弧' : 'θ', '#7253b0');
    svg.append(element('circle', { cx: px, cy: py, r: 8, fill: '#7253b0', stroke: '#fff', 'stroke-width': 2, class: 'point-handle' }));
    if (options.interactive) {
      svg.append(element('circle', { cx: px, cy: py, r: 24, fill: 'transparent', class: 'point-handle', 'data-handle': 'point' }));
    }
    label(svg, px + (cos > 0.8 ? -28 : 13), py + (sin < -0.8 ? -18 : -15), 'P', '#7253b0');
  }

  function piLabel(value) {
    const halves = Math.round(value / Math.PI * 2);
    if (halves === 0) return '0';
    const sign = halves < 0 ? '−' : '';
    const amount = Math.abs(halves);
    if (amount % 2 === 0) return sign + (amount === 2 ? '' : amount / 2) + 'π';
    return sign + (amount === 1 ? '' : amount) + 'π/2';
  }

  function graph(svg, config) {
    svg.replaceChildren();
    const { left, right, bottom, top, curves, angle = null } = config;
    const width = 760;
    const height = 360;
    const padding = 40;
    const x = value => padding + (value - left) / (right - left) * (width - 2 * padding);
    const y = value => height - padding - (value - bottom) / (top - bottom) * (height - 2 * padding);
    const clipId = svg.id + '-clip';
    const defs = element('defs');
    const clip = element('clipPath', { id: clipId });
    clip.append(element('rect', { x: padding, y: padding, width: width - 2 * padding, height: height - 2 * padding }));
    defs.append(clip);
    svg.append(defs);
    const plot = element('g', { 'clip-path': `url(#${clipId})` });

    const tickStep = right - left > 6 * Math.PI ? Math.PI : Math.PI / 2;
    for (let tick = Math.ceil(left / tickStep) * tickStep; tick <= right + 1e-9; tick += tickStep) {
      line(svg, x(tick), padding, x(tick), height - padding, '#e0e7f1');
      label(svg, x(tick) - 12, height - 13, piLabel(tick));
    }
    const yStep = Math.max(1, Math.ceil((top - bottom) / 8));
    for (let tick = Math.ceil(bottom / yStep) * yStep; tick <= top; tick += yStep) {
      line(svg, padding, y(tick), width - padding, y(tick), '#e0e7f1');
      label(svg, 8, y(tick) + 5, root.NumberDisplay.formatNumber(tick));
    }
    line(svg, padding, y(0), width - padding, y(0), '#61738b');
    if (left <= 0 && right >= 0) line(svg, x(0), padding, x(0), height - padding, '#61738b');
    label(svg, width - 30, height - 13, 'x');
    label(svg, 15, 25, 'y');

    for (const [curveIndex, curve] of curves.entries()) {
      const color = curve.color || COLORS[curve.kind];
      const poles = curve.kind === 'tan' ? M.asymptotes(left, right) : [];
      for (const pole of poles) line(svg, x(pole), padding, x(pole), height - padding, COLORS.tan, '5 6');
      const boundaries = [left, ...poles.filter(pole => pole > left && pole < right), right];
      for (let section = 0; section < boundaries.length - 1; section += 1) {
        const start = boundaries[section];
        const end = boundaries[section + 1];
        let path = '';
        let penDown = false;
        const samples = Math.max(80, Math.ceil(900 * (end - start) / (right - left)));
        for (let i = 0; i <= samples; i += 1) {
          const valueX = start + (end - start) * i / samples;
          const valueY = curve.evaluate(valueX);
          if (valueY === null || !Number.isFinite(valueY) || Math.abs(valueY) > 1e5) {
            penDown = false;
            continue;
          }
          path += `${penDown ? 'L' : 'M'}${x(valueX).toFixed(2)},${y(valueY).toFixed(2)} `;
          penDown = true;
        }
        plot.append(element('path', { d: path, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-dasharray': curve.dash ?? DASHES[curve.kind] ?? '' }));
      }
      if (angle !== null) {
        const value = curve.evaluate(angle);
        if (value !== null && value >= bottom && value <= top) {
          plot.append(element('circle', { cx: x(angle), cy: y(value), r: 6, fill: color, stroke: '#fff', 'stroke-width': 1.5 }));
          label(svg, x(angle) + 8, y(value) - 10 - curveIndex * 18, curve.kind, color);
        }
      }
    }
    if (angle !== null) line(svg, x(angle), padding, x(angle), height - padding, '#7253b0', '4 6');
    svg.append(plot);
  }

  root.TrigDrawing = { circle, graph, piLabel };
})(globalThis);
