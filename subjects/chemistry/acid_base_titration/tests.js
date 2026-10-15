'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('25ml equivalence and initial pH',()=>{const g=E.at(.1,25,.1,25);near(g.equivalence,25);near(g.pH,7);near(E.at(.1,25,.1,0).pH,1,1e-8);});
test('smooth near equivalence, total volume and monotonicity',()=>{let last=-1;for(let V=0;V<=50;V+=.1){const g=E.at(.1,25,.1,V);assert.ok(g.pH>=last);last=g.pH;near(g.total,(25+V)/1000);}assert.ok(E.at(.1,25,.1,25-1e-8).pH<7);assert.ok(E.at(.1,25,.1,25+1e-8).pH>7);assert.throws(()=>E.at(.1,0,.1,0));assert.throws(()=>E.at(.1,25,NaN,0));});


const valid={"ca": 0.1, "Va": 25, "cb": 0.1, "Vb": 0};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
