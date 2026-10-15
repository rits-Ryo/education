'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const katex=require('../vendor/katex-0.19.0/katex.min.js');
const ROOT=path.join(__dirname,'..');let count=0;
function test(name,fn){fn();console.log('PASS',name);count++;}
function decode(s){return s.replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const lessons=walk(path.join(ROOT,'subjects')).filter(f=>f.endsWith('.html')&&fs.readFileSync(f,'utf8').includes('math-display.js'));
let formulas=0;
test('every migrated static formula parses with the pinned KaTeX and strict settings',()=>{
 for(const file of lessons){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/data-latex="([^"]*)"/g)){const latex=decode(m[1]);try{katex.renderToString(latex,{throwOnError:true,trust:false,strict:'error',maxExpand:1000,maxSize:20});}catch(e){throw new Error(path.relative(ROOT,file)+': '+latex+'\n'+e.message);}formulas++;}}
 for(const file of lessons){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g))katex.renderToString(decode(m[1]??m[2]),{throwOnError:true,trust:false,strict:'error'});}
 assert.ok(formulas>150);assert.equal(lessons.length,40);
 console.log('Validated static formulas:',formulas);
});
test('local assets, WOFF2 font URLs and license are complete',()=>{
 const base=path.join(ROOT,'vendor/katex-0.19.0');assert.equal(katex.version,'0.19.0');assert.ok(fs.readFileSync(path.join(base,'LICENSE'),'utf8').includes('MIT'));
 const css=fs.readFileSync(path.join(base,'katex.min.css'),'utf8');let fonts=0;
 for(const m of css.matchAll(/url\(([^)]+)\)/g)){const name=m[1].replace(/["']/g,'');assert.ok(name.endsWith('.woff2'));assert.ok(fs.existsSync(path.join(base,name)));fonts++;}assert.ok(fonts>=20);
 for(const file of lessons){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(m[1].startsWith('http')||m[1].startsWith('#'))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(file),m[1])),m[1]);}}
});
const errors=[];let calls=0;
const context={window:{NumberDisplay:require('../number-format.js'),console:{error(...args){errors.push(args);}},katex:{render(latex,element,options){element.output=katex.renderToString(latex,options);element.hasMath=true;calls++;}}},document:{addEventListener(){}}};
vm.runInNewContext(fs.readFileSync(path.join(ROOT,'math-display.js'),'utf8'),context);const M=context.window.MathDisplay;
class Element{constructor(){this.attrs={};this.hasMath=false;this.textContent='';}setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this.attrs[k];}querySelector(){return this.hasMath?{}:null;}}
test('dynamic rendering updates only changed formulas and retains MathML',()=>{const el=new Element();assert.equal(M.renderMath(el,String.raw`\int_0^1x^2\,dx=\frac13`,{displayMode:true}),true);assert.ok(el.output.includes('<math'));const before=calls;M.renderMath(el,String.raw`\int_0^1x^2\,dx=\frac13`,{displayMode:true});assert.equal(calls,before);M.renderMath(el,String.raw`x=\frac23`,{displayMode:true});assert.equal(calls,before+1);});
test('errors are explicit and library failure retains TeX without stopping the lesson',()=>{const el=new Element();assert.equal(M.renderMath(el,String.raw`\notACommand{`),false);assert.ok(el.attrs['data-math-error']);assert.ok(el.textContent.includes('notACommand'));assert.ok(errors.length);const renderer=context.window.katex;context.window.katex=null;assert.equal(M.renderMath(el,'x^2'),false);assert.ok(el.textContent.includes('x^2'));context.window.katex=renderer;assert.equal(M.renderMath(el,'x^2'),true);assert.ok(!el.attrs['data-math-error']);});
test('safe options reject trusted HTML and unsafe user commands stay literal',()=>{const el=new Element();M.renderMath(el,String.raw`\href{javascript:alert(1)}{x}`);assert.ok(!el.output.includes('href="javascript:'));const token=M.token(String.raw`\htmlClass{attack}{x}`);assert.ok(token.startsWith('\\text{'));katex.renderToString(token,{strict:'error',trust:false});});
test('numbers, exact radicals and fractions and expression AST preserve meaning',()=>{assert.equal(M.number(1.23456),'1.235');assert.equal(M.number(-0),'0');assert.equal(M.number(-1e-12),String.raw`-1\times10^{-12}`);assert.equal(M.token('√3/2'),String.raw`\frac{\sqrt{3}}{2}`);assert.equal(M.token('π/3'),String.raw`\frac{\pi }{3}`);const E=require('../subjects/math/Quadratic_function/engine.js');const source=M.ast(E.parse('sqrt(x^2+1)/3'));assert.ok(source.includes('\\frac'));katex.renderToString(source,{strict:'error'});const pi=M.ast(E.parse('pi*x'),{pi:true});assert.ok(pi.includes('\\pi'));const authored=M.ast(E.parse('pi*x+1.234567890123456789'),{source:'pi*x+1.234567890123456789'});assert.ok(authored.includes('\\pi'));assert.ok(authored.includes('1.234567890123456789'));});
console.log(`${count} math rendering groups passed; 0 failed`);
