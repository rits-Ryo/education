'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('shared atom counts coordinate numbers and radius relations',()=>{for(const [kind,N,coord,factor] of [['SC',1,6,2],['BCC',2,8,4/Math.sqrt(3)],['FCC',4,12,4/Math.sqrt(2)]]){const g=E.calculate({kind,r:.1});assert.equal(g.N,N);assert.equal(g.coord,coord);near(g.a,.1*factor);assert.ok(g.packing>0&&g.packing<1);assert.equal(g.cornerContribution+g.otherContribution,N);}});
test('packing fractions and camera-independent geometry',()=>{near(E.calculate({kind:'SC',r:1}).packing,Math.PI/6);near(E.calculate({kind:'FCC',r:1}).packing,Math.PI/(3*Math.sqrt(2)));assert.deepEqual(E.calculate({kind:'BCC',r:1,phi:0}),E.calculate({kind:'BCC',r:1,phi:100}));assert.throws(()=>E.calculate({kind:'SC',r:0}));assert.throws(()=>E.calculate({kind:'SC',r:NaN}));});


const valid={"kind": "FCC", "r": 0.1, "phi": 35, "tilt": 25};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
