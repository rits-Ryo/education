(function(root){
'use strict';

const probabilities={coin:.5,die:1/6,sum:6/36};
function probability(kind,p){const v=kind==='bernoulli'?p:probabilities[kind];if(!Number.isFinite(v)||v<0||v>1)throw new RangeError('成功確率は0〜1です');return v;}
function rng(seed){if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw new RangeError('シードは0〜4294967295の整数です');let s=seed>>>0;return ()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function success(kind,p,random){const draw=()=>{const u=random();if(!Number.isFinite(u)||u<0||u>=1)throw new RangeError('乱数は0以上1未満です');return u;};probability(kind,p);if(kind==='coin')return draw()<.5;if(kind==='die')return Math.floor(draw()*6)+1===6;if(kind==='sum')return Math.floor(draw()*6)+Math.floor(draw()*6)+2===7;return draw()<p;}
function create(kind,p,seed){return {kind,p:probability(kind,p),seed,n:0,hits:0,history:[],random:rng(seed)};}
function run(s,N){if(!Number.isInteger(N)||N<1||N>100000||s.n+N>1000000)throw new RangeError('追加1〜100000回、合計1000000回までです');for(let i=0;i<N;i++){if(success(s.kind,s.p,s.random))s.hits++;s.n++;s.history.push(s.hits/s.n);}return s;}
function sample(history,max=1200){if(history.length<=max)return history.map((y,i)=>[i+1,y]);const out=[];for(let i=0;i<max;i++){const j=Math.round(i*(history.length-1)/(max-1));out.push([j+1,history[j]]);}return out;}
const api={probability,rng,success,create,run,sample};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LessonEngine=api;
})(typeof window!=='undefined'?window:globalThis);
