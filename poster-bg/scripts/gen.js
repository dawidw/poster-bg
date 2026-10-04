// poster-bg generator: seeded SVG backgrounds in the spirit of the Polish School of Posters,
// 60s/70s geometric modernism and Wojciech Fangor's soft op art. Plain JS, no dependencies.
// It runs in node (CLI below) and in the browser (the generator and landing pages).
//   node gen.js --motif stripes --palette baron --seed 7 --size 1200x1600 --out bg.svg
//   node gen.js --poster | --fangor | --ring | --dream [--colors random] [--circle 1.2] [--x 0.4 --y 0.6] [--grain 16 (mosaic tiles across)] [--angle 30] [--amp 1.4 --wavelength 1.2 --softness 1.5 (dream)] --out bg.svg

function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const PALETTES={
 baron:{paper:'#efe6d6',dark:'#1d1b1c',light:'#f3d9d4',accent:'#e0484a',inks:['#2f7fb8','#2f9a62','#e0484a','#ee7f9a','#f3d9d4']},
 zloto:{paper:'#b8963a',dark:'#262a4a',light:'#c9b36f',accent:'#2f9a62',inks:['#5b56d6','#262a4a','#2f9a62','#c9b36f']},
 roger:{paper:'#17161a',dark:'#17161a',light:'#ece3cf',accent:'#d93a3a',inks:['#ece3cf','#d93a3a','#8c8576']},
 marek:{paper:'#efe6dc',dark:'#101010',light:'#efe6dc',accent:'#f0287c',inks:['#101010','#f0287c','#efe6dc']},
 brasilia:{paper:'#dfd6c4',dark:'#0f1a1c',light:'#dfd6c4',accent:'#e54b1c',inks:['#96be1e','#00a8b5','#0a86c8','#e54b1c','#e0302b','#e43f8c','#ec7a00']},
 anima:{paper:'#d9c8bc',dark:'#14252b',light:'#d9c8bc',accent:'#c4572f',inks:['#14252b','#c4572f','#d9c8bc']},
 wesoft:{paper:'#d4cfc6',dark:'#141414',light:'#d4cfc6',accent:'#f26430',inks:['#000000','#f26430','#e9a083','#d4cfc6']},
 soft_flame:{paper:'#f0efec',dark:'#f0661c',light:'#f6f3ec',accent:'#fbd51a',inks:['#f6f3ec','#fbd51a','#f0661c','#d9304e']},
 soft_tricolor:{paper:'#efeeee',dark:'#14080c',light:'#f4f1ee',accent:'#2f55d6',inks:['#f4f1ee','#2f55d6','#14080c','#d3263e']},
 soft_violet:{paper:'#e8e4d6',dark:'#5a2f9a',light:'#eeeadb',accent:'#5a2f9a',inks:['#eeeadb','#0f7a52','#5a2f9a','#d6264f']},
 soft_orchard:{paper:'#ece8cf',dark:'#4a3a58',light:'#f3eedc',accent:'#9a5a96',inks:['#f3eedc','#ee9a62','#9a5a96','#4a3a58','#3f8a52']},
 soft_candy:{paper:'#f4f3f1',dark:'#ff9a1c',light:'#f4f3f1',accent:'#ff9a1c',inks:['#f4f3f1','#8fb6df','#ff9a1c','#ff7fb0']},
 soft_navy:{paper:'#e9e3d3',dark:'#10224a',light:'#f2efe4',accent:'#10224a',inks:['#f2efe4','#7fd0f0','#10224a','#2a7fd0']},
 soft_cobalt:{paper:'#5b86e0',dark:'#10131c',light:'#7fa4ec',accent:'#10131c',inks:['#7fa4ec','#10131c','#5b86e0']},
 soft_ochre:{paper:'#9a7438',dark:'#d9132a',light:'#a07a3c',accent:'#d9132a',inks:['#a07a3c','#e08aa0','#d9132a','#e08aa0']},
 soft_orchid:{paper:'#f1f1ee',dark:'#2d86c0',light:'#f2e3e6',accent:'#c0407a',inks:['#f2e3e6','#c0407a','#10305f','#2d86c0','#9fd0e6']},
 soft_redcore:{paper:'#f3f2ee',dark:'#1c6cb0',light:'#f4102c',accent:'#f4102c',inks:['#f4102c','#0c0c14','#1c6cb0','#9ad0ea'],core:0.5},
 mazur:{paper:'#efe4cf',dark:'#14213d',light:'#f4ecd8',accent:'#d62828',inks:['#14213d','#d62828','#f77f00','#fcbf49','#3a7ca5']},
 jesien:{paper:'#e8dcc4',dark:'#2d1e1a',light:'#efe6d2',accent:'#c1440e',inks:['#c1440e','#e0a458','#5b7b4a','#2d1e1a','#d9c7a3']},
 moda:{paper:'#f6e8ea',dark:'#1b1b2f',light:'#fdf0f2',accent:'#ff2e63',inks:['#ff2e63','#252a34','#08d9d6','#f9f7f7']},
 cyrk:{paper:'#f2e9dc',dark:'#2b2d42',light:'#f7f1e5',accent:'#ef233c',inks:['#2b2d42','#ef233c','#8d99ae','#f2c14e']},
 fangor_sunset:{paper:'#f0e6dc',dark:'#3b1244',light:'#fbf4ea',accent:'#d62839',inks:['#d62839','#f77f00','#6a0572','#fcbf49','#2a9d8f']},
 fangor_mint:{paper:'#e8efe6',dark:'#264653',light:'#f6faf4',accent:'#e76f51',inks:['#2a9d8f','#e9c46a','#264653','#f4a261','#e76f51']},
 fangor_mono:{paper:'#e6e6e6',dark:'#111111',light:'#fafafa',accent:'#444444',inks:['#111111','#777777','#dddddd','#444444','#999999']},
 soft_lagoon:{paper:'#e8efe9',dark:'#12607a',light:'#f1f6f0',accent:'#46c2b4',inks:['#f1f6f0','#46c2b4','#12607a','#0d2f52','#6fa8dc']},
 soft_ember:{paper:'#f1ece6',dark:'#b3122e',light:'#fff3dd',accent:'#f05a1a',inks:['#fff3dd','#ffc23a','#f05a1a','#b3122e','#e8708a']},
 soft_mono:{paper:'#ecebe8',dark:'#1a1a1a',light:'#f4f3f0',accent:'#9a9a98',inks:['#f4f3f0','#9a9a98','#1a1a1a','#8e8e8c']},
 soft_blush:{paper:'#f4eeea',dark:'#7a2745',light:'#fbf6f1',accent:'#c9485b',inks:['#fbf6f1','#f2b6b0','#c9485b','#7a2745','#e9a0a8']},
 soft_lilac:{paper:'#f1eef4',dark:'#5a3d9a',light:'#f8f5fb',accent:'#b79ce2',inks:['#f8f5fb','#b79ce2','#5a3d9a','#c0398a']},
 dream_navy:{paper:'#c8284f',dark:'#1a2347',light:'#f6dadf',accent:'#1496d4',glow:'#1496d4',inks:['#c8284f','#f6dadf','#1a2347','#d8b3a4','#c8284f','#f6dadf']},
 dream_sun:{paper:'#f7c315',dark:'#ee4a24',light:'#f3e3d6',accent:'#ff8a1e',inks:['#f7c315','#f3e3d6','#ee4a24','#f3e3d6','#ff8a1e','#d9a6c8']},
 dream_flag:{paper:'#e4202a',dark:'#0f6a66',light:'#c9aeb4',accent:'#e4202a',glow:'#0b3c40',inks:['#e4202a','#c9aeb4','#0f6a66','#e4202a']},
 dream_azure:{paper:'#2aa7dd',dark:'#8d2b2b',light:'#7ecbe8',accent:'#ffb347',inks:['#2aa7dd','#8d2b2b','#ffb347','#7ecbe8','#8d2b2b','#2aa7dd']},
 dream_spectrum:{paper:'#6b2670',dark:'#2036a8',light:'#f2c230',accent:'#ff6a14',soft:1.7,inks:['#6b2670','#2036a8','#18a7a0','#f2c230','#ff6a14']},
 dream_candy:{paper:'#f3efe6',dark:'#1d7a4f',light:'#f3efe6',accent:'#e04fb3',inks:['#f3efe6','#1d7a4f','#e04fb3','#f2b705','#f3efe6']},
 dream_lagoon:{paper:'#f08a1e',dark:'#6a3a8a',light:'#f08a1e',accent:'#1d5fc0',inks:['#f08a1e','#6a3a8a','#1d5fc0','#f08a1e','#6a3a8a']},
 dream_rose:{paper:'#f2d6d6',dark:'#2a1b3d',light:'#f2d6d6',accent:'#2a8fbd',glow:'#2a8fbd',inks:['#f2d6d6','#b0264f','#2a1b3d','#f2d6d6','#b0264f']},
 zamecznik:{paper:'#f2f2f2',dark:'#0d0d0d',light:'#f2f2f2',accent:'#2a6fb0',inks:['#0d0d0d','#f2f2f2','#0d0d0d','#f2f2f2','#2a6fb0']},
 stanczak:{paper:'#f1ece0',dark:'#1a2347',light:'#f1ece0',accent:'#e0382e',inks:['#1a2347','#e0382e','#f1ece0','#2a8fd0']},
 konstruktywizm:{paper:'#efe8d8',dark:'#111111',light:'#efe8d8',accent:'#d62a1f',inks:['#d62a1f','#111111','#efe8d8']},
 lenica:{paper:'#e8dfcb',dark:'#1a1a1a',light:'#f4ede0',accent:'#d62a1f',inks:['#1a1a1a','#d62a1f','#f0c419','#2a6fb0','#f4ede0']},
 jazz:{paper:'#f0b21a',dark:'#111111',light:'#f4efe4',accent:'#d62a1f',inks:['#111111','#f4efe4','#1a2347','#d62a1f']},
 mlodozeniec:{paper:'#fbf8ef',dark:'#111111',light:'#fbf8ef',accent:'#ff4f9a',inks:['#ff4f9a','#ffd21a','#3fbf6b','#ff8a1e','#2a8fd0']},
 bauhaus:{paper:'#f3ecdc',dark:'#161616',light:'#f3ecdc',accent:'#e63b2e',inks:['#e63b2e','#1d4e9e','#f2b705','#161616','#f3ecdc']},
 kobalt:{paper:'#eae4d3',dark:'#0e1b3d',light:'#eae4d3',accent:'#ff6b35',inks:['#0e1b3d','#2e5cd6','#ff6b35','#eae4d3']},
 pastel:{paper:'#f7efe6',dark:'#3d2c3e',light:'#fbf6ef',accent:'#ff8fa3',inks:['#ff8fa3','#ffd6a5','#b5e2c4','#a7c7e7','#cdb4db']},
 neon:{paper:'#0b0b12',dark:'#0b0b12',light:'#f4f4f8',accent:'#ff2e93',inks:['#ff2e93','#00e5ff','#faff00','#7c4dff','#f4f4f8']},
 ocean:{paper:'#e6f0f2',dark:'#0b2a3c',light:'#f2f8f9',accent:'#ef6f3c',inks:['#0b2a3c','#1f7a8c','#bfdbf7','#ef6f3c','#f2f8f9']},
 forest:{paper:'#e9e5d3',dark:'#14281d',light:'#f3f0e1',accent:'#c8553d',inks:['#14281d','#386641','#a7c957','#c8553d','#f2e8cf']},
 sepia:{paper:'#efe3cf',dark:'#2b1d14',light:'#f6ecd9',accent:'#a8481f',inks:['#2b1d14','#a8481f','#d9a441','#6b8e6b','#efe3cf']},
 mono:{paper:'#efefef',dark:'#111111',light:'#fafafa',accent:'#6a6a6a',inks:['#111111','#6a6a6a','#bdbdbd','#fafafa']},
 pop:{paper:'#fff8e7',dark:'#1a1a1a',light:'#fff8e7',accent:'#ff3b30',inks:['#ff3b30','#ffcc00','#0a84ff','#34c759','#1a1a1a']},
 lato:{paper:'#fff1d6',dark:'#3b1f2b',light:'#fff1d6',accent:'#ff5d73',inks:['#ff5d73','#ffb627','#2ec4b6','#3b1f2b','#fff1d6']},
 fangor_fire:{paper:'#efe6dc',dark:'#003049',light:'#fff6e8',accent:'#ffb000',inks:['#d62828','#f77f00','#fcbf49','#003049','#eae2b7']},
 fangor_ice:{paper:'#e8eef2',dark:'#0b3954',light:'#f8fbfd',accent:'#2a9df4',inks:['#0b3954','#2a9df4','#bfd7ea','#ff5a5f','#f8fbfd']},
 fangor_mauve:{paper:'#eee6ea',dark:'#3c1642',light:'#fbf5f8',accent:'#c9184a',inks:['#3c1642','#8e4162','#c9184a','#ffb3c1','#fbf5f8']},
 fangor_acid:{paper:'#f0f0e6',dark:'#111111',light:'#fbfbf2',accent:'#d7ff3a',inks:['#111111','#5c27fe','#d7ff3a','#ff4d6d','#fbfbf2']},
 fangor_earth:{paper:'#eadfcb',dark:'#283618',light:'#f6efe0',accent:'#bc6c25',inks:['#283618','#606c38','#dda15e','#bc6c25','#fefae0']},
 soft_sunset:{paper:'#f6efe9',dark:'#7b2cbf',light:'#fff5e6',accent:'#ffd166',inks:['#fff5e6','#ffd166','#ef476f','#7b2cbf','#ff9e7a']},
 soft_ice:{paper:'#eef3f6',dark:'#012a4a',light:'#ffffff',accent:'#a9d6e5',inks:['#ffffff','#a9d6e5','#2c7da0','#012a4a','#61a5c2']},
 soft_moss:{paper:'#ecebe0',dark:'#1b2d1f',light:'#f4f1de',accent:'#a3b18a',inks:['#f4f1de','#a3b18a','#3a5a40','#1b2d1f','#588157']},
 soft_cherry:{paper:'#f6ecec',dark:'#590d22',light:'#fff1f2',accent:'#ff758f',inks:['#fff1f2','#ff758f','#c9184a','#590d22','#ff8fa3']},
 soft_gold:{paper:'#f2ede2',dark:'#7f4f24',light:'#fffaf0',accent:'#ffd60a',inks:['#fffaf0','#ffd60a','#ff8800','#7f4f24','#e9c46a']},
 soft_ink:{paper:'#efefec',dark:'#0b0c0f',light:'#f6f6f4',accent:'#9aa0a6',inks:['#f6f6f4','#9aa0a6','#2b2f36','#0b0c0f','#6b7078']},
 soft_twilight:{paper:'#ecebf3',dark:'#1a1a40',light:'#f4f1ff',accent:'#b8b8ff',inks:['#f4f1ff','#b8b8ff','#5e60ce','#1a1a40','#9d4edd']},
 soft_peach:{paper:'#f8eee7',dark:'#3d405b',light:'#fff3ec',accent:'#ffb997',inks:['#fff3ec','#ffb997','#e07a5f','#3d405b','#f4a261']},
 dream_sunset:{paper:'#ff7b54',dark:'#3a0ca3',light:'#f4ede4',accent:'#ffd56b',soft:1.2,inks:['#ff7b54','#ffb26b','#ffd56b','#f4ede4','#7b2cbf','#3a0ca3']},
 dream_ocean:{paper:'#03045e',dark:'#03045e',light:'#caf0f8',accent:'#ff9f1c',inks:['#03045e','#0077b6','#00b4d8','#90e0ef','#caf0f8','#ff9f1c']},
 dream_forest:{paper:'#1b4332',dark:'#1b4332',light:'#f1faee',accent:'#e9c46a',inks:['#1b4332','#40916c','#95d5b2','#f1faee','#e9c46a','#bc6c25']},
 dream_pop:{paper:'#ff006e',dark:'#8338ec',light:'#f4f1de',accent:'#ffbe0b',soft:1.3,inks:['#ff006e','#fb5607','#ffbe0b','#f4f1de','#3a86ff','#8338ec']},
 dream_mono:{paper:'#f2f2f2',dark:'#161616',light:'#f2f2f2',accent:'#bdbdbd',glow:'#cfcfcf',inks:['#f2f2f2','#bdbdbd','#6b6b6b','#161616','#6b6b6b','#f2f2f2']},
 dream_peach:{paper:'#ffe5d9',dark:'#9d8189',light:'#ffe5d9',accent:'#f4acb7',inks:['#ffe5d9','#ffcad4','#f4acb7','#9d8189','#d8e2dc','#ffe5d9']},
 dream_ember:{paper:'#1d0b0b',dark:'#1d0b0b',light:'#fff3b0',accent:'#ffba08',glow:'#ffba08',inks:['#1d0b0b','#6a040f','#d00000','#f48c06','#ffba08','#fff3b0']},
 dream_ice:{paper:'#ffffff',dark:'#023e8a',light:'#ffffff',accent:'#48cae4',glow:'#90e0ef',inks:['#ffffff','#caf0f8','#48cae4','#0077b6','#023e8a','#caf0f8']},
 fangor:{paper:'#e9e1d6',dark:'#10121a',light:'#f3ede4',accent:'#e23a2e',inks:['#e23a2e','#1b3f9e','#f3ede4','#10121a','#e98aa2']},
 fangor_blue:{paper:'#dde3ea',dark:'#0b1230',light:'#eef1f6',accent:'#ff5a36',inks:['#0b1230','#2a5bd7','#9db8f0','#eef1f6','#ff5a36']},
 fangor_green:{paper:'#e6e8d8',dark:'#0f3d2e',light:'#f2efe4',accent:'#e8503a',inks:['#0f3d2e','#2f9a62','#d9e8c4','#f2efe4','#e8503a']}};
