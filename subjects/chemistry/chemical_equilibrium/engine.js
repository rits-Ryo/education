(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

function calculate(s){nonnegative(s.A0,s.B0,s.t);positive(s.K,s.rate);const total=s.A0+s.B0,Aeq=total/(1+s.K),Beq=total-Aeq,kf=s.rate*s.K,kr=s.rate,A=Aeq+(s.A0-Aeq)*Math.exp(-(kf+kr)*s.t),B=total-A;return {A,B,Aeq,Beq,total,Q:A===0?(B===0?null:'unbounded'):B/A,forward:kf*A,reverse:kr*B,direction:s.B0===s.K*s.A0?'平衡':s.B0<s.K*s.A0?'右へ':'左へ'};}
const api={calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
