'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('positions and transition classification',()=>{for(const Z of [1,10,11,17,18,19,20])assert.equal(E.element(Z).Z,Z);assert.equal(E.element(17).group,17);assert.equal(E.element(19).period,4);assert.equal(E.element(26).classification,'遷移元素');assert.equal(E.element(36).group,18);});
test('missing Pauling data and exceptional configurations',()=>{for(const Z of [2,10,18])assert.equal(E.element(Z).en,null);assert.ok(E.element(24).config.includes('3d^{5}4s^{1}'));assert.ok(E.element(29).config.includes('3d^{10}4s^{1}'));assert.throws(()=>E.element(NaN));assert.throws(()=>E.element(37));});


const valid={"Z": 11, "period": 3};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
