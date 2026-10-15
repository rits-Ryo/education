'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('equilibrium partition and conserved total',()=>{const s={A0:2,B0:0,t:100,K:1,rate:.2},g=E.calculate(s);near(g.Aeq,1);near(g.Beq,1);const h=E.calculate({...s,K:3});near(h.Aeq,.5);near(h.Beq,1.5);near(h.Q,3);near(h.A+h.B,2);assert.ok(h.forward>0&&h.reverse>0);near(h.forward,h.reverse);});
test('empty pure product and invalid domains',()=>{const s={A0:0,B0:2,t:0,K:1,rate:.2};assert.equal(E.calculate(s).Q,'unbounded');assert.equal(E.calculate({...s,B0:0}).Q,null);assert.throws(()=>E.calculate({...s,K:0}));assert.throws(()=>E.calculate({...s,t:NaN}));});


const valid={"A0": 2, "B0": 0, "K": 3, "rate": 0.2, "t": 5};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