// per-motif settings: the generator page builds its sliders from this, the CLI accepts them as --key value
const MOTIF_OPTS={};
const f=n=>+n.toFixed(1);
function seq(r,list,n){const out=[];for(let i=0;i<n;i++){let c;do{c=list[Math.floor(r()*list.length)];}while(c===out[i-1]&&list.length>1);out.push(c);}return out;}
function stripes(r,p,w,h){let defs='',body='',y=-r()*20,i=0,prev='';
 while(y<h){const bh=h*(0.055+r()*0.07);let c1;do{c1=p.inks[Math.floor(r()*p.inks.length)];}while(c1===prev&&p.inks.length>1);
  const c2=r()<.45?c1:r()<.6?p.light:p.paper;prev=c1;
  const a=0.05+r()*0.4,b=0.55+r()*0.4,id='g'+i++;
  defs+=`<linearGradient id="${id}" x1="0" x2="1"><stop offset="${f(a)}" stop-color="${c1}"/><stop offset="${f(b)}" stop-color="${c2}"/></linearGradient>`;
  body+=`<rect x="${f(-20+(r()-.5)*14)}" y="${f(y+(r()-.5)*5)}" width="${f(w+40)}" height="${f(bh-6)}" fill="url(#${id})"/>`;y+=bh;}
 return{defs,body};}
