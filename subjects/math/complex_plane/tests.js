'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('representative exact multiplications',()=>{assert.deepEqual(E.multiply([1,1],[1,1]),[0,2]);assert.deepEqual(E.multiply([0,1],[0,1]),[-1,0]);assert.deepEqual(E.multiply([2,3],[1,0]),[2,3]);assert.deepEqual(E.multiply([2,3],[0,1]),[-3,2]);assert.deepEqual(E.multiply([2,3],[-1,0]),[-2,-3]);});
test('zero has no argument',()=>{const g=E.analyze([0,0],[1,2]);near(g.lengths[2],0);assert.equal(g.args[0],null);assert.equal(g.args[2],null);});
test('norm product and arguments modulo 2pi',()=>{for(const z of [[1,2],[-2,1],[-2,-3]]){const g=E.analyze(z,[1,-1]);near(g.lengths[2],g.lengths[0]*g.lengths[1]);near(E.normalize(g.args[0]+g.args[1]-g.args[2]),0);}});
test('branch interval and invalid inputs',()=>{near(E.argument([-1,-0]),Math.PI);assert.throws(()=>E.analyze([NaN,0],[1,1]));});

test('machine range cannot masquerade as a mathematical zero',()=>{assert.throws(()=>E.analyze([1e-200,0],[1e-200,0]));});
test('display precision stays separate from calculation',()=>{const v=E.analyze([1,1],[1,0]).lengths[0];assert.notEqual(v,Number(N.formatNumber(v)));near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
