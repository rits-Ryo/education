'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('Daniell voltage sign and two electron match',()=>{const g=E.calculate({metal:'Zn',anodeC:1,cathodeC:1,mode:'standard'});near(g.E0,1.10);assert.equal(g.anode,'Zn');assert.equal(g.cathode,'Cu');assert.equal(g.electrons,2);});
test('Nernst Q and positive concentrations',()=>{const s={metal:'Zn',anodeC:1,cathodeC:1,mode:'nernst'};near(E.calculate(s).E,1.1);assert.ok(E.calculate({...s,anodeC:10}).E<1.1);assert.throws(()=>E.calculate({...s,anodeC:0}));assert.throws(()=>E.calculate({...s,cathodeC:Infinity}));});


const valid={"metal": "Zn", "anodeC": 1, "cathodeC": 1, "mode": "standard"};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
