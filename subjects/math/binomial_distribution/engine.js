(function(root){
'use strict';

function distribution(n,p,k){if(!Number.isInteger(n)||n<1||n>60||!Number.isFinite(p)||p<0||p>1||!Number.isInteger(k)||k<0||k>n)throw new RangeError('nは1〜60、pは0〜1、kは0〜nです');
 // Repeated convolution avoids huge combinations and endpoint 0^0.
 let values=[1];for(let i=0;i<n;i++){const next=new Array(i+2).fill(0);for(let j=0;j<values.length;j++){next[j]+=values[j]*(1-p);next[j+1]+=values[j]*p;}values=next;}
 const cumulative=values.slice(0,k+1).reduce((a,b)=>a+b,0),mean=n*p,variance=n*p*(1-p);return {values,selected:values[k],cumulative,mean,variance,sd:Math.sqrt(variance)};
}
const api={distribution};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
