'use strict';
const assert=require('node:assert/strict'),E=require('./engine.js');
let count=0;
function check(name,f,l,r,s,min,max,minX,maxX){const z=E.solve(E.parse(f),s,l,r);assert.ok(Math.abs(z.min-min)<1e-7,name+' min');assert.ok(Math.abs(z.max-max)<1e-7,name+' max');if(minX)assert.deepEqual(z.minX,minX,name+' minX');if(maxX)assert.deepEqual(z.maxX,maxX,name+' maxX');count++;console.log('PASS',name);}
check('vertex left','(x-a)^2',0,4,{a:-1},1,25,[0],[4]);
check('vertex inside','(x-a)^2',0,4,{a:1},0,9,[1],[4]);
check('vertex right','(x-a)^2',0,4,{a:5},1,25,[4],[0]);
check('left endpoint vertex','(x-a)^2',0,4,{a:0},0,16,[0],[4]);
check('right endpoint vertex','(x-a)^2',0,4,{a:4},0,16,[4],[0]);
check('both endpoints','(x-a)^2',0,4,{a:2},0,4,[2],[0,4]);
check('negative coefficient','-(x-a)^2+4',0,4,{a:2},0,4,[0,4],[2]);
check('linear degeneration','a*x^2+b*x+c',0,4,{a:0,b:-2,c:3},-5,3,[4],[0]);
check('constant degeneration','a*x^2+b*x+c',0,4,{a:0,b:0,c:3},3,3);
check('singleton','sqrt(x+2)',-2,-2,{},0,0,[-2],[-2]);
check('multiple parameters','a*x^2+b*x+c',-2,3,{a:2,b:-4,c:5},3,21,[1],[-2]);
check('moving domain','x^2',-2,0,{},0,4,[0],[-2]);
check('absolute','abs(x-a)',0,4,{a:1.234},0,2.766);
check('sine','sin(x)',0,Math.PI,{},0,1);
check('cubic','x^3-3*a*x',-2,2,{a:1},-2,2);
check('sqrt','sqrt(x+2)',-2,3,{},0,Math.sqrt(5));
for(const [name,fn] of [['reversed',()=>E.solve(E.parse('x^2'),{},4,0)],['syntax',()=>E.parse('x+(')],['injection',()=>E.parse('alert(1)')],['undefined',()=>E.solve(E.parse('sqrt(x+2)'),{},-3,2)],['pole between samples',()=>E.solve(E.parse('1/(x-0.12345)'),{},0,1)],['tan conservative',()=>E.solve(E.parse('tan(x)'),{},0,2)]]){assert.throws(fn);count++;console.log('PASS',name);}
assert.equal(E.evaluate(E.parse('-x^2'),{x:2}),-4);assert.equal(E.evaluate(E.parse('2x^2+3(x+1)'),{x:2}),17);assert.equal(E.evaluate(E.parse('2^3^2'),{}),512);count+=3;
for(const [name,f,l,r,expected] of [['A','(x-a)^2','0','4',[0,4,2]],['B','x^2','a','a+2',[0,-2,-1]],['C','-(x-a)^2+4','0','4',[0,4,2]],['D','(x-a)^2','a-1','3',[null,3,2]]]){
 const equations=E.boundaryEquations(E.parse(f),E.parse(l),E.parse(r),{a:0},'a');
 expected.forEach((v,i)=>{if(v!==null)assert.ok(equations[i].roots.includes(v),name+' boundary '+i);else assert.equal(equations[i].roots.length,0);});count++;console.log('PASS',name,'analytic boundaries');
}
const tangent=E.boundaryEquations(E.parse('(x-a^2)^2'),E.parse('0'),E.parse('4'),{a:0},'a');assert.deepEqual(tangent[0].roots,[0]);count++;
const large=E.solve(E.parse('x^2+1e12'),{},0,1);assert.deepEqual(large.maxX,[1]);count++;
console.log(`${count} tests passed`);
