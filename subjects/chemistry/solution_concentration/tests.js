'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

const s={mode:'nV',unit:'L',n:1,V:2,c:1,Vfinal:5,c1:1,V1:.1,c2:0,V2:.4};
test('concentration dilution and mixing conservation',()=>{near(E.calculate(s).c,.5);near(E.calculate({...s,n:.1,V:100,unit:'mL',Vfinal:.5}).diluted,.2);near(E.calculate(s).mixed,.2);near(E.calculate({...s,mode:'nc',n:1,c:.5}).V,2);});
test('positive volume and missing density',()=>{assert.throws(()=>E.calculate({...s,V:0}));assert.throws(()=>E.calculate({...s,c1:-1}));assert.throws(()=>E.calculate({...s,n:NaN}));});


const valid={"mode": "nV", "unit": "L", "n": 1, "V": 2, "c": 0.5, "Vfinal": 5, "c1": 1, "V1": 0.1, "c2": 0, "V2": 0.4};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