function rings(r,p,w,h){const cx=w*(0.5+(r()-.5)*.1),cy=h*.5,R=Math.min(w*.36,h*.3),radii=[1,.7,.45,.25];
 const L=seq(r,p.inks,4),Rr=seq(r,p.inks,4),bars=seq(r,p.inks,2);
 const defs=`<clipPath id="L"><rect width="${f(cx)}" height="${h}"/></clipPath><clipPath id="R"><rect x="${f(cx)}" width="${f(w-cx)}" height="${h}"/></clipPath>`;
 let body=`<rect x="${f(w*.14)}" y="${f(h*.17)}" width="${f(w*.1)}" height="${f(h*.6)}" fill="${bars[0]}"/><rect x="${f(w*.24)}" y="${f(h*.21)}" width="${f(w*.28)}" height="${f(h*.56)}" fill="${bars[1]}"/>`;
 radii.forEach((k,i)=>{body+=`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R*k)}" fill="${L[i]}" clip-path="url(#L)"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R*k)}" fill="${Rr[i]}" clip-path="url(#R)"/>`;});
 body+=`<path d="M${f(w*.2)} ${f(h*.76)}H${f(w*.8)}Q${f(w*.7)} ${f(h*.85)} ${f(w*.5)} ${f(h*.87)}Q${f(w*.3)} ${f(h*.85)} ${f(w*.2)} ${f(h*.76)}Z" fill="#f7f6f2"/>`;
 return{defs,body};}
function mosaic(r,p,w,h,o={}){const cols=o.grain||11,rows=o.grain?Math.round(o.grain*h/w):15,cw=w/cols,ch=h/rows;let body='';
 for(let j=0;j<rows;j++)for(let i=0;i<=(cols-1)/2;i++){if(r()<.38)continue;const acc=r()<.07;
  for(const ii of(i===cols-1-i?[i]:[i,cols-1-i])){const s=Math.min(cw,ch)*(.55+r()*.3),cx=(ii+.5)*cw+(r()-.5)*cw*.14,cy=(j+.5)*ch+(r()-.5)*ch*.14;
   body+=`<rect x="${f(-s/2)}" y="${f(-s/2)}" width="${f(s)}" height="${f(s*(.85+r()*.2))}" rx="${f(s*.08)}" fill="${acc?p.accent:p.light}" opacity="${f(.78+r()*.22)}" transform="translate(${f(cx)} ${f(cy)}) rotate(${f((r()-.5)*10)})"/>`;}}
 return{defs:'',body,bg:p.dark};}
function blob(r,p,w,h){const m=Math.min(w,h),cx=w*(.4+r()*.2),cy=h*(.5+r()*.1),R=m*.3*(w>h?1.2:1);
 const defs=`<radialGradient id="halo"><stop offset=".55" stop-color="${p.accent}"/><stop offset="1" stop-color="${p.accent}" stop-opacity="0"/></radialGradient>`;
 let body=`<circle cx="${f(cx-R*.15)}" cy="${f(cy-R*.2)}" r="${f(R*1.1)}" fill="url(#halo)"/>`;
 for(let k=0;k<3;k++){const n=11+Math.floor(r()*5),ox=cx+(r()-.5)*R*1.1,oy=cy+(r()-.4)*R*1.2,rr=R*(k?.35+r()*.3:.85),pts=[];
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2,d=rr*(.7+r()*.45);pts.push(`${f(ox+Math.cos(a)*d)},${f(oy+Math.sin(a)*d*1.2)}`);}
  body+=`<polygon points="${pts.join(' ')}" fill="${p.dark}" stroke="${p.dark}" stroke-width="${f(rr*.04)}" stroke-linejoin="round"/>`;}
 return{defs,body};}
function diagonals(r,p,w,h){const cols=4,rows=5,cs=Math.min(w/(cols+.6),h/(rows+.6)),ox=(w-cols*cs)/2,oy=(h-rows*cs)/2;
 const tri=[[[0,0],[1,0],[0,1]],[[0,0],[1,0],[1,1]],[[1,0],[1,1],[0,1]],[[0,0],[1,1],[0,1]]];let body='';
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const t=r(),x=ox+i*cs,y=oy+j*cs;
  if(t<.25)body+=`<rect x="${f(x+cs*.1)}" y="${f(y+cs*.1)}" width="${f(cs*.62)}" height="${f(cs*.62)}" fill="${p.accent}"/>`;
  else if(t<.8)body+=`<polygon points="${tri[Math.floor(r()*4)].map(([a,b])=>`${f(x+a*cs)},${f(y+b*cs)}`).join(' ')}" fill="${p.dark}"/>`;}
 return{defs:'',body};}
