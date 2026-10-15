(function(root){
'use strict';
const S=root.ChemistrySVG,C=S.colors;
function draw(svg,s,r,t=0){
const v=S.scene(svg,[-4,4,-4,4]);v.point([0,0],'原子核',C[0],32);v.text(-3.8,3.7,'陽子 p='+r.p+'  中性子 n='+r.n);r.shells.forEach((n,k)=>{const radius=1+k*.6;v.node('circle',{cx:v.sx(0),cy:v.sy(0),r:radius*62.5,fill:'none',stroke:'#9cb2cf','stroke-width':2});for(let i=0;i<n;i++)v.point([radius*Math.cos(2*Math.PI*i/n),radius*Math.sin(2*Math.PI*i/n)],'',C[1],6);v.text(radius,.2,'殻'+(k+1)+': '+n,C[1],18);});v.text(-3.8,-3.5,'電子 e⁻='+r.e+'（模式配置）',C[1]);
}
root.ChemistryDrawing={draw};
})(window);
