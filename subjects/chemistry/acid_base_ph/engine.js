(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const Kw=1e-14;
function hydrogen(net){finite(net);const root=Math.hypot(net,2e-7);return net>=0?(net+root)/2:2*Kw/(root-net);}
function calculate(s){nonnegative(s.c);positive(s.dilution);if(s.c>.1||!['acid','base','water'].includes(s.kind))throw new RangeError('25℃希薄モデル：濃度0〜0.1 mol/L');const effective=s.kind==='water'?0:s.c/s.dilution,H=hydrogen((s.kind==='base'?-1:1)*effective),OH=Kw/H;return {H,OH,pH:-Math.log10(H),effective};}
const api={Kw,hydrogen,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
