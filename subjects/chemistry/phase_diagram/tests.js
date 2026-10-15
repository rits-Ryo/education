'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('latent heat and ordered phases',()=>{assert.equal(E.heating(15).T,E.heating(25).T);assert.equal(E.heating(90).T,E.heating(170).T);assert.equal(E.heating(0).phase,'固体');assert.equal(E.heating(60).phase,'液体');assert.equal(E.heating(200).phase,'気体');});
test('coexistence not falsely one phase',()=>{assert.ok(E.phase(0,1).includes('3相'));assert.ok(E.phase(100,Math.E).includes('共存'));assert.ok(E.phase(1,2).includes('共存'));assert.throws(()=>E.phase(0,0));assert.throws(()=>E.heating(NaN));});


const valid={"Q": 60, "pointT": 30, "pointP": 2};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
