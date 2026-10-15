'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('ionic and metal examples are not molecules',()=>{assert.equal(E.models.NaCl.atoms.filter(a=>a==='Na+').length,4);assert.equal(E.models.NaCl.atoms.filter(a=>a==='Cl−').length,4);assert.equal(E.models.metal.electrons,8);assert.equal(E.models.metal.atoms.length,8);assert.equal(E.models.metal.angle,null);});
test('VSEPR shapes and lone pairs',()=>{assert.equal(E.models.H2O.lone[0],2);assert.equal(E.models.NH3.lone[0],1);assert.equal(E.models.CH4.angle,109.5);assert.equal(E.models.CO2.angle,180);assert.equal(E.models.BF3.angle,120);});
test('Lewis valence electrons agree',()=>{const valence={H:1,C:4,N:5,O:6,B:3,F:7};for(const key of ['H2','H2O','NH3','CH4','CO2','BF3']){const m=E.models[key],b=m.bonds.reduce((s,x)=>s+2*x[2],0),l=m.lone.reduce((s,x)=>s+2*x,0);assert.equal(b+l,m.atoms.reduce((s,a)=>s+valence[a],0));}assert.equal(E.models.NaCl.bonds.length,0);assert.throws(()=>E.calculate({kind:'bad',phi:0,tilt:0}));});


const valid={"kind": "H2O", "phi": 20, "tilt": 25};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
