'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('exact theoretical probabilities and dice enumeration',()=>{near(E.probability('coin'),1/2);near(E.probability('die'),1/6);let hit=0;for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if(a+b===7)hit++;assert.equal(hit,6);near(E.probability('sum'),hit/36);});
test('certain endpoints and boundaries',()=>{const a=E.create('bernoulli',0,1),b=E.create('bernoulli',1,1);E.run(a,100);E.run(b,100);assert.equal(a.hits,0);assert.equal(b.hits,100);assert.equal(E.success('die',0,()=>0),false);assert.equal(E.success('die',0,()=>1-Number.EPSILON),true);assert.throws(()=>E.success('coin',0,()=>1));});
test('seed reproduces real outcomes across batches',()=>{const a=E.create('sum',0,0),b=E.create('sum',0,0);E.run(a,1000);E.run(b,17);E.run(b,983);assert.deepEqual(a.history,b.history);});
test('large run and sample retains actual endpoints',()=>{const s=E.create('coin',0,42);E.run(s,100000);assert.equal(s.history.length,100000);const points=E.sample(s.history);assert.equal(points.length,1200);assert.deepEqual(points.at(-1),[s.n,s.hits/s.n]);assert.ok(s.hits>0&&s.hits<s.n);});
test('invalid probabilities, counts and seeds',()=>{assert.throws(()=>E.create('bernoulli',NaN,1));assert.throws(()=>E.create('coin',0,-1));assert.throws(()=>E.run(E.create('coin',0,1),0));});

test('display precision stays separate from calculation',()=>{const s=E.create('coin',0,42);E.run(s,3);near(s.history.at(-1),s.hits/3);assert.equal(s.history.length,3);near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
