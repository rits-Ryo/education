'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

const s={pKa:4.76,HA:.1,A:.1,add:0,V:1,kind:'acid'};
test('HH ratios and atom amount conservation',()=>{near(E.calculate(s).pH,s.pKa);near(E.calculate({...s,A:1}).pH,s.pKa+1);const g=E.calculate({...s,add:.01});near(g.HA,.11);near(g.A,.09);near(g.total,.2);});
test('capacity exhaustion and dilute model limits',()=>{assert.equal(E.calculate({...s,add:.2}).pH,null);near(E.calculate({...s,add:.2}).excess,.1);assert.equal(E.calculate({...s,HA:0}).valid,false);assert.equal(E.calculate({...s,HA:1e-8,A:1e-8}).valid,false);assert.throws(()=>E.calculate({...s,A:-1}));assert.throws(()=>E.calculate({...s,pKa:Infinity}));});


const valid={"pKa": 4.76, "HA": 0.1, "A": 0.1, "add": 0, "V": 1, "kind": "acid"};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
