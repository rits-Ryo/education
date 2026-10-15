(function(root){
'use strict';

const keys=['square','hole','redefined','jump','reciprocal','sinc'];
function value(kind,x){if(!keys.includes(kind)||!Number.isFinite(x))throw new RangeError('有効な関数と有限のxが必要です');if(kind==='square')return x*x;if(kind==='hole'||kind==='redefined')return x===1?(kind==='redefined'?3:null):x+1;if(kind==='jump')return x===0?null:Math.sign(x);if(kind==='reciprocal')return x===0?null:Number.isFinite(1/x)?1/x:'overflow';if(x===0)return null;return Math.abs(x)<1e-4?1-x*x/6+x**4/120:Math.sin(x)/x;}
function limits(kind,a){if(!keys.includes(kind)||!Number.isFinite(a))throw new RangeError('有限の接近点が必要です');const exceptional=(kind==='hole'||kind==='redefined')?1:0;let left=value(kind,a),right=left;
 if(a===exceptional&&kind!=='square'){if(kind==='hole'||kind==='redefined'){left=right=2;}else if(kind==='jump'){left=-1;right=1;}else if(kind==='reciprocal'){left='-inf';right='+inf';}else if(kind==='sinc'){left=right=1;}}
 const finite=typeof left==='number'&&Number.isFinite(left)&&left===right,at=value(kind,a);return {left,right,both:finite?left:null,at,outOfRange:at==='overflow',continuous:finite&&at!==null&&at===left};}
function approach(kind,a,h){if(!Number.isFinite(h)||h<=0)throw new RangeError('h>0が必要です');if(a-h===a||a+h===a)throw new RangeError('hが小さすぎて接近点と区別できません');return {left:[a-h,value(kind,a-h)],right:[a+h,value(kind,a+h)],limits:limits(kind,a)};}
const api={keys,value,limits,approach};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
