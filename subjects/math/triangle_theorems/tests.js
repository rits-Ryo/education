'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js'),N=require('../../../number-format.js');
let count=0;function test(name,fn){try{fn();count++;console.log('PASS',name);}catch(e){console.error('FAIL',name);throw e;}}
function near(a,b,t=1e-10){assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} vs ${b}`);}

test('3-4-5 triangle laws and circumcircle',()=>{const g=E.geometry([0,0],[4,0],[0,3]);near(g.a,5);near(g.area,6);near(g.angles[0],Math.PI/2);near(g.R,2.5);near(g.a/Math.sin(g.angles[0]),2*g.R);near(g.a*g.a,g.b*g.b+g.c*g.c-2*g.b*g.c*Math.cos(g.angles[0]));});
test('equilateral triangle',()=>{const g=E.geometry([0,0],[2,0],[1,Math.sqrt(3)]);g.angles.forEach(a=>near(a,Math.PI/3));near(g.R,2/Math.sqrt(3));});
test('obtuse and reversed orientation',()=>{const A=[0,0],B=[3,0],C=[-1,1],g=E.geometry(A,B,C),r=E.geometry(A,C,B);assert.ok(g.angles[0]>Math.PI/2);near(g.area,r.area);near(g.R,r.R);near(g.angles.reduce((s,v)=>s+v),Math.PI);});
test('degenerate and almost collinear are explicit',()=>{for(const c of [[2,0],[2,1e-12],[0,0]])assert.equal(E.geometry([0,0],[1,0],c).unstable,true);assert.throws(()=>E.geometry([NaN,0],[1,0],[0,1]));});

test('machine range cannot masquerade as a mathematical zero',()=>{assert.equal(E.geometry([0,0],[1e-200,0],[0,1e-200]).unstable,true);});
test('display precision stays separate from calculation',()=>{const v=E.geometry([0,0],[1,0],[0,1]).a;assert.notEqual(v,Number(N.formatNumber(v)));near(Number(N.formatNumber(1/3)),.333);assert.notEqual(1/3,.333);assert.equal(N.formatNonzero(-1e-8),'-1 × 10^-8');});
console.log(`${count} groups passed; 0 failed`);
