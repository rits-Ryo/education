(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[-1.3,1.3,-1.3,1.3]),points=r.points.map(p=>v.project(p.map(x=>x-.5),s.phi,s.tilt));for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if(r.points[i].reduce((sum,x,k)=>sum+Math.abs(x-r.points[j][k]),0)===1)v.line(points[i],points[j],'#92a8c5',true,2);points.forEach((p,i)=>v.point(p,i<8?'角':s.kind==='BCC'?'体心':'面心',i<8?C[0]:C[1],i<8?14:20));v.text(-1.2,1.1,'角1/8・面心1/2・体心1');v.text(-1.2,-1.1,'a ≈ '+root.NumberDisplay.formatNonzero(r.a)+' nm（正規化表示）',C[2],20);
}
root.ChemistryDrawing={draw};
})(window);
