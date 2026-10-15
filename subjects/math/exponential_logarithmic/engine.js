(function(root){
'use strict';

function base(a){if(!Number.isFinite(a)||a<=0||a===1)throw new RangeError('底はa>0かつa≠1です');return a;}
function exponential(a,x){base(a);if(!Number.isFinite(x))return null;const v=Math.exp(x*(Math.abs(a-1)<.5?Math.log1p(a-1):Math.log(a)));return Number.isFinite(v)&&v>0?v:null;}
function logarithm(a,x){base(a);if(!Number.isFinite(x)||x<=0)return null;const v=Math.log(x)/(Math.abs(a-1)<.5?Math.log1p(a-1):Math.log(a));return Number.isFinite(v)?v:null;}
function pair(a,x){base(a);const y=exponential(a,x);return {forward:y===null?null:[x,y],inverse:y===null?null:[y,x],sensitive:Math.abs(a-1)<.001};}
const api={base,exponential,logarithm,pair};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
