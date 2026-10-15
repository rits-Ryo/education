'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('no perturbation and constant-volume inert addition do not move equilibrium',()=>{for(const s of [{V:1,T:298.15,kind:'A',add:0},{V:1,T:298.15,kind:'inert',add:2}])assert.ok(E.calculate(s).direction.startsWith('平衡'));});
test('mass action at equilibrium',()=>{for(const K of [.01,.2,3]){const g=E.equilibrium(2,K);near(g.B*g.B/g.A,K);near(2*g.A+g.B,2);}});
test('isothermal compression shifts left, K unchanged',()=>{const s={V:1,T:298.15,add:0,kind:'A'},a=E.calculate(s),b=E.calculate({...s,V:.5});near(a.K,b.K);assert.equal(b.direction,'左へ');near(2*b.equilibrium.A+b.equilibrium.B,b.inventory/.5);});
test('inert gas at fixed volume and temperature-only K change',()=>{const s={V:1,T:298.15,add:0,kind:'inert'};near(E.calculate(s).Q,E.calculate({...s,add:5}).Q);assert.ok(E.calculate({...s,T:350}).K>E.calculate(s).K);assert.throws(()=>E.calculate({...s,V:0}));assert.throws(()=>E.calculate({...s,add:NaN}));});


const valid={"V": 1, "T": 298.15, "add": 0, "kind": "A"};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
