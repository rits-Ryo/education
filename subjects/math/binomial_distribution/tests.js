'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('one and two fair trials',()=>{assert.deepEqual(E.distribution(1,.5,0).values,[.5,.5]);assert.deepEqual(E.distribution(2,.5,1).values,[.25,.5,.25]);});
test('certain p endpoints',()=>{for(const p of [0,1]){const g=E.distribution(60,p,30);assert.equal(g.values[p?60:0],1);near(g.variance,0);near(g.values.reduce((a,b)=>a+b),1);}});
test('mass moments and cumulative monotonicity, tolerance 1e-12',()=>{for(const p of [.001,.2,.5,.999]){const g=E.distribution(60,p,30);near(g.values.reduce((a,b)=>a+b),1,1e-12);near(g.values.reduce((a,b,i)=>a+i*b,0),g.mean,1e-12);near(g.values.reduce((a,b,i)=>a+(i-g.mean)**2*b,0),g.variance,1e-12);let last=0;for(let k=0;k<=60;k++){const c=E.distribution(60,p,k).cumulative;assert.ok(c>=last&&c<=1+1e-12);last=c;}}});
test('invalid parameter boundaries',()=>{for(const args of [[0,.5,0],[61,.5,0],[2,NaN,0],[2,.5,3],[2,-.1,0]])assert.throws(()=>E.distribution(...args));});

test('subnormal numerical limits are recognized',()=>{const g=E.distribution(60,1e-100,60);assert.equal(g.selected,0);assert.ok(1e-100>0&&1e-100<1);});
test('display precision stays separate from calculation',()=>{const v=E.distribution(3,1/3,1).selected;assert.notEqual(v,Number(N.formatNumber(v)));near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
