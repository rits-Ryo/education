'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('element charge and electron conservation in all examples',()=>{for(const kind of Object.keys(E.reactions)){const g=E.calculate({kind,multiple:1});assert.deepEqual(g.leftTotals,g.rightTotals);}assert.equal(E.calculate({kind:'zinc',multiple:1}).electrons,2);assert.equal(E.calculate({kind:'iron',multiple:1}).electrons,1);assert.equal(E.calculate({kind:'zinc',multiple:3}).electrons,6);});
test('scaled coefficients also scale atom inventory',()=>{assert.deepEqual(E.calculate({kind:'zinc',multiple:3}).leftTotals.atoms,{Zn:3,Cu:3});});
test('invalid multipliers and reactions',()=>{assert.throws(()=>E.calculate({kind:'zinc',multiple:NaN}));assert.throws(()=>E.calculate({kind:'bad',multiple:1}));});


const valid={"kind": "zinc", "multiple": 1};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
