'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('carbon sodium chlorine particle counts',()=>{const c=E.calculate({Z:6,A:12,q:0});assert.deepEqual([c.p,c.n,c.e],[6,6,6]);assert.equal(E.calculate({Z:11,A:23,q:1}).e,10);assert.equal(E.calculate({Z:17,A:35,q:-1}).e,18);});
test('shell sums and charge conservation',()=>{for(let Z=1;Z<=20;Z++)for(const q of E.ionCharges[Z-1]){const g=E.calculate({Z,A:E.isotopes[Z-1][0],q});assert.equal(g.shells.reduce((a,b)=>a+b,0),g.e);assert.equal(g.p-g.e,q);}});
test('isotope and charge rejection',()=>{for(const s of [{Z:6,A:5,q:0},{Z:1,A:1,q:2},{Z:0,A:1,q:0},{Z:NaN,A:1,q:0}])assert.throws(()=>E.calculate(s));});


const valid={"Z": 6, "A": 12, "q": 0};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