function steps(r,p,w,h){const n=4+Math.floor(r()*3),bw=w*.7/n,x0=w*.15,base=h*.85;let defs='',body='';
 for(let i=0;i<n;i++){const hh=h*(.14+(i+1)/n*.5+r()*.05),flip=r()<.35,id='s'+i;
  const stops=flip?[p.light,p.accent,'#000']:['#000',p.accent,p.light];
  defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map((c,k)=>`<stop offset="${k/2}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  body+=`<rect x="${f(x0+i*bw)}" y="${f(base-hh)}" width="${f(bw)}" height="${f(hh)}" fill="url(#${id})"/>`;}
 return{defs,body,bg:p.dark};}
function fangor(r, p, w, h, o = {}) {
  const m = Math.min(w, h), n = 6 + Math.floor(r() * 4), jx = r(), jy = r();
  const cx = w * (o.x ?? (.4 + jx * .2)), cy = h * (o.y ?? (.4 + jy * .2));
  const rx = m * (.3 + r() * .12) * (w > h ? 1.15 : 1) * (o.size ?? 1), ry = rx * (r() < .5 ? 1 : .62 + r() * .3);
  const cyc = [0, 1, 0, 2, 1, 3].map(i => p.inks[i % p.inks.length]), last = cyc[(n - 1) % 6];
  const stops = [[0, p.light, 1], [.07, p.light, 1]];
  for (let i = 0; i < n; i++) stops.push([.14 + i * (.66 / (n - 1)), cyc[i % 6], 1]);
  stops.push([.9, last, .95], [1, last, 0]);
  const g = stops.map(([off, c, a]) => `<stop offset="${f(off)}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
  const dx = rx * .07 * (r() < .5 ? -1 : 1), dy = ry * .05 * (r() < .5 ? -1 : 1);
  // a faint, slightly larger echo behind the main disc makes the edge vibrate
  const body = `<ellipse transform="rotate(${o.angle ?? 0} ${f(cx)} ${f(cy)})" cx="${f(cx + dx)}" cy="${f(cy + dy)}" rx="${f(rx * 1.08)}" ry="${f(ry * 1.08)}" fill="url(#fr)" opacity=".22"/>` +
    `<ellipse transform="rotate(${o.angle ?? 0} ${f(cx)} ${f(cy)})" cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#fr)"/>`;
  return { defs: `<radialGradient id="fr">${g}</radialGradient>`, body };
}
// one soft-edged ring on a flat ground. inks run from the centre out: [hole, band, band, ..., halo];
// neighbouring inks blend, the halo fades into the paper
function ring(r, p, w, h, o = {}) {
  const n = p.inks.length, m = Math.min(w, h), bands = n - 2;
  const jx = r(), jy = r(), cx = w * (o.x ?? (.5 + (jx - .5) * .08)), cy = h * (o.y ?? (.5 + (jy - .5) * .08)), rs = r(), R = m * .41 * (o.size ?? (.7 + rs * .7));
  const hs = p.core || (.1 + r() * .12), lo = hs + .12, hi = p.core ? .84 : .78, stops = [[0, p.inks[0], 1], [hs, p.inks[0], 1]];
  for (let i = 0; i < bands; i++) {
    const c = lo + (i + .5) * (hi - lo) / bands;
    stops.push([c - .03, p.inks[1 + i], 1], [c + .03, p.inks[1 + i], 1]);
  }
  stops.push([hi + .1, p.inks[n - 1], .95], [1, p.inks[n - 1], 0]);
  const g = stops.map(([o, c, a]) => `<stop offset="${f(o)}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
  return { defs: `<radialGradient id="ring">${g}</radialGradient>`, body: `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 1.15)}" fill="url(#ring)"/>` };
}

// flowing wavy bands with soft edges (Fangor's wave paintings). The picture is painted as stacked half-planes:
// ink 0 fills the canvas, then each next ink covers everything beyond its boundary. Every boundary is the same
// wavy curve, shifted along v, and drawn K times with a smoothstep spread so its edge fades in an S curve.
// Shifting one curve (instead of offsetting it with a wide stroke) means the edges never pinch into cusps.
function dream(r, p, w, h, o = {}) {
  const k = o.size ?? 1, D = Math.hypot(w, h), m = Math.min(w, h), n = p.inks.length;
  const dpick = [-38, -22, 0, 90, 28, -62][Math.floor(r() * 6)], deg = o.angle ?? dpick;
  const lam = m * (.75 + r() * .7) * k * (o.wave ?? 1), A = m * (.06 + r() * .09) * k * (o.amp ?? 1), ph = r() * 6.28, ph2 = r() * 6.28;
  const cx = w * (o.x ?? .5), cy = h * (o.y ?? .5), widths = p.inks.map(() => .7 + r() * .8);
  const sum = widths.reduce((a, b) => a + b, 0), span = D * .9 * k, R = D / 2 + 100, FAR = D * 1.5, N = 28, K = 40, ALPHA = .1;
  const wave = u => A * Math.sin(2 * Math.PI * u / lam + ph) + A * .12 * Math.sin(2 * Math.PI * u / (lam * .6) + ph2);
  const q = [];
  for (let i = 0; i <= N; i++) { const u = -R + 2 * R * i / N; q.push([u, wave(u)]); }
  let d = `M${f(q[0][0])} ${f(q[0][1])}`;   // Catmull-Rom through the points, written as cubic beziers
  for (let i = 0; i < N; i++) {
    const p0 = q[i - 1] || q[i], p1 = q[i], p2 = q[i + 1], p3 = q[i + 2] || p2;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  d += `L${f(R)} ${f(FAR)}L${f(-R)} ${f(FAR)}Z`;
  const lum = c => { const x = parseInt(c.slice(1), 16); return (x >> 16) * .3 + ((x >> 8) & 255) * .59 + (x & 255) * .11; };
  const darkest = p.inks.reduce((bi, c, i) => (lum(c) < lum(p.inks[bi]) ? i : bi), 0);
  const layers = (at, soft, color) => {
    let s = '';
    for (let j = 0; j < K; j++) {
      const t = j / (K - 1), e = t * t * (3 - 2 * t);
      s += `<use xlink:href="#hp" transform="translate(${f(cx)} ${f(cy)}) rotate(${deg}) translate(0 ${f(at + soft * (1 - 2 * e))})" fill="${color}" fill-opacity="${ALPHA}"/>`;
    }
    return s;
  };
  let body = '', pos = -span / 2 + span * widths[0] / sum;
  for (let i = 1; i < n; i++) {
    const bw = span * widths[i] / sum, soft = Math.min(bw * 1.1, bw * (.25 + r() * .35) * (p.soft || 1) * (o.softness ?? 1)), gw = bw * .14;
    if (p.glow && (i === darkest || i - 1 === darkest)) body += layers(pos - gw, soft, p.glow);
    body += layers(pos, soft, p.inks[i]);
    pos += bw;
  }
  return { defs: `<clipPath id="dc"><rect width="${w}" height="${h}"/></clipPath><path id="hp" d="${d}"/>`, body: `<g clip-path="url(#dc)">${body}</g>`, bg: p.inks[0] };
}

// nested soft-edged squares (Fangor's pulsating squares, Stanczak). inks run from the centre out: [hole, bands..., halo]
function squares(r, p, w, h, o = {}) {
  const n = p.inks.length, m = Math.min(w, h), K = 22, ALPHA = .11;
  const jx = r(), jy = r(), rs = r(), rr = r(), hr = r();
  const cx = w * (o.x ?? (.5 + (jx - .5) * .08)), cy = h * (o.y ?? (.5 + (jy - .5) * .08));
  const Rb = m * .41 * (o.size ?? (.75 + rs * .5)), rnd = o.round ?? (.04 + rr * .12), hs = o.hole ?? (.1 + hr * .12), sf = o.soft ?? 1;
  let body = '';
  for (let i = n - 1; i >= 0; i--) {
    const half = Rb * (i === 0 ? hs : hs + (1 - hs) * (i / (n - 1)));
    const soft = Math.min(half * .95, Rb * (i === n - 1 ? .16 : i === 0 ? .05 : .09) * sf);
    for (let j = 0; j < K; j++) {
      const t = j / (K - 1), e = t * t * (3 - 2 * t), hh = half + soft * (1 - 2 * e);
      body += `<rect x="${f(cx - hh)}" y="${f(cy - hh)}" width="${f(2 * hh)}" height="${f(2 * hh)}" rx="${f(Math.min(hh, rnd * 2 * hh))}" fill="${p.inks[i]}" fill-opacity="${ALPHA}"/>`;
    }
  }
  return { defs: '', body: `<g transform="rotate(${o.angle ?? 0} ${f(cx)} ${f(cy)})">${body}</g>` };
}

// Stanczak style op art: hard-edged stripes that follow a wave. Every boundary is a half-plane with its own phase,
// painted in order, so the stripes breathe wider and narrower across the picture.
function stripewave(r, p, w, h, o = {}) {
  const m = Math.min(w, h), D = Math.hypot(w, h), n = p.inks.length;
  const dpick = [-30, 0, 90, 20, -60, 45][Math.floor(r() * 6)], deg = o.angle ?? dpick;
  const sw = m * (.04 + r() * .04) * (o.width ?? 1);
  const lam = m * (.7 + r() * .6) * (o.wave ?? 1), A = m * (.04 + r() * .06) * (o.amp ?? 1), ph = r() * 6.28, dr = o.drift ?? (.1 + r() * .25);
  const R = D / 2 + 100, FAR = D * 1.5, N = 24, count = Math.ceil(D / sw) + 3;
  let defs = '', body = '', v = -D / 2 - sw;
  for (let j = 0; j < count; j++) {
    const a = A * (1 + .5 * Math.sin(j * .35)), q = [];
    for (let i = 0; i <= N; i++) { const u = -R + 2 * R * i / N; q.push([u, a * Math.sin(2 * Math.PI * u / lam + ph + j * dr)]); }
    let d = `M${f(q[0][0])} ${f(q[0][1])}`;
    for (let i = 0; i < N; i++) {
      const p0 = q[i - 1] || q[i], p1 = q[i], p2 = q[i + 1], p3 = q[i + 2] || p2;
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    defs += `<path id="s${j}" d="${d}L${f(R)} ${f(FAR)}L${f(-R)} ${f(FAR)}Z"/>`;
    body += `<use xlink:href="#s${j}" transform="translate(${f(w / 2)} ${f(h / 2)}) rotate(${deg}) translate(0 ${f(v)})" fill="${p.inks[j % n]}"/>`;
    v += sw;
  }
  return { defs: `<clipPath id="sc"><rect width="${w}" height="${h}"/></clipPath>` + defs, body: `<g clip-path="url(#sc)">${body}</g>`, bg: p.inks[0] };
}
MOTIF_OPTS.stripewave = [
  { key: 'width', label: 'Stripe width', min: .5, max: 2.5, step: .01, def: 1 },
  { key: 'amp', label: 'Wave height', min: .2, max: 3, step: .01, def: 1 },
  { key: 'wave', label: 'Wave length', min: .5, max: 2, step: .01, def: 1 },
  { key: 'drift', label: 'Drift', min: 0, max: .8, step: .01, def: .2 },
  { key: 'angle', label: 'Rotate', min: 0, max: 360, step: 1, def: 0 },
];

// Zamecznik's sound drawings: stacked oscillogram zigzags on a dark ground, or rings spreading from a point
function scope(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), c4 = r(), c5 = r(), c6 = r();
  const n = Math.round(o.lines ?? 6 + c1 * 10), tf = Math.round(o.freq ?? 18 + c5 * 30), ampk = o.amp ?? 1;
  const sw = Math.min(w, h) * .0042 * (o.weight ?? 1), acc = Math.floor(c2 * n);
  const g = (x, c, wd) => Math.exp(-((x - c) ** 2) / (2 * wd * wd));
  let body = '';
  if ((o.rings ?? 0) >= .5) {
    const cx = w * (.35 + c3 * .3), cy = h * (.38 + c4 * .24), Rmax = Math.hypot(w, h) * .62, m = n * 2 + 4;
    for (let k = 1; k <= m; k++) {
      const t = k / m, hit = k === (acc % m) + 1;
      body += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(Rmax * t)}" fill="none" stroke="${hit ? p.accent : p.light}" stroke-width="${f(sw * (.5 + 2.4 * g(t, c3, .22 + c6 * .15)) * (hit ? 2 : 1))}"/>`;
    }
    return { defs: '', body, bg: p.dark };
  }
  const gap = h / (n + 1), steps = tf * 2;
  for (let k = 0; k < n; k++) {
    const y0 = gap * (k + 1), cA = c3 + k * (c4 - .5) * .08, cB = c6 + k * .02;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, env = Math.min(1, .12 + g(t, cA, .12 + c5 * .1) + .6 * g(t, cB, .08));
      d += (i ? 'L' : 'M') + f(w * (.06 + .88 * t)) + ' ' + f(y0 + (i % 2 ? 1 : -1) * gap * .46 * ampk * env);
    }
    body += `<path d="${d}" fill="none" stroke="${k === acc ? p.accent : p.light}" stroke-width="${f(k === acc ? sw * 2.2 : sw)}" stroke-linejoin="miter"/>`;
  }
  return { defs: '', body, bg: p.dark };
}
MOTIF_OPTS.scope = [
  { key: 'lines', label: 'Lines', min: 3, max: 30, step: 1, def: 10 },
  { key: 'freq', label: 'Frequency', min: 6, max: 80, step: 1, def: 30 },
  { key: 'amp', label: 'Amplitude', min: .2, max: 2.5, step: .01, def: 1 },
  { key: 'weight', label: 'Line weight', min: .4, max: 3, step: .01, def: 1 },
  { key: 'rings', label: 'Rings mode', min: 0, max: 1, step: 1, def: 0 },
];

// Zamecznik's 1961 film poster: vertical stripes in one half, horizontal in the other, a big solid disc on top
// with a few bars cut into it. Stripe pairs are ink / paper, bars use the accent.
function stripedisc(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), c4 = r(), c5 = r();
  const m = Math.min(w, h), sw = m * (.026 + c1 * .03) * (o.width ?? 1), split = h * (.42 + c2 * .16);
  const R = m * (.26 + c3 * .12) * (o.disc ?? 1), cx = w * (o.x ?? .5), cy = h * (o.y ?? (.4 + c4 * .2));
  const bars = Math.round(o.bars ?? 3 + Math.floor(c5 * 5));
  const ink = p.dark, paper = p.paper, acc = p.accent;
  let body = `<defs></defs>`;
  const defs = `<clipPath id="sd"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/></clipPath>`;
  for (let x = 0; x < w; x += sw * 2) body += `<rect x="${f(x)}" y="0" width="${f(sw)}" height="${f(split)}" fill="${ink}"/>`;
  for (let y = split; y < h; y += sw * 2) body += `<rect x="0" y="${f(y)}" width="${f(w)}" height="${f(sw)}" fill="${ink}"/>`;
  body += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="${ink}"/><g clip-path="url(#sd)">`;
  const by = cy + R * .1, bh = (R * .9) / (bars * 2);
  for (let k = 0; k < bars; k++) body += `<rect x="${f(cx - R)}" y="${f(by + k * bh * 2)}" width="${f(2 * R)}" height="${f(bh)}" fill="${acc}"/>`;
  return { defs, body: body + '</g>', bg: paper };
}
MOTIF_OPTS.stripedisc = [
  { key: 'width', label: 'Stripe width', min: .5, max: 2.5, step: .01, def: 1 },
  { key: 'disc', label: 'Disc size', min: .4, max: 1.8, step: .01, def: 1 },
  { key: 'bars', label: 'Disc bars', min: 0, max: 12, step: 1, def: 4 },
  { key: 'x', label: 'Disc x', min: 0, max: 1, step: .005, def: .5 },
  { key: 'y', label: 'Disc y', min: 0, max: 1, step: .005, def: .5 },
];

// Constructivist composition (Szczuka, Zarnower, Strzeminski): grid-snapped bars, discs, a diagonal and rules
function construct(r, p, w, h, o = {}) {
  const gx = Math.round(o.grid ?? 6 + Math.floor(r() * 4)), n = Math.round(o.count ?? 9 + Math.floor(r() * 8));
  const cell = w / gx, gy = Math.round(h / cell), H = gy * cell;
  const pick = () => { const t = r(); return t < .5 ? p.dark : t < .9 ? p.accent : p.light; };
  const gxy = () => [Math.floor(r() * (gx + 1)) * cell, Math.floor(r() * (gy + 1)) * cell];
  let body = '';
  const dR = (1.2 + r() * 1.8) * cell, dx = (1 + Math.floor(r() * (gx - 1))) * cell, dy = (1 + Math.floor(r() * (gy - 1))) * cell;
  body += `<circle cx="${f(dx)}" cy="${f(dy)}" r="${f(dR)}" fill="${p.accent}"/>`;
  {
    const ax = Math.floor(r() * gx) * cell, ay = Math.floor(r() * gy * .5) * cell, L = (3 + Math.floor(r() * 4)) * cell, tw = cell * .55, sl = r() < .5 ? 1 : -1;
    const x2 = ax + L, y2 = ay + sl * L, k2 = Math.hypot(x2 - ax, y2 - ay), nx = (y2 - ay) / k2 * tw / 2, ny = -(x2 - ax) / k2 * tw / 2;
    body += `<polygon points="${f(ax + nx)},${f(ay + ny)} ${f(x2 + nx)},${f(y2 + ny)} ${f(x2 - nx)},${f(y2 - ny)} ${f(ax - nx)},${f(ay - ny)}" fill="${p.dark}"/>`;
  }
  for (let k = 0; k < n; k++) {
    const t = r(), c = pick();
    if (t < .25) {                                   // horizontal bar
      const [x, y] = gxy(), len = (3 + Math.floor(r() * (gx - 2))) * cell, th = cell * [.12, .45, .9, 1.4][Math.floor(r() * 4)];
      body += `<rect x="${f(x)}" y="${f(y)}" width="${f(len)}" height="${f(th)}" fill="${c}"/>`;
    } else if (t < .5) {                             // vertical bar
      const [x, y] = gxy(), len = (3 + Math.floor(r() * (gy - 2))) * cell, th = cell * [.12, .45, .9, 1.4][Math.floor(r() * 4)];
      body += `<rect x="${f(x)}" y="${f(y)}" width="${f(th)}" height="${f(len)}" fill="${c}"/>`;
    } else if (t < .65) {                            // diagonal bar
      const [x, y] = gxy(), L = (2 + Math.floor(r() * 4)) * cell, sl = r() < .5 ? 1 : -1, tw = cell * (.2 + r() * .4);
      const x2 = x + L, y2 = y + sl * L * (r() < .5 ? 1 : .5), nx = (y2 - y) / Math.hypot(x2 - x, y2 - y) * tw / 2, ny = -(x2 - x) / Math.hypot(x2 - x, y2 - y) * tw / 2;
      body += `<polygon points="${f(x + nx)},${f(y + ny)} ${f(x2 + nx)},${f(y2 + ny)} ${f(x2 - nx)},${f(y2 - ny)} ${f(x - nx)},${f(y - ny)}" fill="${c}"/>`;
    } else if (t < .77) {                            // quarter disc
      const [x, y] = gxy(), R = (1.5 + Math.floor(r() * 3)) * cell, rot = Math.floor(r() * 4) * 90;
      body += `<path d="M${f(x)} ${f(y)}L${f(x + R)} ${f(y)}A${f(R)} ${f(R)} 0 0 1 ${f(x)} ${f(y + R)}Z" fill="${c}" transform="rotate(${rot} ${f(x)} ${f(y)})"/>`;
    } else if (t < .88) {                            // square
      const [x, y] = gxy(), sd = cell * (1 + Math.floor(r() * 2));
      body += `<rect x="${f(x)}" y="${f(y)}" width="${f(sd)}" height="${f(sd)}" fill="${c}"/>`;
    } else if (t < .95) {                            // thin rule across the page
      const [x, y] = gxy(), horiz = r() < .5;
      body += horiz ? `<rect x="0" y="${f(y)}" width="${w}" height="${f(Math.max(2, cell * .05))}" fill="${p.dark}"/>` : `<rect x="${f(x)}" y="0" width="${f(Math.max(2, cell * .05))}" height="${h}" fill="${p.dark}"/>`;
    } else {                                         // triangle
      const [x, y] = gxy(), a = (1 + Math.floor(r() * 3)) * cell;
      body += `<polygon points="${f(x)},${f(y)} ${f(x + a)},${f(y)} ${f(x)},${f(y + a)}" fill="${c}"/>`;
    }
  }
  return { defs: `<clipPath id="cc"><rect width="${w}" height="${h}"/></clipPath>`, body: `<g clip-path="url(#cc)">${body}</g>`, bg: p.paper };
}
MOTIF_OPTS.construct = [
  { key: 'grid', label: 'Grid', min: 3, max: 14, step: 1, def: 7 },
  { key: 'count', label: 'Elements', min: 2, max: 20, step: 1, def: 8 },
];

// Lenica's paper cut-outs: a few big flat shapes with straight, slightly torn edges, layered with a soft paper shadow
function cutout(r, p, w, h, o = {}) {
  const m = Math.min(w, h), n = Math.round(o.count ?? 4 + Math.floor(r() * 5)), jag = o.jag ?? .5, sz = o.scale ?? 1;
  const inks = p.inks;
  let body = '', cx = w * (.45 + r() * .1), cy = h * (.5 + r() * .1), R = m * .56 * sz, prev = '';
  for (let k = 0; k < n; k++) {
    const sides = 5 + Math.floor(r() * 5), rot = r() * 6.28, pts = [];
    for (let i = 0; i < sides; i++) {
      const a = rot + i / sides * 6.28 + (r() - .5) * .5, rr = R * (.62 + r() * .38);
      pts.push([cx + Math.cos(a) * rr * (1 + (k ? 0 : .15)), cy + Math.sin(a) * rr * 1.1]);
    }
    const out = [];
    pts.forEach((a, i) => {
      const b = pts[(i + 1) % pts.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      out.push(a);
      for (let j = 1; j <= 2; j++) {
        const t = j / 3, off = (r() - .5) * len * .09 * jag, nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
        if (jag > .02) out.push([a[0] + (b[0] - a[0]) * t + nx * off, a[1] + (b[1] - a[1]) * t + ny * off]);
      }
    });
    let c; do { c = inks[Math.floor(r() * inks.length)]; } while (c === prev && inks.length > 1);
    prev = c;
    const d = out.map(q => `${f(q[0])},${f(q[1])}`).join(' ');
    body += `<polygon points="${out.map(q => `${f(q[0] + m * .008)},${f(q[1] + m * .012)}`).join(' ')}" fill="#000" fill-opacity=".22"/><polygon points="${d}" fill="${c}"/>`;
    cx += (r() - .5) * R * 1.7; cy += (r() - .5) * R * 1.7; R *= .8 + r() * .12;
    cx = Math.min(w * .85, Math.max(w * .15, cx)); cy = Math.min(h * .85, Math.max(h * .15, cy));
  }
  return { defs: '', body, bg: p.paper };
}
MOTIF_OPTS.cutout = [
  { key: 'count', label: 'Shapes', min: 2, max: 14, step: 1, def: 6 },
  { key: 'jag', label: 'Ragged edge', min: 0, max: 1.5, step: .01, def: .5 },
  { key: 'scale', label: 'Size', min: .5, max: 1.6, step: .01, def: 1 },
];

// Rhythm bars (Swierzy, music and jazz posters): vertical bars of changing height in a color sequence on a gradient ground
function bars(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), c4 = r();
  const n = Math.round(o.count ?? 10 + c1 * 14), rh = o.rhythm ?? (.3 + c2 * .6), ph = c3 * 6.28, gap = o.gap ?? (.15 + c4 * .35), mirror = (o.mirror ?? 0) >= .5;
  const mx = w * .06, bw = (w - 2 * mx) / (n + (n - 1) * gap), step = bw * (1 + gap);
  const defs = `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.paper}"/><stop offset="1" stop-color="${p.accent}"/></linearGradient>`;
  let body = `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  for (let i = 0; i < n; i++) {
    const e = Math.abs(Math.sin(i * rh + ph)) * (.65 + .35 * Math.sin(i * rh * 2.3 + ph * 1.7)), bh = h * (.14 + .72 * e);
    const x = mx + i * step, y = mirror ? (h - bh) / 2 : h * .94 - bh;
    body += `<rect x="${f(x)}" y="${f(y)}" width="${f(bw)}" height="${f(bh)}" fill="${p.inks[i % p.inks.length]}"/>`;
  }
  return { defs, body, bg: p.paper };
}
MOTIF_OPTS.bars = [
  { key: 'count', label: 'Bars', min: 4, max: 48, step: 1, def: 16 },
  { key: 'rhythm', label: 'Rhythm', min: .1, max: 1.6, step: .01, def: .6 },
  { key: 'gap', label: 'Gap', min: 0, max: 1.2, step: .01, def: .3 },
  { key: 'mirror', label: 'Mirror', min: 0, max: 1, step: 1, def: 0 },
];

// Multiply and rotate (Zamecznik's geometric repetition): one form repeated around a centre, each copy tilted a little
function rotor(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), c4 = r(), c5 = r(), m = Math.min(w, h);
  const n = Math.round(o.copies ?? 12 + c1 * 24), tilt = o.tilt ?? (c2 - .5) * 40, form = Math.round(o.form ?? Math.floor(c3 * 3));
  const inner = m * (o.inner ?? (.07 + c4 * .13)), len = m * (o.length ?? (.2 + c5 * .22)), cx = w * (o.x ?? .5), cy = h * (o.y ?? .5);
  const bw = Math.max(m * .012, 2 * Math.PI * (inner + len * .5) / n * .5);
  let body = '';
  for (let i = 0; i < n; i++) {
    const ang = i * 360 / n, col = i % 2 ? p.accent : p.light;
    let shape;
    if (form === 0) shape = `<rect x="${f(-bw / 2)}" y="${f(-inner - len)}" width="${f(bw)}" height="${f(len)}" fill="${col}"/>`;
    else if (form === 1) shape = `<polygon points="${f(-bw)},${f(-inner)} ${f(bw)},${f(-inner)} 0,${f(-inner - len)}" fill="${col}"/>`;
    else {
      const a = (360 / n * .7) * Math.PI / 360, r1 = inner, r2 = inner + len, X = (rr, s2) => f(rr * Math.sin(s2 * a)), Y = (rr, s2) => f(-rr * Math.cos(s2 * a));
      shape = `<path d="M${X(r1, -1)} ${Y(r1, -1)}L${X(r2, -1)} ${Y(r2, -1)}A${f(r2)} ${f(r2)} 0 0 1 ${X(r2, 1)} ${Y(r2, 1)}L${X(r1, 1)} ${Y(r1, 1)}A${f(r1)} ${f(r1)} 0 0 0 ${X(r1, -1)} ${Y(r1, -1)}Z" fill="${col}"/>`;
    }
    body += `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(ang)})"><g transform="translate(0 ${f(-inner)}) rotate(${f(tilt)}) translate(0 ${f(inner)})">${shape}</g></g>`;
  }
  body += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(inner * .7)}" fill="${p.light}"/>`;
  return { defs: '', body, bg: p.dark };
}
MOTIF_OPTS.rotor = [
  { key: 'copies', label: 'Copies', min: 4, max: 64, step: 1, def: 24 },
  { key: 'tilt', label: 'Tilt', min: -70, max: 70, step: 1, def: 0 },
  { key: 'form', label: 'Form (bar, triangle, arc)', min: 0, max: 2, step: 1, def: 0 },
  { key: 'length', label: 'Length', min: .08, max: .5, step: .01, def: .3 },
  { key: 'inner', label: 'Inner radius', min: .02, max: .3, step: .01, def: .1 },
  { key: 'x', label: 'Centre x', min: 0, max: 1, step: .005, def: .5 },
  { key: 'y', label: 'Centre y', min: 0, max: 1, step: .005, def: .5 },
];

