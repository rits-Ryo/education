'use strict';
const assert=require('node:assert/strict');
const E=require('./engine.js');
let count=0;
function test(name,fn){fn();console.log('PASS '+name);count++;}
function near(a,b,t=1e-12){assert.ok(Math.abs(a-b)<=t*Math.max(Math.abs(b),1e-300),`${a} != ${b}`);}
test('specified dot products',()=>{for(const [a,b,d] of [[[1,0],[1,0],1],[[1,0],[0,1],0],[[1,0],[-1,0],-1],[[3,4],[4,-3],0],[[4,0],[3,2],12]])assert.equal(E.calculate(a,b).dot,d);});
test('same opposite and orthogonal angles',()=>{for(const [b,angle] of [[[2,0],0],[[0,2],90],[[-2,0],180]])assert.equal(E.calculate([1,0],b).angle,angle);});
test('acute and obtuse angles and signed projections',()=>{for(const [b,angle,s] of [[[1,1],45,1],[[-1,1],135,-1]]){const r=E.calculate([2,0],b);near(r.angle,angle);assert.equal(r.scalar,s);assert.deepEqual(r.projection,[s,0]);}});
test('projection same opposite orthogonal',()=>{for(const b of [[3,0],[-3,0],[0,3]]){const r=E.calculate([4,0],b);assert.deepEqual(r.projection,[b[0],0]);}});
test('zero vectors have undefined angles and correct projections',()=>{const a=E.calculate([0,0],[3,2]);assert.equal(a.angle,null);assert.equal(a.projection,null);assert.equal(a.dot,0);const b=E.calculate([3,2],[0,0]);assert.equal(b.angle,null);assert.deepEqual(b.projection,[0,0]);assert.equal(b.scalar,0);});
test('tiny nonzero projection avoids squared length underflow',()=>{const r=E.calculate([1e-200,0],[3,2]);assert.deepEqual(r.projection,[3,0]);assert.equal(r.scalar,3);assert.equal(r.zeroA,false);near(r.dot,3e-200);});
test('near orthogonal remains signed and distinct from exact zero',()=>{const r=E.calculate([1,0],[1e-14,1]);assert.equal(r.exactOrthogonal,false);assert.equal(r.nearOrthogonal,true);assert.equal(r.sign,'positive');assert.equal(E.format(r.dot),'1 × 10^-14');});
test('rotated orthogonal pair',()=>{const r=E.calculate([3,4],[4,-3]);assert.equal(r.exactOrthogonal,true);assert.equal(r.angle,90);assert.equal(r.scalar,0);});
test('representative presets',()=>{for(const angle of [0,45,90,120,180]){const p=E.preset(angle);near(E.calculate(p.a,p.b).angle,angle);}});
test('projection residual perpendicular and component geometry agree',()=>{for(let i=1;i<=250;i++){const a=[Math.sin(i)*5,Math.cos(i)*7],b=[Math.cos(i*2)*8,Math.sin(i*3)*6];const r=E.calculate(a,b),h=r.projection;assert.ok(Math.abs(a[0]*(b[0]-h[0])+a[1]*(b[1]-h[1]))<1e-12);assert.ok(Math.abs(r.dot-r.geometricEstimate)<1e-12);assert.ok(r.angle>=0&&r.angle<=180);}});
test('invalid inputs rejected and formatting finite',()=>{for(const a of [[Infinity,0],[NaN,0],[1000001,0],['1',0]])assert.throws(()=>E.calculate(a,[1,0]));assert.equal(E.format(null),'定義されない');assert.equal(E.format(Infinity),'—');});
test('subnormal directions preserve angle',()=>{const r=E.calculate([5e-324,5e-324],[5e-324,0]);near(r.angle,45);});
test('underflow display retains nonzero sign',()=>{const r=E.calculate([1e-200,0],[-1e-200,0]);assert.equal(r.sign,'negative');assert.equal(r.underflow,true);assert.match(r.dotText,/-1 × 10\^-400/);});
test('regression decimal cancellation is not underflow',()=>{
  const r=E.calculate([1,3],[0.8999999999999999,-0.3]);
  assert.equal(r.dot,-1e-16);assert.equal(r.geometric,-1e-16);
  assert.equal(r.sign,'negative');assert.equal(r.underflow,false);
  assert.equal(r.exactOrthogonal,false);assert.equal(r.nearOrthogonal,true);
  assert.equal(r.dotText,'-1 × 10^-16');assert.ok(r.scalar<0);
  assert.ok(r.projection.every(x=>x<0));
});
test('decimal exact zero and either side of it stay distinct',()=>{
  const cases=[[0.9,0,'zero'],[0.8999999999999999,-1e-16,'negative'],[0.9000000000000001,1e-16,'positive']];
  for(const [x,value,sign] of cases){const r=E.calculate([1,3],[x,-0.3]);
    assert.equal(r.dot,value);assert.equal(r.sign,sign);assert.equal(r.geometric,value);
    assert.equal(r.exactOrthogonal,value===0);assert.equal(r.underflow,false);
    if(value===0){assert.equal(r.angle,90);assert.equal(r.scalar,0);}
  }
});
test('tiny and large nonzero dots are never thresholded to zero',()=>{
  for(const [a,b,value] of [[[1e-200,0],[1e-100,0],1e-300],[[1e-300,0],[1e6,0],1e-294],[[1e6,1e6],[1e6,1e6],2e12],[[1e6,0],[-1e-300,0],-1e-294]]){
    const r=E.calculate(a,b);near(r.dot,value);assert.equal(r.sign,value>0?'positive':'negative');
    assert.equal(r.nearOrthogonal,false);assert.equal(r.exactOrthogonal,false);
    assert.equal(r.angle,value>0?0:180);near(r.scalar,b[0]===0?Math.hypot(...b):value/r.lengthA);
  }
});
test('relative near-orthogonal hint is invariant to vector scale',()=>{
  for(const scale of [1e-200,1,1e6]){const r=E.calculate([scale,0],[1e-14,1]);
    assert.equal(r.sign,'positive');assert.equal(r.nearOrthogonal,true);assert.equal(r.exactOrthogonal,false);
    near(r.cos,1e-14);near(r.dot,scale*1e-14);
  }
});
test('decimal arithmetic keeps signs consistent across cancellation cases',()=>{
  for(let x=1;x<30;x++)for(let y=1;y<30;y++)for(const scale of [0.1,0.3,1.7]){
    const r=E.calculate([x,y],[y*scale,-x*scale]);
    assert.equal(r.geometric,r.dot);
    assert.equal(r.sign,r.dot===0?'zero':r.dot>0?'positive':'negative');
    assert.equal(r.underflow,false);assert.equal(r.exactOrthogonal,r.dot===0);
    if(r.dot!==0)assert.equal(Math.sign(r.scalar),Math.sign(r.dot));
  }
});
test('subnormal ratios retain nonzero display without declaring orthogonality',()=>{
  const r=E.calculate([1,0],[5e-324,1e6]);assert.equal(r.sign,'positive');
  assert.equal(r.exactOrthogonal,false);assert.equal(r.cos,0);
  assert.equal(r.cosText,'5 × 10^-330');assert.notEqual(r.scalarText,'0');
  const q=E.calculate([1,1],[5e-324,0]);assert.notEqual(q.projectionText[0],'0');
  assert.notEqual(q.projectionText[1],'0');
});
console.log(`${count} test groups passed; 0 failed`);
