'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('water limiting reagent and excess',()=>{const s={kind:'water',mode:'mol',value:1,M:18.015,n1:2,n2:1};assert.equal(E.calculate(s).product,2);const g=E.calculate({...s,n1:1});assert.equal(g.product,1);near(g.left[1],.5);assert.equal(E.calculate({...s,n1:0}).product,0);});
test('molar mass and limiting reaction conserve mass',()=>{for(const kind of ['water','ammonia']){const s={kind,mode:'mol',value:1,M:18.015,n1:1.234567,n2:2.345678},g=E.calculate(s),M=g.reaction.M;near(s.n1*M[0]+s.n2*M[1],g.left[0]*M[0]+g.left[1]*M[1]+g.product*M[2],1e-12);assert.notEqual(g.extent,Number(N.formatNumber(g.extent)));}});
test('NA definition and three conversion modes',()=>{assert.equal(E.NA,6.02214076e23);const s={kind:'ammonia',mode:'mass',value:18.015,M:18.015,n1:1,n2:3},g=E.calculate(s);near(g.n,1);near(g.N,E.NA);near(g.product,2);assert.throws(()=>E.calculate({...s,n1:-1}));assert.throws(()=>E.calculate({...s,value:Infinity}));});


const valid={"kind": "water", "mode": "mol", "value": 1, "M": 18.015, "n1": 2, "n2": 1};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('machine limits cannot masquerade as exact chemical zero',()=>{assert.throws(()=>E.calculate({...valid,mode:'particles',value:1.5}));assert.throws(()=>E.calculate({...valid,mode:'mass',value:5e-324,M:200}));});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
