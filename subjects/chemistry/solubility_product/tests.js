'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('pure solubility common ion and saturation',()=>{const s={A:.1,B:.1,Ksp:.01,common:0};near(E.calculate(s).solubility,.1);assert.ok(E.calculate({...s,common:.2}).withCommon<.1);assert.equal(E.calculate({A:1,B:1,Ksp:1,common:0}).condition,'飽和');assert.equal(E.calculate({...s,A:0}).condition,'未飽和');});
test('precipitation conserves ions with mass balance',()=>{const g=E.calculate({A:2,B:1,Ksp:.1,common:0});near(g.equilibrium[0]*g.equilibrium[1],.1);near(2-g.equilibrium[0],g.precipitate);near(1-g.equilibrium[1],g.precipitate);assert.throws(()=>E.calculate({A:1,B:1,Ksp:0,common:0}));assert.throws(()=>E.calculate({A:NaN,B:1,Ksp:1,common:0}));});


const valid={"A": 1e-05, "B": 1e-05, "Ksp": 1.8e-10, "common": 0};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('machine limits cannot masquerade as exact chemical zero',()=>{assert.throws(()=>E.calculate({...valid,A:1e-200,B:1e-200}));});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
