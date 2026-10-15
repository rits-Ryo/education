(function(root){
'use strict';
function finite(...values){if(!values.every(Number.isFinite))throw new RangeError('有限の数値を入力してください');}
function nonnegative(...values){finite(...values);if(values.some(v=>v<0))throw new RangeError('負の量は入力できません');}
function positive(...values){finite(...values);if(values.some(v=>v<=0))throw new RangeError('0より大きい量を入力してください');}

const species={Zn:{atoms:{Zn:1},charge:0,tex:'\\mathrm{Zn}'},Zn2:{atoms:{Zn:1},charge:2,tex:'\\mathrm{Zn}^{2+}'},Cu2:{atoms:{Cu:1},charge:2,tex:'\\mathrm{Cu}^{2+}'},Cu:{atoms:{Cu:1},charge:0,tex:'\\mathrm{Cu}'},Mg:{atoms:{Mg:1},charge:0,tex:'\\mathrm{Mg}'},Mg2:{atoms:{Mg:1},charge:2,tex:'\\mathrm{Mg}^{2+}'},H:{atoms:{H:1},charge:1,tex:'\\mathrm H^+'},H2:{atoms:{H:2},charge:0,tex:'\\mathrm H_2'},Fe2:{atoms:{Fe:1},charge:2,tex:'\\mathrm{Fe}^{2+}'},Fe3:{atoms:{Fe:1},charge:3,tex:'\\mathrm{Fe}^{3+}'},e:{atoms:{},charge:-1,tex:'e^-'}};
const reactions={zinc:{left:[['Zn',1],['Cu2',1]],right:[['Zn2',1],['Cu',1]],electron:2,oxidation:'Zn: 0 → +2',reduction:'Cu: +2 → 0',half:['\\mathrm{Zn}\\to\\mathrm{Zn}^{2+}+2e^-','\\mathrm{Cu}^{2+}+2e^-\\to\\mathrm{Cu}']},magnesium:{left:[['Mg',1],['H',2]],right:[['Mg2',1],['H2',1]],electron:2,oxidation:'Mg: 0 → +2',reduction:'H: +1 → 0',half:['\\mathrm{Mg}\\to\\mathrm{Mg}^{2+}+2e^-','2\\mathrm H^++2e^-\\to\\mathrm H_2']},iron:{left:[['Fe2',1]],right:[['Fe3',1],['e',1]],electron:1,oxidation:'Fe: +2 → +3',reduction:'酸化半反応のみ（電子受容体は未指定）',half:['\\mathrm{Fe}^{2+}\\to\\mathrm{Fe}^{3+}+e^-']}};
function totals(side){const atoms={};let charge=0;for(const [key,n] of side){const p=species[key];charge+=p.charge*n;for(const [a,v] of Object.entries(p.atoms))atoms[a]=(atoms[a]||0)+v*n;}return {atoms,charge};}
function calculate(s){const r=reactions[s.kind];if(!r||!Number.isInteger(s.multiple)||s.multiple<1||s.multiple>6)throw new RangeError('反応と係数倍1〜6を選択してください');const part=side=>side.map(([k,n])=>(n*s.multiple===1?'':n*s.multiple)+species[k].tex).join('+');return {...r,electrons:r.electron*s.multiple,latex:part(r.left)+'\\longrightarrow '+part(r.right),leftTotals:totals(r.left.map(([key,n])=>[key,n*s.multiple])),rightTotals:totals(r.right.map(([key,n])=>[key,n*s.multiple]))};}
const api={species,reactions,totals,calculate};

if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChemistryEngine=api;
})(typeof window!=='undefined'?window:globalThis);
