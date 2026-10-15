(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const symbols=['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca'];
const isotopes=[[1,2,3],[3,4],[6,7],[9],[10,11],[12,13,14],[14,15],[16,17,18],[19],[20,21,22],[23],[24,25,26],[27],[28,29,30],[31],[32,33,34,36],[35,37],[36,38,40],[39,40,41],[40,42,43,44,46,48]];
const ionCharges=[[0,1,-1],[0],[0,1],[0,2],[0],[0],[0,-3],[0,-2],[0,-1],[0],[0,1],[0,2],[0,3],[0],[0,-3],[0,-2],[0,-1],[0],[0,1],[0,2]];
function calculate(s){const {Z,A,q}=s;finite(Z,A,q);if(!Number.isInteger(Z)||Z<1||Z>20||!Number.isInteger(A)||A<Z||!Number.isInteger(q)||Z-q<0)throw new RangeError('Z=1〜20、A≥Z、電子数≥0の整数が必要です');if(!isotopes[Z-1].includes(A)||!ionCharges[Z-1].includes(q))throw new RangeError('収録した代表同位体と基本的なイオンのみ表示します');const e=Z-q;let left=e;const shells=[2,8,8,2].map(cap=>{const n=Math.min(cap,left);left-=n;return n;}).filter(v=>v>0);return {symbol:symbols[Z-1],p:Z,n:A-Z,e,shells,q,A};}
const api={symbols,isotopes,ionCharges,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
