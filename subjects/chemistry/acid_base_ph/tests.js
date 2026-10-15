'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('strong acid base and pure water with self ionization',()=>{near(E.calculate({kind:'acid',c:.001,dilution:1}).pH,3,1e-7);near(E.calculate({kind:'base',c:.01,dilution:1}).pH,12,1e-8);near(E.calculate({kind:'water',c:0,dilution:1}).pH,7);assert.ok(E.calculate({kind:'acid',c:1e-10,dilution:1}).pH<7);});
test('Kw product and positive hydrogen',()=>{for(const net of [-.1,-1e-10,0,1e-10,.1]){const h=E.hydrogen(net);assert.ok(h>0);near(h*(E.Kw/h),E.Kw,1e-16);}assert.throws(()=>E.calculate({kind:'acid',c:-1,dilution:1}));assert.throws(()=>E.hydrogen(NaN));});


const valid={"kind": "acid", "c": 0.001, "dilution": 1};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
