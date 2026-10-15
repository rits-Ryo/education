'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('continuous square and removable hole',()=>{assert.ok(E.limits('square',1).continuous);assert.deepEqual(E.limits('hole',1),{left:2,right:2,both:2,at:null,outOfRange:false,continuous:false});assert.equal(E.value('hole',1),null);near(E.value('hole',1+1e-12),2+1e-12);});
test('function value different from common limit',()=>{const g=E.limits('redefined',1);assert.equal(g.both,2);assert.equal(g.at,3);assert.equal(g.continuous,false);});
test('jump and signed divergence distinguished',()=>{const g=E.limits('jump',0);assert.equal(g.left,-1);assert.equal(g.right,1);assert.equal(g.both,null);assert.deepEqual([E.limits('reciprocal',0).left,E.limits('reciprocal',0).right],['-inf','+inf']);});
test('sinc stable near zero and radian limit',()=>{assert.equal(E.limits('sinc',0).both,1);assert.equal(E.value('sinc',0),null);near(E.value('sinc',1e-10),1);});
test('arbitrary a and h validity',()=>{assert.ok(E.limits('hole',2).continuous);assert.equal(E.approach('jump',0,.01).left[1],-1);assert.throws(()=>E.approach('square',1,0));assert.throws(()=>E.approach('square',1,1e-30));});

test('machine range cannot masquerade as a mathematical zero',()=>{assert.equal(E.value('reciprocal',1e-320),'overflow');assert.equal(E.limits('reciprocal',1e-320).outOfRange,true);});
test('display precision stays separate from calculation',()=>{const g=E.approach('hole',1,1e-6);assert.notEqual(g.left[1],2);assert.equal(N.formatNumber(g.left[1]),'2');assert.equal(g.limits.at,null);near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
