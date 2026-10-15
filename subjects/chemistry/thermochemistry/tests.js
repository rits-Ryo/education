'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('sign reverse scale and Hess consistency',()=>{const s={kind:'exothermic',direction:1,multiple:1},g=E.calculate(s);assert.ok(g.delta<0);near(g.delta,g.steps[0]+g.steps[1]);assert.equal(E.calculate({...s,direction:-1}).delta,-g.delta);near(E.calculate({...s,multiple:2}).delta,2*g.delta);assert.ok(E.calculate({...s,kind:'endothermic'}).delta>0);});
test('invalid path and finite multiplier',()=>{assert.throws(()=>E.calculate({kind:'exothermic',direction:1,multiple:NaN}));assert.throws(()=>E.calculate({kind:'bad',direction:1,multiple:1}));});


const valid={"kind": "exothermic", "direction": 1, "multiple": 1};
test('finite input domains and display/calculation separation',()=>{E.calculate(valid);for(const [key,v] of Object.entries(valid)){if(typeof v==='number'&&!['phi','tilt'].includes(key)){for(const bad of [NaN,Infinity])assert.throws(()=>E.calculate({...valid,[key]:bad}),key);}}assert.equal(N.formatNumber(1.234567),'1.235');assert.equal(N.formatNonzero(1e-10),'1 × 10^-10');});
test('actual dynamic controller formulas parse with pinned KaTeX',()=>{const parsed=require('../shared/tests.js')(__dirname,E);assert.ok(parsed>1);});
console.log(`${count} chemistry groups passed; 0 failed`);
