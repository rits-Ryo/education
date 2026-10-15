'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('dot lengths and exact orthogonality',()=>{assert.equal(E.analyze([1,0,0],[0,1,0]).dot,0);assert.ok(E.analyze([1,0,0],[0,1,0]).orthogonal);assert.equal(E.analyze([1,2,3],[4,5,6]).dot,32);near(E.analyze([1,2,2],[1,0,0]).lengths[0],3);});
test('view rotation does not change physical quantities',()=>{const a=[1,2,3],b=[-2,1,1],before=E.analyze(a,b);for(let t=-4;t<4;t+=.2){assert.ok(E.project(a,t,.5).every(Number.isFinite));assert.deepEqual(E.analyze(a,b),before);}});
test('zero undefined angle and tiny nonzero dot',()=>{assert.equal(E.analyze([0,0,0],[1,2,3]).angle,null);assert.ok(!E.analyze([0,0,0],[1,2,3]).orthogonal);assert.notEqual(E.analyze([1,0,0],[1e-8,1,0]).dot,0);});

test('machine range cannot masquerade as a mathematical zero',()=>{const g=E.analyze([1e-200,0,0],[1e-200,0,0]);assert.equal(g.dot,null);assert.ok(g.outOfRange);near(g.angle,0);assert.equal(g.orthogonal,false);});
test('display precision stays separate from calculation',()=>{assert.equal(E.analyze([1,0,0],[1e-8,1,0]).orthogonal,false);assert.equal(N.formatNumber(1e-8),'0');near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
