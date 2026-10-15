'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),F=require('../../../number-format.js');
let count=0;function test(name,fn){fn();console.log('PASS',name);count++;}function near(a,b,e=1e-11){assert.ok(Math.abs(a-b)<=e*Math.max(1,Math.abs(b)),`${a} != ${b}`);}
const s=E.preset('default');
test('initial positions, velocities and turning time',()=>{for(const [t,x,v] of [[0,0,2],[2,2,0],[4,0,-2]])assert.deepEqual(E.at(s,t),{t,x,v,a:-1});assert.equal(E.turning(s),2);});
test('uniform, rest, positive and negative acceleration',()=>{assert.equal(E.at(E.preset('uniform'),6).x,12);assert.equal(E.at(E.preset('rest'),6).x,0);assert.equal(E.turning(E.preset('rest')),null);near(E.at({...s,a:1},3).v,5);assert.ok(E.at(E.preset('fall'),1).v<0);assert.equal(E.preset('throw').vertical,true);});
test('signed trapezoid area, velocity change and split distance',()=>{for(let i=0;i<50;i++){const t1=i/20,t2=t1+2;const r=E.interval(s,t1,t2);near(r.displacement,E.at(s,t2).x-E.at(s,t1).x);near(r.velocityChange,E.at(s,t2).v-E.at(s,t1).v);}const r=E.interval(s,0,4);assert.equal(r.displacement,0);assert.equal(r.distance,4);assert.equal(r.regions.length,2);assert.equal(E.interval(s,2,2).distance,0);});
test('short intervals retain precision without subtracting positions',()=>{const r=E.interval({...s,x0:100},1,1+1e-10);near(r.displacement,1e-10,1e-15);assert.ok(r.displacement>0);});
test('time boundaries and invalid inputs are rejected',()=>{for(const t of [-1,7,NaN])assert.throws(()=>E.at(s,t));for(const T of [0,-1,Infinity,21])assert.throws(()=>E.validate({...s,T}));assert.throws(()=>E.interval(s,4,2));assert.equal(E.at({...s,T:3},3).t,3);});
test('bounds include the turning position and playback stops at T',()=>{const b=E.extent(s);assert.ok(b.lo<E.at(s,6).x&&b.hi>2);assert.equal(E.advance(5.9,1,2,6),6);assert.equal(E.advance(0,.5,2,6),1);});
test('format precision is independent of engine precision',()=>{const r=E.at({...s,v0:1.23456,a:0},1);assert.equal(r.x,1.23456);assert.equal(F.formatNonzero(r.x),'1.235');});
console.log(`${count} test groups passed; 0 failed`);

require('./ui-tests.js');