// Sunburst and rings (Hilscher and the Cyrk circus posters): rays split into rings, each ring shifted so the pattern spins
function sunburst(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), n = p.inks.length;
  const rays = Math.round(o.rays ?? 12 + Math.floor(c1 * 6) * 4), rings = Math.round(o.rings ?? 3 + Math.floor(c2 * 4)), twist = o.twist ?? (c3 - .5) * 1.4;
  const cx = w * (o.x ?? .5), cy = h * (o.y ?? .5), Rmax = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 1.02, step = 2 * Math.PI / rays;
  const pt = (rad, a) => `${f(cx + rad * Math.cos(a))} ${f(cy + rad * Math.sin(a))}`;
  let body = '';
  for (let k = 0; k < rings; k++) {
    const r1 = k === 0 ? 0 : Rmax * Math.pow(k / rings, 1.15), r2 = Rmax * Math.pow((k + 1) / rings, 1.15);
    for (let i = 0; i < rays; i++) {
      const a0 = (i + k * twist) * step - Math.PI / 2, a1 = a0 + step, col = p.inks[(i + k) % n];
      body += r1 === 0
        ? `<path d="M${f(cx)} ${f(cy)}L${pt(r2, a0)}A${f(r2)} ${f(r2)} 0 0 1 ${pt(r2, a1)}Z" fill="${col}"/>`
        : `<path d="M${pt(r1, a0)}L${pt(r2, a0)}A${f(r2)} ${f(r2)} 0 0 1 ${pt(r2, a1)}L${pt(r1, a1)}A${f(r1)} ${f(r1)} 0 0 0 ${pt(r1, a0)}Z" fill="${col}"/>`;
    }
  }
  body += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(Rmax / rings * .42)}" fill="${p.paper}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(Rmax / rings * .2)}" fill="${p.accent}"/>`;
  return { defs: `<clipPath id="sb"><rect width="${w}" height="${h}"/></clipPath>`, body: `<g clip-path="url(#sb)">${body}</g>`, bg: p.paper };
}
MOTIF_OPTS.sunburst = [
  { key: 'rays', label: 'Rays', min: 6, max: 72, step: 2, def: 24 },
  { key: 'rings', label: 'Rings', min: 1, max: 10, step: 1, def: 4 },
  { key: 'twist', label: 'Twist', min: -2, max: 2, step: .01, def: 0 },
  { key: 'x', label: 'Centre x', min: 0, max: 1, step: .005, def: .5 },
  { key: 'y', label: 'Centre y', min: 0, max: 1, step: .005, def: .5 },
];

