'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('barrier matches Ea and catalyst preserves endpoints',()=>{near(E.energy(0,50),0);near(E.energy(.5,50),50);near(E.energy(.5,50,.6),30);near(E.energy(1,50),-20);near(E.energy(1,50,.6),-20);});
test('first order half life and zero rate constant',()=>{near(E.concentration(1,2,.1,Math.LN2/.1),1);for(const m of [0,1,2])near(E.concentration(m,2,0,10),2);assert.equal(E.concentration(0,1,1,2),0);});
test('Arrhenius temperature domain and reaction order',()=>{const s={order:1,c0:1,k:.1,t:10,Ea:50,T:298.15};near(E.calculate(s).ratio,1);assert.ok(E.calculate({...s,T:350}).ratio>1);assert.throws(()=>E.calculate({...s,T:0}));assert.throws(()=>E.calculate({...s,Ea:-1}));assert.throws(()=>E.calculate({...s,c0:Infinity}));});


const valid={"order": 1, "c0": 1, "k": 0.1, "t": 10, "Ea": 50, "T": 298.15};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
