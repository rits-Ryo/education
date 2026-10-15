'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('two roots and open exterior',()=>{const s=E.solve(1,0,-1,'>');assert.deepEqual(s.roots,[-1,1]);assert.ok(E.contains(s.intervals,2));assert.ok(!E.contains(s.intervals,1));assert.ok(!E.contains(s.intervals,0));});
test('closed interior and negative leading coefficient',()=>{const s=E.solve(1,0,-1,'<=');assert.ok(E.contains(s.intervals,-1));assert.ok(E.contains(s.intervals,0));assert.ok(!E.contains(s.intervals,2));assert.deepEqual(E.solve(-1,0,1,'>=').intervals,s.intervals);});
test('no roots, all real and repeated root singleton',()=>{assert.equal(E.solve(1,0,1,'<').intervals.length,0);assert.equal(E.solve(1,0,1,'>=').intervals[0].lo,-Infinity);assert.deepEqual(E.solve(-1,2,-1,'>=').intervals,[{lo:1,hi:1,lc:true,hc:true}]);assert.equal(E.solve(1,-2,1,'>').intervals.length,2);});
test('stable root avoids cancellation; no rounded discriminant classification',()=>{const s=E.solve(1,1e8,1,'>');near(s.roots[1],-1e-8,1e-14);assert.equal(E.solve(1,0,-1e-12,'>').roots.length,2);});
test('invalid input rejected',()=>{for(const a of [0,NaN,Infinity])assert.throws(()=>E.solve(a,0,1,'>'));});

test('machine range cannot masquerade as a mathematical zero',()=>{assert.throws(()=>E.solve(1e-320,0,-1e-320,'>'));assert.throws(()=>E.solve(1e-320,10,1,'>'));});
test('display precision stays separate from calculation',()=>{const v=E.value(1,0,0,1.234567);assert.notEqual(v,Number(N.formatNumber(v)));near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
