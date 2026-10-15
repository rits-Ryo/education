'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('unit circle horizontal and vertical lines',()=>{assert.equal(E.relation(0,0,1,0,1,0).points.length,2);assert.equal(E.relation(0,0,1,0,1,-1).kind,'tangent');assert.equal(E.relation(0,0,1,0,1,-2).kind,'none');assert.deepEqual(E.relation(0,0,1,1,0,-1).points,[[1,0]]);});
test('translated circle and line foot',()=>{const g=E.relation(2,3,2,0,1,-3);near(g.d,0);g.points.forEach(p=>near(Math.hypot(p[0]-2,p[1]-3),2));});
test('near tangent not classified by display rounding',()=>{assert.equal(E.relation(0,0,1,0,1,-1.00000001).kind,'none');assert.equal(E.relation(0,0,1,0,1,-.99999999).kind,'two');});
test('two-point line and invalid definitions',()=>{assert.deepEqual(E.through([0,0],[1,0]),{A:0,B:1,C:-0});assert.throws(()=>E.through([0,0],[0,0]));assert.throws(()=>E.relation(0,0,0,0,1,0));assert.throws(()=>E.relation(0,0,1,0,0,1));});

test('machine range cannot masquerade as a mathematical zero',()=>{assert.throws(()=>E.relation(0,0,1,1e-320,0,1));});
test('display precision stays separate from calculation',()=>{assert.equal(E.relation(0,0,1,0,1,-1.00000001).kind,'none');assert.equal(N.formatNumber(1.00000001),'1');near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