// Mlodozeniec's outlined stains: bright flat blobs held by a thick black line, the color a little off-register
function outline(r, p, w, h, o = {}) {
  const m = Math.min(w, h), n = Math.round(o.count ?? 3 + Math.floor(r() * 4)), thick = m * .019 * (o.thick ?? 1), off = m * .016 * (o.offset ?? 1), wob = o.wobble ?? .6;
  const inks = p.inks; let body = '', prev = '';
  for (let b = 0; b < n; b++) {
    const k = 8 + Math.floor(r() * 5), R = m * (.14 + r() * .2), cx = w * (.12 + r() * .76), cy = h * (.12 + r() * .76), rot = r() * 6.28, pts = [];
    for (let i = 0; i < k; i++) { const a = rot + i / k * 6.28, rr = R * (1 + (r() - .5) * .9 * wob); pts.push([cx + Math.cos(a) * rr * 1.1, cy + Math.sin(a) * rr]); }
    let d = '';
    for (let i = 0; i < k; i++) {
      const p0 = pts[(i - 1 + k) % k], p1 = pts[i], p2 = pts[(i + 1) % k], p3 = pts[(i + 2) % k];
      if (i === 0) d += `M${f(p1[0])} ${f(p1[1])}`;
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    d += 'Z';
    let c; do { c = inks[Math.floor(r() * inks.length)]; } while (c === prev && inks.length > 1);
    prev = c;
    const ang = r() * 6.28;
    body += `<path d="${d}" fill="${c}" transform="translate(${f(Math.cos(ang) * off)} ${f(Math.sin(ang) * off)})"/><path d="${d}" fill="none" stroke="${p.dark}" stroke-width="${f(thick)}" stroke-linejoin="round"/>`;
  }
  return { defs: '', body, bg: p.paper };
}
MOTIF_OPTS.outline = [
  { key: 'count', label: 'Stains', min: 1, max: 10, step: 1, def: 4 },
  { key: 'thick', label: 'Outline', min: .3, max: 3, step: .01, def: 1 },
  { key: 'offset', label: 'Off-register', min: 0, max: 3, step: .01, def: 1 },
  { key: 'wobble', label: 'Wobble', min: 0, max: 1.5, step: .01, def: .6 },
];

// Halftone: a dot grid whose dot size follows a soft field, the print-room face of op art. Dots are zero-length round-capped
// strokes grouped into size levels, so a page of thousands of dots stays a few kilobytes.
function halftone(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), c4 = r(), m = Math.min(w, h);
  const sp = m * (o.spacing ?? (.026 + c1 * .02)), ang0 = o.angle ?? 45, field = Math.round(o.field ?? Math.floor(c2 * 3)), gain = o.gain ?? 1, duo = (o.duo ?? 0) >= .5;
  const cx = w * (.3 + c3 * .4), cy = h * (.3 + c4 * .4), L = 10;
  const fv = (x, y, inv) => {
    let t = field === 0 ? 1 - Math.min(1, Math.hypot(x - cx, y - cy) / (m * .75)) : field === 1 ? y / h : .5 + .5 * Math.sin(x / (m * .16) + Math.sin(y / (m * .22)) * 2);
    return inv ? 1 - t : t;
  };
  const layer = (angDeg, inv, color) => {
    const a = angDeg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), R = Math.hypot(w, h) / 2 / sp + 2, buckets = Array.from({ length: L }, () => '');
    for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) {
      const u = i * sp, v = j * sp, x = w / 2 + u * ca - v * sa, y = h / 2 + u * sa + v * ca;
      if (x < -sp || x > w + sp || y < -sp || y > h + sp) continue;
      const d = Math.min(1, Math.max(0, fv(x, y, inv) * gain));
      if (d < .06) continue;
      buckets[Math.round(d * (L - 1))] += `M${f(x)} ${f(y)}h0`;
    }
    return buckets.map((b, k) => b ? `<path d="${b}" stroke="${color}" stroke-width="${f(sp * .95 * k / (L - 1))}" stroke-linecap="round" fill="none"/>` : '').join('');
  };
  let body = layer(ang0, false, p.dark);
  if (duo) body += layer(ang0 + 30, true, p.accent);
  return { defs: '', body, bg: p.paper };
}
MOTIF_OPTS.halftone = [
  { key: 'spacing', label: 'Dot spacing', min: .012, max: .08, step: .001, def: .035 },
  { key: 'angle', label: 'Grid angle', min: 0, max: 90, step: 1, def: 45 },
  { key: 'field', label: 'Field (radial, linear, wave)', min: 0, max: 2, step: 1, def: 0 },
  { key: 'gain', label: 'Contrast', min: .4, max: 1.8, step: .01, def: 1 },
  { key: 'duo', label: 'Second ink', min: 0, max: 1, step: 1, def: 0 },
];

