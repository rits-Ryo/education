'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('Faraday electron copper and gas amounts',()=>{const g=E.calculate({I:1,t:96485,kind:'copper'});near(g.ne,1);near(g.nCu,.5);near(g.mass,31.775);near(g.nH2/g.nO2,2);});
test('zero current and negative or invalid inputs',()=>{assert.equal(E.calculate({I:0,t:100,kind:'water'}).Q,0);assert.throws(()=>E.calculate({I:-1,t:1,kind:'copper'}));assert.throws(()=>E.calculate({I:1,t:NaN,kind:'copper'}));});


const valid={"kind": "copper", "I": 1, "t": 96485};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('machine limits cannot masquerade as exact chemical zero',()=>{assert.throws(()=>E.calculate({...valid,I:1e-200,t:1e-200}));});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
