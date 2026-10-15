'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('arithmetic and constant',()=>{const s=E.parameters('arithmetic',2,3,1,1,0,8);assert.deepEqual(E.terms(s).values,[2,5,8,11,14,17,20,23]);near(E.general(s,8),23);s.d=0;assert.equal(E.behavior(s),'constant');});
test('geometric 0 1 -1 and n=1',()=>{for(const r of [0,1,-1,.5,2]){const s=E.parameters('geometric',3,0,r,1,0,20);E.terms(s).values.forEach((v,i)=>near(v,E.general(s,i+1)));}assert.equal(E.general({kind:'geometric',a:3,r:0},1),3);});
test('linear p=0 1 -1 and q=0',()=>{for(const p of [0,1,-1,.5,1.0000000001])for(const q of [0,2]){const s=E.parameters('linear',3,0,1,p,q,30);E.terms(s).values.forEach((v,i)=>near(v,E.general(s,i+1),1e-8));}});
test('stability conditions and overflow',()=>{const s=E.parameters('linear',2,0,1,-1,0,10);assert.equal(E.behavior(s),'alternating');s.p=.5;assert.equal(E.behavior(s),'convergent');s.p=1e100;s.N=10;assert.equal(E.terms(s).overflowAt,5);});
test('invalid term counts',()=>{assert.throws(()=>E.parameters('linear',1,0,1,1,0,0));assert.throws(()=>E.general({a:1},1.5));});

test('subnormal numerical limits are recognized',()=>{const s=E.parameters('geometric',1,0,1e-200,1,0,5),g=E.terms(s);assert.equal(g.overflowAt,3);assert.equal(g.values.length,2);assert.notEqual(g.values.at(-1),0);});
test('display precision stays separate from calculation',()=>{const s=E.parameters('geometric',1,0,1/3,1,0,3);near(E.terms(s).values[2],1/9);assert.notEqual(E.terms(s).values[2],.111);near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
