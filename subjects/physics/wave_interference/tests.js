'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js');let count=0;
function test(n,f){f();console.log('PASS',n);count++;}function near(a,b,e=1e-10){assert.ok(Math.abs(a-b)<e*Math.max(1,Math.abs(b)),`${a} != ${b}`);}
const s=E.preset('same');
test('coherent sources, equal paths and opposite source phase',()=>{near(E.geometry(s,[0,2]).B,2);near(E.geometry({...s,phase:Math.PI},[0,2]).B,0);assert.equal(E.geometry({...s,A:0},[0,2]).B,0);});
test('representative path differences are physically realizable',()=>{for(const [name,path,B] of [['zero',0,2],['half',1,0],['full',2,2]]){const state=E.preset(name),g=E.geometry(state,state.p);near(g.pathDifference,path);near(g.B,B);assert.ok(Math.abs(path)<=state.d);}});
test('phase difference matches phase1 minus phase2 with signs',()=>{const state={...s,phase:.7};const p=[1.23,-.4],g=E.geometry(state,p),t=.37;near((g.omega*t-g.k*g.r1+state.phase)-(g.omega*t-g.k*g.r2),g.delta);assert.ok(g.pathDifference<0);});
test('superposition and resultant amplitude over many times',()=>{const state={...s,phase:.37};const p=[.24,.87],g=E.geometry(state,p);for(let i=0;i<100;i++){const t=i/50,r=E.at(state,p,t);near(r.u,r.u1+r.u2);const mean=g.omega*t-g.k*(g.r1+g.r2)/2+state.phase/2;near(r.u,2*state.A*Math.cos(g.delta/2)*Math.sin(mean));assert.ok(Math.abs(r.u)<=g.B+1e-10);}});
test('instantaneous zero is not a node',()=>{const r=E.at(s,[0,0],0);near(r.u,0);near(r.B,2);});
test('speed and wavelength, zero spacing and source centers',()=>{const r=E.at({...s,d:0},[0,0],.5);near(r.v,s.f*s.lambda);assert.ok(Number.isFinite(r.u));near(r.B,2);});
test('invalid settings and observation bounds',()=>{for(const patch of [{lambda:0},{f:0},{A:-1},{d:-1},{phase:Infinity}])assert.throws(()=>E.validate({...s,...patch}));assert.throws(()=>E.at(s,[9,0],0));assert.throws(()=>E.at(s,[0,0],-1));});
console.log(`${count} test groups passed; 0 failed`);

require('./ui-tests.js');