// Moire: two fine gratings (lines or rings) laid over each other at a small offset, the interference does the drawing
function moire(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), c4 = r(), m = Math.min(w, h), cx = w / 2, cy = h / 2;
  const sp = m * (o.spacing ?? (.008 + c1 * .006)), diff = o.diff ?? (2 + c2 * 8), mode = Math.round(o.mode ?? Math.floor(c3 * 3));
  const ang = o.angle ?? c4 * 180, sw = f(sp * .36 * (o.weight ?? 1)), duo = (o.duo ?? 0) >= .5, D = Math.hypot(w, h) / 2 + sp * 2;
  const lines = (a, col) => {
    let d = '';
    for (let y = -D; y <= D; y += sp) d += `M${f(-D)} ${f(y)}H${f(D)}`;
    return `<path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none" transform="translate(${f(cx)} ${f(cy)}) rotate(${f(a)})"/>`;
  };
  const rings = (x, y, col) => {
    let d = '';
    for (let rad = sp; rad <= D * 1.2; rad += sp) d += `M${f(x + rad)} ${f(y)}a${f(rad)} ${f(rad)} 0 1 0 ${f(-2 * rad)} 0a${f(rad)} ${f(rad)} 0 1 0 ${f(2 * rad)} 0`;
    return `<path d="${d}" stroke="${col}" stroke-width="${sw}" fill="none"/>`;
  };
  const second = duo ? p.accent : p.dark;
  let body = '';
  if (mode === 0) body = lines(ang, p.dark) + lines(ang + diff, second);
  else if (mode === 1) body = rings(cx, cy, p.dark) + rings(cx + sp * (3 + diff), cy + sp * diff, second);
  else body = lines(ang, p.dark) + rings(cx, cy, second);
  return { defs: `<clipPath id="mo"><rect width="${w}" height="${h}"/></clipPath>`, body: `<g clip-path="url(#mo)">${body}</g>`, bg: p.paper };
}
MOTIF_OPTS.moire = [
  { key: 'spacing', label: 'Line spacing', min: .004, max: .03, step: .0005, def: .011 },
  { key: 'diff', label: 'Offset', min: .3, max: 20, step: .1, def: 5 },
  { key: 'mode', label: 'Mode (lines, rings, mixed)', min: 0, max: 2, step: 1, def: 0 },
  { key: 'angle', label: 'Angle', min: 0, max: 180, step: 1, def: 0 },
  { key: 'weight', label: 'Line weight', min: .4, max: 2, step: .01, def: 1 },
  { key: 'duo', label: 'Second ink', min: 0, max: 1, step: 1, def: 0 },
];

// Block letters (after Miller's typography built like architecture): a word set in a 5 by 7 grid of square blocks,
// stacked or in a row, with constructivist bars behind it. The font is drawn from nothing, no typeface involved.
const BLOCK_FONT = {
  A: '01110 10001 10001 11111 10001 10001 10001', C: '01111 10000 10000 10000 10000 10000 01111', D: '11110 10001 10001 10001 10001 10001 11110',
  E: '11111 10000 10000 11110 10000 10000 11111', F: '11111 10000 10000 11110 10000 10000 10000', I: '11111 00100 00100 00100 00100 00100 11111',
  K: '10001 10010 10100 11000 10100 10010 10001', L: '10000 10000 10000 10000 10000 10000 11111', M: '10001 11011 10101 10101 10001 10001 10001',
  N: '10001 11001 10101 10011 10001 10001 10001', O: '01110 10001 10001 10001 10001 10001 01110', P: '11110 10001 10001 11110 10000 10000 10000',
  R: '11110 10001 10001 11110 10100 10010 10001', S: '01111 10000 10000 01110 00001 00001 11110', T: '11111 00100 00100 00100 00100 00100 00100',
  U: '10001 10001 10001 10001 10001 10001 01110', Y: '10001 10001 01010 00100 00100 00100 00100', Z: '11111 00001 00010 00100 01000 10000 11111',
};
const BLOCK_WORDS = ['PLAKAT', 'FORMA', 'RYTM', 'KOLOR', 'LINIA', 'OKO', 'SZTUKA', 'POLSKA'];
function letters(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), c4 = r(), m = Math.min(w, h);
  const word = BLOCK_WORDS[Math.min(BLOCK_WORDS.length - 1, Math.round(o.word ?? Math.floor(c1 * BLOCK_WORDS.length)))], n = word.length;
  const layout = Math.round(o.layout ?? (c2 < .2 ? 0 : c2 < .55 ? 1 : 2)), sc = o.scale ?? 1, gap = o.gap ?? .08;
  const lines = layout === 0 ? [word] : layout === 1 ? [...word] : [word.slice(0, Math.ceil(n / 2)), word.slice(Math.ceil(n / 2))];
  const cols = Math.max(...lines.map(l => l.length)) * 6 - 1, rows = lines.length * 8 - 1;
  const u = Math.min(w * .86 / cols, h * .86 / rows) * sc;
  const cx = w * (o.x ?? (.46 + c3 * .08)), cy = h * (o.y ?? (.46 + c4 * .08)), ang = o.angle ?? 0;
  const ink = p.dark === p.paper ? p.light : p.dark, alt = p.accent === p.paper ? p.light : p.accent;
  let bars = '';
  const nb = Math.round(o.bars ?? 3);
  for (let k = 0; k < 6; k++) {
    const t = r(), a = r(), b2 = r(), c = r();
    if (k >= nb) continue;
    const col = t < .5 ? alt : ink, th = m * (.02 + a * .09);
    bars += (b2 < .5)
      ? `<rect x="${f(w * (c * .6 - .1))}" y="${f(h * (a * .9))}" width="${f(w * (.5 + b2))}" height="${f(th)}" fill="${col}"/>`
      : `<rect x="${f(w * (a * .9))}" y="${f(h * (c * .6 - .1))}" width="${f(th)}" height="${f(h * (.5 + b2 * .4))}" fill="${col}"/>`;
  }
  let body = '';
  const ox = -cols * u / 2, oy = -rows * u / 2;
  lines.forEach((line, li) => {
    const lw = line.length * 6 - 1, shift = (cols - lw) / 2;
    [...line].forEach((ch, i) => {
      const col = (li + i) % 2 ? alt : ink;
      BLOCK_FONT[ch].split(' ').forEach((row, y) => [...row].forEach((v, x) => {
        if (v === '1') body += `<rect x="${f(ox + (shift + i * 6 + x) * u + u * gap / 2)}" y="${f(oy + (li * 8 + y) * u + u * gap / 2)}" width="${f(u * (1 - gap))}" height="${f(u * (1 - gap))}" fill="${col}"/>`;
      }));
    });
  });
  return { defs: `<clipPath id="bl"><rect width="${w}" height="${h}"/></clipPath>`, body: `<g clip-path="url(#bl)">${bars}<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(ang)})">${body}</g></g>`, bg: p.paper };
}
MOTIF_OPTS.letters = [
  { key: 'word', label: 'Word (0 to 7)', min: 0, max: 7, step: 1, def: 0 },
  { key: 'layout', label: 'Layout (row, stack, 2 lines)', min: 0, max: 2, step: 1, def: 2 },
  { key: 'scale', label: 'Size', min: .4, max: 1.4, step: .01, def: 1 },
  { key: 'gap', label: 'Block gap', min: 0, max: .4, step: .01, def: .08 },
  { key: 'bars', label: 'Bars', min: 0, max: 6, step: 1, def: 3 },
  { key: 'angle', label: 'Rotate', min: 0, max: 360, step: 1, def: 0 },
  { key: 'x', label: 'Centre x', min: 0, max: 1, step: .005, def: .5 },
  { key: 'y', label: 'Centre y', min: 0, max: 1, step: .005, def: .5 },
];

