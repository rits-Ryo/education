(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const Kw=1e-14;
function at(ca,Va,cb,Vb){positive(ca,Va,cb);nonnegative(Vb);const acid=ca*Va/1000,base=cb*Vb/1000,total=(Va+Vb)/1000,net=(acid-base)/total,root=Math.hypot(net,2e-7),H=net>=0?(net+root)/2:2*Kw/(root-net);return {pH:-Math.log10(H),H,net,acid,base,total,equivalence:ca*Va/cb,excess:acid-base};}
function calculate(s){if(s.ca>.2||s.cb>.2)throw new RangeError('モデル濃度上限0.2 mol/L');return at(s.ca,s.Va,s.cb,s.Vb);}
const api={Kw,at,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
