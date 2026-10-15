(function (root) {
  'use strict';
  const cache = new WeakMap();
  const settings = { trust: false, strict: 'error', throwOnError: true,
    maxExpand: 1000, maxSize: 20, output: 'htmlAndMathml' };

  function renderMath(element, latex, options = {}) {
    if (!element || typeof latex !== 'string') return false;
    const displayMode = options.displayMode === true;
    const previous = cache.get(element);
    if (previous && previous.latex === latex && previous.displayMode === displayMode &&
        previous.success && element.querySelector?.('.katex')) return true;
    element.setAttribute('data-math-source', latex);
    element.setAttribute('data-math-display', String(displayMode));
    element.classList?.remove('math-block', 'math-inline');
    element.classList?.add(displayMode ? 'math-block' : 'math-inline');
    try {
      if (!root.katex) throw new Error('KaTeXを読み込めませんでした');
      root.katex.render(latex, element, { ...settings, displayMode });
      if(element.getAttribute?.('data-math-error'))element.removeAttribute('title');
      element.removeAttribute('data-math-error');
      cache.set(element, { latex, displayMode, success: true });
      return true;
    } catch (error) {
      element.textContent = (displayMode ? '\\[' : '\\(') + latex + (displayMode ? '\\]' : '\\)');
      element.setAttribute('data-math-error', error.message);
      element.setAttribute('title', '数式の組版に失敗しました：' + error.message);
      cache.set(element, { latex, displayMode, success: false, error: error.message });
      if (!previous || previous.error !== error.message) root.console?.error('数式の組版に失敗しました', latex, error);
      return false;
    }
  }

  function renderMathInContainer(element) {
    if (!element) return;
    // Only explicit delimiters are interpreted; inputs, SVG and code stay intact.
    if (root.renderMathInElement) root.renderMathInElement(element, {
      ...settings, delimiters: [{ left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }],
      ignoredTags: ['script','noscript','style','textarea','pre','code','option','svg'],
      ignoredClasses: ['katex','math-block','math-inline'],
      errorCallback(message, error) { element.setAttribute('data-math-error', message); root.console?.error(message, error); }
    });
    for (const node of element.querySelectorAll('[data-latex]')) {
      renderMath(node, node.getAttribute('data-latex'), { displayMode: node.getAttribute('data-display') === 'true' });
    }
  }

  function text(value) { return '\\text{' + String(value).replace(/[\\{}$%&#_^~]/g, c => ({'\\':'\\textbackslash{}','~':'\\textasciitilde{}','^':'\\textasciicircum{}'}[c] || '\\'+c)) + '}'; }
  // Convert only trusted engine display tokens, never arbitrary HTML or commands.
  function token(value) {
    let s = String(value);
    if (s.length > 2000 || /[\\{}<>]/.test(s) || /[\u3040-\u30ff\u3400-\u9fff]/.test(s) || s==='—') return text(s);
    s = s.replace(/[−–]/g,'-').replace(/≒|≈/g,'\\approx ').replace(/≦|≤/g,'\\le ').replace(/≧|≥/g,'\\ge ').replace(/≠/g,'\\ne ');
    s = s.replace(/([0-9.]+)\s*×\s*10\^([+-]?\d+)/g,'$1\\times10^{$2}');
    s = s.replace(/([0-9.]+)[eE]([+-]?\d+)/g,'$1\\times10^{$2}');
    s = s.replace(/√\(([^()]*)\)/g,'\\sqrt{$1}').replace(/√([0-9]+)/g,'\\sqrt{$1}');
    s = s.replace(/([^\s/(),]+)\s*\/\s*([^\s/(),]+)/g,'\\frac{$1}{$2}');
    const symbols = {'π':'\\pi ','θ':'\\theta ','λ':'\\lambda ','ω':'\\omega ','φ':'\\varphi ','Δ':'\\Delta ','∞':'\\infty ','ℓ':'\\ell ','Σ':'\\sum ','∑':'\\sum ','·':'\\cdot ','×':'\\times ','²':'^{2}','³':'^{3}','′':"'",'₀':'_{0}','₁':'_{1}','₂':'_{2}','ₖ':'_{k}','ₙ':'_{n}','ᵢ':'_{i}'};
    s = s.replace(/[πθλωφΔ∞ℓΣ∑·×²³′₀₁₂ₖₙᵢ]/g,c=>symbols[c]).replace(/\b(sin|cos|tan|log|ln|exp)\b/g,'\\$1 ');
    return s;
  }
  function number(value) { return token(root.NumberDisplay.formatNonzero(value)); }
  function ast(n, constants = {}) {
    if(constants.source!==undefined){
      const source=String(constants.source).replace(/π/g,'pi');
      const literals=source.match(/(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?|\b(?:pi|e)\b/g)||[];
      constants={literals,cursor:{index:0}};
    }
    if(n.op==='num'&&constants.literals){const literal=constants.literals[constants.cursor.index++];return literal==='pi'?'\\pi':literal==='e'?'e':token(literal??String(n.v));}
    if (n.op === 'num') return n.v===Math.PI&&constants.pi?'\\pi':n.v===Math.E&&constants.e?'e':token(String(n.v));
    if (n.op === 'var') return /^[a-z]$/.test(n.name) ? n.name : text(n.name);
    if (n.op === 'neg' || n.op === 'pos') return (n.op === 'neg' ? '-' : '+') + '\\left(' + ast(n.a,constants) + '\\right)';
    if (n.op === 'fn') {
      const a=ast(n.a,constants);
      if(n.name==='sqrt')return '\\sqrt{'+a+'}';
      if(n.name==='abs')return '\\left|'+a+'\\right|';
      if(n.name==='floor'||n.name==='ceil')return '\\left\\l'+(n.name==='floor'?'floor':'ceil')+' '+a+'\\right\\r'+(n.name==='floor'?'floor':'ceil');
      return '\\'+(n.name==='log'?'ln':n.name)+'\\left('+a+'\\right)';
    }
    const a=ast(n.a,constants),b=ast(n.b,constants);
    if(n.op==='/')return '\\frac{'+a+'}{'+b+'}';
    if(n.op==='^')return '\\left('+a+'\\right)^{'+b+'}';
    return '\\left('+a+'\\right)'+(n.op==='*'?'\\cdot ':n.op)+'\\left('+b+'\\right)';
  }
  const api={renderMath,renderMathInContainer,number,token,text,ast};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  else { root.MathDisplay=api; document.addEventListener('DOMContentLoaded',()=>renderMathInContainer(document.body)); }
})(typeof window!=='undefined'?window:globalThis);