// Unism (Strzeminski): dense fine parallel bands whose thickness follows one smooth modulation, so a single rhythm carries the whole picture
function unism(r, p, w, h, o = {}) {
  const c1 = r(), c2 = r(), c3 = r(), c4 = r(), c5 = r(), m = Math.min(w, h), D = Math.hypot(w, h);
  const lines = Math.round(o.lines ?? 40 + c1 * 40), field = Math.round(o.field ?? Math.floor(c2 * 4)), gain = o.contrast ?? 1, duo = (o.duo ?? 0) >= .5;
  const ang = o.angle ?? [0, 90, 45, 135][Math.floor(c3 * 4)], a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  const cx = w * (.3 + c4 * .4), cy = h * (.3 + c5 * .4), pitch = m / lines, K = Math.ceil(D / pitch / 2) + 1, S = 30, q = v => Math.round(v * 10) / 10;
  const t = (X, Y) => field === 0 ? 1 - Math.min(1, Math.hypot(X - cx, Y - cy) / (m * .7))
    : field === 1 ? Y / h : field === 2 ? .5 + .5 * Math.sin(X / (m * .17) + Math.sin(Y / (m * .2)) * 2) : .5 + .5 * Math.cos(Math.hypot(X - cx, Y - cy) / (m * .1));
  const band = (k, inv) => {
    const top = [], bot = [], y0 = k * pitch;
    for (let i = 0; i <= S; i++) {
      const x = -D / 2 + D * i / S, X = w / 2 + x * ca - y0 * sa, Y = h / 2 + x * sa + y0 * ca;
      let v = Math.min(1, Math.max(0, t(X, Y))); if (inv) v = 1 - v;
      const th = pitch * Math.min(.98, .05 + .93 * v * gain);
      top.push(`${q(x)} ${q(y0 - th / 2)}`); bot.push(`${q(x)} ${q(y0 + th / 2)}`);
    }
    return `M${top.join('L')}L${bot.reverse().join('L')}Z`;
  };
  let d1 = '', d2 = '';
  for (let k = -K; k <= K; k++) { if (duo && k % 2) d2 += band(k, true); else d1 += band(k, false); }
  const g = (d, col) => d ? `<path d="${d}" fill="${col}" transform="translate(${f(w / 2)} ${f(h / 2)}) rotate(${f(ang)})"/>` : '';
  return { defs: `<clipPath id="un"><rect width="${w}" height="${h}"/></clipPath>`, body: `<g clip-path="url(#un)">${g(d1, p.dark)}${g(d2, p.accent)}</g>`, bg: p.paper };
}
MOTIF_OPTS.unism = [
  { key: 'lines', label: 'Lines', min: 16, max: 140, step: 1, def: 60 },
  { key: 'field', label: 'Field (radial, linear, wave, rings)', min: 0, max: 3, step: 1, def: 0 },
  { key: 'contrast', label: 'Contrast', min: .4, max: 1.6, step: .01, def: 1 },
  { key: 'angle', label: 'Angle', min: 0, max: 180, step: 1, def: 0 },
  { key: 'duo', label: 'Second ink', min: 0, max: 1, step: 1, def: 0 },
];

// random harmonious palettes. kind: 'poster', 'random' (Fangor discs), 'ring' (inks run hole, bands..., halo) or 'dream'
function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), g = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const x = v => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + x(g(0)) + x(g(8)) + x(g(4));
}
function randomPalette(kind, rnd = Math.random) {
  const R = (a, b) => a + rnd() * (b - a), h0 = R(0, 360), step = R(40, 140) * (rnd() < .5 ? 1 : -1);
  if (kind === 'ring') {
    const n = 2 + Math.floor(rnd() * 2), core = rnd() < .22;
    const paper = hsl(h0 + R(-20, 20), R(5, 25), R(90, 97));
    const inks = [core ? hsl(h0, R(80, 95), R(48, 56)) : hsl(h0 + R(-20, 20), R(10, 35), R(92, 98))];
    for (let i = 0; i < n; i++) inks.push(hsl(h0 + step * (i + 1) + R(-12, 12), R(55, 90), i === n - 1 && rnd() < .6 ? R(12, 28) : R(32, 62)));
    inks.push(hsl(h0 + step * (n + 1) + R(-15, 15), R(65, 90), R(55, 70)));
    return { paper, dark: inks[inks.length - 2], light: inks[0], accent: inks[1], inks, core: core ? .5 : undefined };
  }
  if (kind === 'dream') {
    const n = 4 + Math.floor(rnd() * 3), inks = [];
    for (let i = 0; i < n; i++) inks.push(hsl(h0 + i * step * .6 + R(-15, 15), R(55, 92), R(26, 66)));
    return { paper: inks[0], dark: inks[1], light: inks[2], accent: inks[3], glow: rnd() < .4 ? hsl(h0 + R(150, 210), 85, 50) : undefined, inks };
  }
  const gap = R(35, 90), inks = Array.from({ length: 5 }, (_, i) => hsl(h0 + i * gap, R(45, 85), R(38, 62)));
  return { paper: hsl(h0, R(10, 30), R(84, 93)), dark: hsl(h0 + 180, R(25, 45), R(8, 16)), light: hsl(h0, R(30, 60), R(86, 94)), accent: hsl(h0 + R(150, 210), R(70, 90), R(50, 58)), inks };
}

MOTIF_OPTS.squares=[{key:'round',label:'Corners',min:0,max:.5,step:.01,def:.1},{key:'hole',label:'Centre',min:.04,max:.45,step:.01,def:.15},{key:'soft',label:'Softness',min:.2,max:2.5,step:.01,def:1}];
const MOTIFS={stripes,rings,mosaic,blob,diagonals,steps,fangor,ring,squares,dream,stripewave,scope,stripedisc,construct,cutout,bars,rotor,sunburst,outline,halftone,moire,letters,unism};
// settings every poster motif accepts
const GLOBAL_OPTS=[{key:'misreg',label:'Off-register print',min:0,max:6,step:.1,def:0}];
function generate(motif,palette,seed,w,h,o={}){const r=rng(seed),p=typeof palette==='string'?PALETTES[palette]:palette,m=MOTIFS[motif](r,p,w,h,o);
 let body=m.body;
 if(o.misreg>0){ // a second, dark plate printed slightly off: the same shapes in the dark ink, shifted, under the colors
  const off=Math.min(w,h)*.0075*o.misreg, ghost=m.body.replace(/(fill|stroke)="#[0-9a-fA-F]{6}"/g,`$1="${p.dark}"`);
  body=`<g transform="translate(${f(off)} ${f(off*.6)})" opacity=".3">${ghost}</g>`+m.body;
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${m.defs||''}</defs><rect width="${w}" height="${h}" fill="${m.bg||p.paper}"/>${body}</svg>`;}

// ---- CLI (node only) ----
if (typeof module !== 'undefined' && typeof require !== 'undefined' && require.main === module) {
  const a = process.argv.slice(2), get = k => { const i = a.indexOf('--' + k); return i < 0 ? null : a[i + 1]; };
  const pickR = arr => arr[Math.floor(Math.random() * arr.length)];
  const kindOf = m => (m === 'fangor' ? 'random' : m === 'ring' || m === 'squares' ? 'ring' : m === 'dream' ? 'dream' : 'poster');
  const palsFor = kind => Object.keys(PALETTES).filter(k => (kind === 'poster' ? !/^(fangor|soft_|dream_)/.test(k) : k.startsWith({ random: 'fangor', ring: 'soft_', dream: 'dream_' }[kind])));
  const POSTER = Object.keys(MOTIFS).filter(m => kindOf(m) === 'poster');
  const group = a.includes('--fangor') ? 'fangor' : (a.includes('--ring') || a.includes('--soft')) ? 'ring' : a.includes('--dream') ? 'dream' : a.includes('--poster') ? 'poster' : null;
  const rand = a.includes('--random') || !!group;
  const motif = get('motif') || (group === 'poster' ? pickR(POSTER) : group || (rand ? pickR(Object.keys(MOTIFS)) : 'stripes'));
  const palette = get('palette') || (rand ? pickR(palsFor(kindOf(motif))) : 'baron');
  const seed = +(get('seed') || (rand ? Math.floor(Math.random() * 9999) : 1));
  const [w, h] = (get('size') || '1200x1600').split('x').map(Number);
  const rc = get('colors') === 'random';
  if (!MOTIFS[motif] || (!PALETTES[palette] && !rc)) { console.error('motifs:', Object.keys(MOTIFS).join(' '), '| palettes:', Object.keys(PALETTES).join(' ')); process.exit(1); }
  const num = k => (get(k) ? +get(k) : undefined);
  const pal = rc ? randomPalette(kindOf(motif), rng(seed * 2 + 1)) : palette;
  const extra = {};
  for (const o of [...(MOTIF_OPTS[motif] || []), ...GLOBAL_OPTS]) if (get(o.key) !== null) extra[o.key] = +get(o.key);   // option keys must not clash with --size, --seed, --out, --motif or --palette
  const svg = generate(motif, pal, seed, w, h, { size: num('circle'), x: num('x'), y: num('y'), grain: num('grain'), angle: num('angle'), amp: num('amp'), wave: num('wavelength'), softness: num('softness'), ...extra });
  console.error(`motif=${motif} palette=${rc ? 'random(seeded)' : palette} seed=${seed} size=${w}x${h}`);
  if (get('out')) require('fs').writeFileSync(get('out'), svg); else process.stdout.write(svg);
}
if (typeof module !== 'undefined') module.exports = { generate, PALETTES, MOTIFS, MOTIF_OPTS, GLOBAL_OPTS, randomPalette };
