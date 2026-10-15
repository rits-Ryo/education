'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

const s={n:1,V:22.414,P:101.325,temperature:273.15,unit:'K',law:'boyle'};
test('ideal molar volume and Celsius conversion',()=>{near(E.calculate(s).P,101325,2e-5);near(E.calculate({...s,temperature:0,unit:'C'}).T,273.15);});
test('fixed conditions and physical domains',()=>{const a=E.calculate(s),b=E.calculate({...s,V:11.207});near(b.P,2*a.P);const c=E.calculate({...s,law:'charles'}),d=E.calculate({...s,law:'charles',temperature:546.3});near(d.V,2*c.V);assert.equal(a.n,b.n);assert.throws(()=>E.calculate({...s,temperature:0}));assert.throws(()=>E.calculate({...s,V:0}));assert.throws(()=>E.calculate({...s,n:NaN}));});


const valid={"law": "boyle", "n": 1, "V": 22.414, "P": 101.325, "temperature": 273.15, "unit": "K"};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
