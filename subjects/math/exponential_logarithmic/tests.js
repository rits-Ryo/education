'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('inverse at increasing and decreasing bases',()=>{for(const a of [2,.5,1+1e-10])for(const x of [-3,0,2]){const y=E.exponential(a,x);near(E.logarithm(a,y),x,a===1+1e-10?1e-6:1e-12);}});
test('reflection coordinates and standard log values',()=>{const p=E.pair(2,3);near(p.forward[1],8);assert.deepEqual(p.inverse,[p.forward[1],3]);near(E.logarithm(2,1),0);near(E.logarithm(2,2),1);});
test('undefined domains and overflow',()=>{for(const a of [0,-1,1,NaN])assert.throws(()=>E.base(a));assert.equal(E.logarithm(2,0),null);assert.equal(E.logarithm(2,-1),null);assert.equal(E.exponential(10,1000),null);assert.ok(E.pair(1.000001,2).sensitive);});

test('display precision stays separate from calculation',()=>{const v=E.exponential(2,.5);assert.notEqual(v,Number(N.formatNumber(v)));near(E.exponential(1e-20,1),1e-20,1e-30);near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
