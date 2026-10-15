'use strict';
// A small DOM/canvas simulator for real lesson controllers and SVG rendering.
// It is deliberately not a substitute for browser, responsive or touch testing.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
module.exports=function lesson(folder,engineName,drawingName){
  const elements=new Map(),frames=new Map();let sequence=0;
  const document={hidden:false,activeElement:null,listeners:{},getElementById:id=>elements.get(id),createElement:tag=>new Element(tag),createElementNS:(ns,tag)=>new Element(tag),addEventListener(name,fn){this.listeners[name]=fn;}};
  class Element{
    constructor(tag='div'){this.tag=tag;this.attrs={};this.children=[];this.listeners={};this.value='';this.checked=false;this.textContent='';this.hidden=false;}
    get id(){return this.attrs.id;}set id(v){this.attrs.id=v;elements.set(v,this);}
    get valueAsNumber(){return this.value===''?NaN:Number(this.value);}
    setAttribute(k,v){this.attrs[k]=String(v);if(k==='id')elements.set(v,this);}
    getAttribute(k){return this.attrs[k]??null;}removeAttribute(k){delete this.attrs[k];}
    append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}
    addEventListener(n,f){this.listeners[n]=f;}emit(n,e={}){this.listeners[n]?.({target:this,preventDefault(){},...e});}
    focus(){document.activeElement=this;}
    querySelector(selector){const m=selector.match(/\[([^=]+)="([^"]+)"\]/);if(!m)return null;const walk=e=>{if(e.attrs[m[1]]===m[2])return e;for(const c of e.children){const n=walk(c);if(n)return n;}return null;};return walk(this);}
    getScreenCTM(){return {inverse(){return {};}};}setPointerCapture(id){this.capture=id;}hasPointerCapture(id){return this.capture===id;}releasePointerCapture(){this.capture=null;}
    getContext(){return {createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){}};}
  }
  const directory=path.join(__dirname,'../subjects/physics',folder),html=fs.readFileSync(path.join(directory,'index.html'),'utf8');
  for(const match of html.matchAll(/<([a-z]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)){const el=new Element(match[1]);el.id=match[3];for(const a of match[2].matchAll(/([\w-]+)="([^"]*)"/g))el.setAttribute(a[1],a[2]);el.value=el.getAttribute('value')??'';el.checked=/\bchecked\b/.test(match[2]);if(match[1]==='select'){const section=html.slice(match.index).split('</select>')[0];const options=[...section.matchAll(/<option value="([^"]+)"([^>]*)>/g)];el.value=(options.find(x=>x[2].includes('selected'))??options[0])[1];}}
  const engine=require(path.join(directory,'engine.js')),ctx={window:{innerWidth:1200,NumberDisplay:require('../number-format.js'),[engineName]:engine,addEventListener(){}},document,
    requestAnimationFrame(fn){frames.set(++sequence,fn);return sequence;},cancelAnimationFrame(id){frames.delete(id);},DOMPoint:class{constructor(x,y){this.x=x;this.y=y;}matrixTransform(){return this;}}};
  ctx.window.console={error(message,latex,error){throw new Error('Math validation failed: '+latex+' '+(error?.message||''));}};
ctx.window.katex={render(latex,element,options){require('../vendor/katex-0.19.0/katex.min.js').renderToString(latex,options);element.textContent=latex;}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../math-display.js'),'utf8'),ctx);
  vm.runInNewContext(fs.readFileSync(path.join(directory,'drawing.js'),'utf8'),ctx);
  vm.runInNewContext(fs.readFileSync(path.join(directory,'script.js'),'utf8'),ctx);
  function flush(time=0){const pending=[...frames.values()];frames.clear();for(const f of pending)f(time);}
  function input(id,value,event='input'){const el=elements.get(id);el.value=String(value);el.emit(event);flush();}
  function texts(el){return [el.textContent,...el.children.flatMap(texts)].join(' ');}
  return {elements,document,frames,flush,input,texts,window:ctx.window};
};
