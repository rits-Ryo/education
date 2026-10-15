'use strict';
// Execute each actual controller's formula builder with real KaTeX in Node.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const N=require('../../../number-format.js'),M=require('../../../math-display.js'),katex=require('../../../vendor/katex-0.19.0/katex.min.js');
module.exports=function testPresentation(directory,E){
 let config,parsed=0;const element=()=>({style:{},append(){},replaceChildren(){},setAttribute(){}});
 const context={window:{MathDisplay:{...M,number:v=>M.token(N.formatNonzero(v))},NumberDisplay:N,ChemistryEngine:E,ChemistryDrawing:{draw(){},second(){}}},document:{getElementById:element,createElement:element}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'ui.js'),'utf8'),context);
 context.window.ChemistryUI.start=c=>config=c;
 vm.runInNewContext(fs.readFileSync(path.join(directory,'script.js'),'utf8'),context);
 assert.ok(config);
 function render(s){let result;try{result=E.calculate(s);}catch(e){if(e instanceof RangeError)return;throw e;}const rows=config.latex(s,result);assert.ok(rows.length);katex.renderToString('\\begin{aligned}'+rows.join('\\\\{}')+'\\end{aligned}',{strict:'error',trust:false,throwOnError:true});assert.ok(config.describe(s,result));parsed++;}
 render(config.defaults);
 const html=fs.readFileSync(path.join(directory,'index.html'),'utf8');
 for(const m of html.matchAll(/<select[^>]*data-key="([^"]+)"([^>]*)>([\s\S]*?)<\/select>/g))for(const option of m[3].matchAll(/<option value="([^"]+)"/g)){
  const s={...config.defaults,[m[1]]:m[2].includes('data-number')?Number(option[1]):option[1]};
  if(m[1]==='Z'&&E.isotopes){s.A=E.isotopes[s.Z-1][0];s.q=0;}
  render(s);
 }
 for(const [key,value] of Object.entries(config.defaults))if(typeof value==='number'&&!['phi','tilt'].includes(key))render({...config.defaults,[key]:0});
 assert.ok(parsed>1,'valid dynamic formula states required');return parsed;
};
