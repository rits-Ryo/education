(function (root) {
  'use strict';
  const decimal = new Intl.NumberFormat('en-US', {
    useGrouping: false, maximumFractionDigits: 3
  });

  // Display strings only. Never feed these back into calculations or decisions.
  function formatNumber(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
    const text = decimal.format(value);
    return text === '-0' ? '0' : text;
  }

  // Keep a nonzero sign visible when ordinary rounding would display zero.
  function formatNonzero(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
    if (value !== 0 && Math.abs(value) < 0.0005) {
      const [mantissa, exponent] = value.toExponential().split('e');
      return formatScientific(Number(mantissa), Number(exponent));
    }
    return formatNumber(value);
  }

  // Also supports exact decimal products below Number's representable range.
  function formatScientific(mantissa, exponent) {
    if (!Number.isFinite(mantissa) || !Number.isInteger(exponent)) return '—';
    if (mantissa === 0) return '0';
    const [digits, power] = mantissa.toExponential().split('e');
    let text = formatNumber(Number(digits));
    let e = exponent + Number(power);
    if (text === '10' || text === '-10') {
      text = text.startsWith('-') ? '-1' : '1';
      e += 1;
    }
    return `${text} × 10^${e}`;
  }

  const api = { formatNumber, formatNonzero, formatScientific };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.NumberDisplay = api;
})(typeof window !== 'undefined' ? window : globalThis);
