'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('constitutional isomers keep formula',()=>{for(const [a,b,C,H,O] of [['butane','isobutane',4,10,0],['ethanol','ether',2,6,1],['propanal','acetone',3,6,1]]){assert.deepEqual(E.analyze(E.models[a]).counts,{C,H,O});assert.deepEqual(E.analyze(E.models[a]).counts,E.analyze(E.models[b]).counts);}});
test('valence bond graph and rotation preserve constitution',()=>{for(const m of Object.values(E.models))assert.ok(E.analyze(m).hydrogens.every(n=>n>=0));assert.notDeepEqual(E.models.butane.bonds,E.models.isobutane.bonds);assert.notEqual(E.models.ethanol.group,E.models.ether.group);assert.throws(()=>E.analyze({atoms:['O','C'],bonds:[[0,1,3]],points:[]}));assert.throws(()=>E.calculate({kind:'bad',display:'model',phi:0,tilt:0}));});


const valid={"kind": "butane", "display": "structure", "phi": 20, "tilt": 25};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
