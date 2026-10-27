// ---------- ฮานาโกะซัง ผีในห้องน้ำโรงเรียน ----------
const META={next:'เทเกะ เทเกะ<br>ผีครึ่งตัวริมรางรถไฟ'};
window.setup=tl=>{TL=tl; TL.allKnocks=tl.chunks.filter(c=>c.style==='k').flatMap(c=>[0.1,0.75,1.4].map(k=>c.start+k));};
function withPal(p,fn){const old={...PAL}; Object.assign(PAL,p); const s=fn(); Object.assign(PAL,old); return s;}
const _face=face;
face=function(kind,sil){
  if(kind==='stare') return `<ellipse cx="-21" cy="-476" rx="13" ry="13" fill="#fff"/><ellipse cx="21" cy="-476" rx="13" ry="13" fill="#fff"/>
    <circle cx="-21" cy="-476" r="2.4" fill="#111"/><circle cx="21" cy="-476" r="2.4" fill="#111"/>
    <ellipse cx="-21" cy="-460" rx="14" ry="5" fill="#7d6a8a" opacity="0.5"/><ellipse cx="21" cy="-460" rx="14" ry="5" fill="#7d6a8a" opacity="0.5"/>
    <path d="M-12,-438 h24" stroke="#111" stroke-width="4" stroke-linecap="round"/>`;
  return _face(kind,sil);
};
// --- Hanako: bob cut, white blouse, red skirt
function girl(o={}){
  const body=withPal({top:'#eeeeea',skin:'#f3ebe6',pants:'#f4f4f4',shoe:'#a3121c',hair:'#060608'},()=>fig({face:o.face||'stare',armR:o.armR||0,armL:o.armL||0,walk:o.walk}));
  return `<path d="M-64,-530 Q0,-575 64,-530 L68,-420 L-68,-420Z" fill="#060608"/>`+body+
    `<polygon points="-70,-230 70,-230 92,-110 -92,-110" fill="#b3121c"/><rect x="-70" y="-240" width="140" height="16" fill="#8a0d16"/>
     <path d="M-60,-500 Q-62,-556 0,-552 Q62,-556 60,-500 L60,-492 L-60,-492Z" fill="#060608"/>`;
}
const schoolPal={top:'#1d2230'};
// --- places
function schoolExt(){
  let s=`<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a63"/><stop offset="0.6" stop-color="#c8607a"/><stop offset="1" stop-color="#f3a35c"/></linearGradient></defs>
    <rect x="-400" y="-400" width="1520" height="1400" fill="url(#dusk)"/><circle cx="560" cy="760" r="70" fill="#ffd9a0" opacity="0.8"/>
    <rect x="-400" y="980" width="1520" height="700" fill="#2c2433"/>
    <rect x="-100" y="560" width="920" height="420" fill="#e9e2d3"/><rect x="280" y="430" width="160" height="140" fill="#e9e2d3"/>
    <circle cx="360" cy="500" r="44" fill="#fff"/><circle cx="360" cy="500" r="44" fill="none" stroke="#333" stroke-width="5"/><path d="M360,500 v-30 M360,500 h22" stroke="#333" stroke-width="5"/>`;
  for(let r=0;r<3;r++) for(let c=0;c<9;c++) s+=`<rect x="${-80+c*100}" y="${600+r*120}" width="70" height="70" fill="${r===2&&c===6?'#2a1d26':'#7b8fb1'}"/>`;
  s+=`<rect x="-400" y="960" width="1520" height="24" fill="#5b4b5e"/>`;
  return s;
}
function hallway(o={}){
  const dark=o.dark||0;
  let s=`<rect x="-400" y="-400" width="1520" height="2100" fill="#d9cfbf"/><rect x="-400" y="990" width="1520" height="700" fill="#9a8a78"/>`;
  for(let i=0;i<3;i++) s+=`<rect x="${-60+i*190}" y="300" width="150" height="320" fill="#f2a663"/><rect x="${-60+i*190}" y="300" width="150" height="320" fill="none" stroke="#7a6a58" stroke-width="10"/>
    <polygon points="${-60+i*190},620 ${90+i*190},620 ${200+i*190},990 ${60+i*190},990" fill="#f2a663" opacity="0.25"/>`;
  s+=`<rect x="520" y="420" width="170" height="570" fill="#7a6a58"/><rect x="532" y="432" width="146" height="558" fill="#b9474f"/>
      <rect x="560" y="330" width="90" height="60" rx="8" fill="#2f5d8a"/><text x="605" y="372" text-anchor="middle" font-family="P" font-weight="700" font-size="30" fill="#fff">WC</text>`;
  if(dark) s+=`<rect x="-400" y="-400" width="1520" height="2100" fill="#0a0c1a" opacity="${dark}"/>`;
  return s;
}
// bathroom with three stalls; o.flick 0..1 light, o.open3 0..1, o.eyes, o.feet, o.peek (svg drawn inside stall 3)
function bathroom(o={}){
  const light=o.light==null?1:o.light;
  let s=`<rect x="-400" y="-400" width="1520" height="2100" fill="#9fb3ad"/>`;
  for(let y=-400;y<1000;y+=60) s+=`<rect x="-400" y="${y}" width="1520" height="3" fill="#8aa09a"/>`;
  for(let x=-400;x<1120;x+=60) s+=`<rect x="${x}" y="-400" width="3" height="1400" fill="#8aa09a"/>`;
  for(let r=0;r<12;r++) for(let c=0;c<26;c++) if((r+c)%2) s+=`<rect x="${-400+c*60}" y="${1000+r*60}" width="60" height="60" fill="#6f7f7a"/>`; else s+=`<rect x="${-400+c*60}" y="${1000+r*60}" width="60" height="60" fill="#7f908a"/>`;
  s+=`<rect x="200" y="150" width="320" height="16" rx="8" fill="${light?'#fffbe6':'#555'}"/>`;
  [60,265,470].forEach((x,i)=>{
    s+=`<rect x="${x-8}" y="370" width="206" height="660" fill="#7c8a86"/><rect x="${x}" y="380" width="190" height="620" fill="#2a2a30"/>`;
    if(i===2&&o.peek) s+=`<g>${o.peek}</g>`;
    const op=i===2?(o.open3||0):0, w=190*(1-op*0.8);
    s+=`<rect x="${x}" y="380" width="${w}" height="620" fill="#b9474f"/><rect x="${x+w-26}" y="680" width="10" height="34" rx="5" fill="#d9b55a"/>
        <rect x="${x+60}" y="320" width="70" height="44" rx="8" fill="#eee"/><text x="${x+95}" y="355" text-anchor="middle" font-family="P" font-weight="700" font-size="32" fill="#333">${i+1}</text>
        <rect x="${x}" y="1000" width="190" height="28" fill="#0d0d10"/>`;
  });
  if(o.eyes) s+=`<g opacity="${o.eyes}"><ellipse cx="${630}" cy="610" rx="9" ry="7" fill="#fff"/><ellipse cx="${652}" cy="610" rx="9" ry="7" fill="#fff"/></g>`;
  if(o.feet) s+=`<g opacity="${o.feet}"><ellipse cx="545" cy="1020" rx="20" ry="9" fill="#a3121c"/><ellipse cx="590" cy="1020" rx="20" ry="9" fill="#a3121c"/></g>`;
  s+=o.extra||'';
  if(light<1) s+=`<rect x="-400" y="-400" width="1520" height="2100" fill="#000" opacity="${(1-light)*0.75}"/>`;
  return s;
}
const flick=(lt,ks)=>ks.reduce((v,k)=>lt>k&&lt<k+0.12?0.15:v,1);
const meBack=(x,y,s,o={})=>at(x,y,s,fig({armR:o.armR||0,walk:o.walk})+`<ellipse cx="0" cy="-470" rx="57" ry="66" fill="${PAL.hair}"/>`);

// ---------- scenes ----------
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{ g=cam(360,lerp(760,690,ease(p)),lerp(1.0,1.6,ease(p)),schoolExt());
    const fi=1-seg(lt,0,0.8); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 2:{ const a=seg(lt,0.1,0.6); const [sx,sy]=lt>2.3&&lt<2.7?shake(t,6):[0,0];
    g=`<defs><radialGradient id="rb" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#5a0d14"/><stop offset="1" stop-color="#12030a"/></radialGradient></defs>
      <rect width="720" height="1280" fill="url(#rb)"/><g transform="translate(${sx},${sy})">${at(360,1250,1.1,girl({face:lt>2.3?'sgrin':'stare'}))}
      <text x="360" y="300" text-anchor="middle" font-family="P" font-size="34" fill="#f0c0c6" opacity="${a}">ตำนานผีญี่ปุ่น</text>
      <text x="360" y="390" text-anchor="middle" font-family="P" font-weight="700" font-size="84" fill="#fff" stroke="#000" stroke-width="8" paint-order="stroke" opacity="${a}">ฮานาโกะซัง</text></g>`; break;}
  case 3:{ const ghost=seg(lt,3.4,4.2)*0.3;
    g=cam(565,lerp(650,620,ease(p)),lerp(1.6,2.1,ease(p)),bathroom({peek:''})+`<g opacity="${ghost}">${at(565,1000,0.85,girl())}</g>`); break;}
  case 4:{ const inner=hallway()+withPal(schoolPal,()=>at(200,1150,1,fig({face:'grin',armR:lerp(0,85,seg(lt,0.3,0.9))})))+at(420,1150,1,fig({face:'calm'}));
    g=cam(lerp(330,420,ease(p)),760,lerp(1.05,1.25,ease(p)),inner); break;}
  case 5:{ const l=flick(lt,[1.3,1.45,2.1,2.3]);
    g=cam(360,lerp(760,720,ease(p)),1.05,bathroom({light:l})+meBack(360,1500,1.3,{walk:lt<1.6?lt*6:null})); break;}
  case 6:{ const kn=TL.allKnocks.some(k=>t>k-0.1&&t<k+0.12);
    const [sx,sy]=knockShake(t,6);
    g=cam(lerp(500,565,ease(p)),lerp(720,700,ease(p)),lerp(1.2,1.6,ease(p)),bathroom({})+meBack(470,1420,1.15,{armR:kn?70:40})+knockFx(t,565,640,46),sx,sy)+heartOverlay(t,25.8,0.8,0.25); break;}
  case 7: g=cam(230,665,lerp(4.4,4.8,ease(p)),`<rect x="-500" y="-500" width="2000" height="2500" fill="#8aa09a"/>`+at(230,1120,1,fig({face:'calm'})))+heartOverlay(t,30.9,0.8,0.3); break;
  case 8: g=cam(565,lerp(700,980,ease(p)),lerp(1.6,2.4,ease(p)),bathroom({light:0.7,feet:seg(lt,1.0,1.8)}))+heartOverlay(t,33.8,0.8,0.3); break;
  case 9:{ const turn=seg(lt,0.6,1.2);
    g=cam(360,720,1.1,bathroom({feet:1})+(turn<0.5?meBack(470,1420,1.15):at(lerp(470,380,turn),1420,1.15,fig({face:'calm',walk:lt*6}))),0,0); break;}
  case 10:{ const [sx,sy]=shake(t,lt<0.8?8:2);
    g=`<g transform="translate(${sx},${sy})">${cam(230,665,4.6,`<rect x="-500" y="-500" width="2000" height="2500" fill="#8aa09a"/>`+at(230,1120,1,fig({face:'scared'})))}</g>`;
    const k=1-seg(lt,0.2,0.9); if(k>0) g+=`<rect width="720" height="1280" fill="#b3121c" opacity="${k*0.5}"/>`; break;}
  case 11:{ const op=seg(lt,0.3,2.6);
    const peek=`<rect x="470" y="380" width="190" height="620" fill="#050507"/>`+(op>0.4?`<g opacity="${seg(lt,1.4,2.2)}">${at(600,1000,0.85,girl({face:'stare'}))}</g>`:'');
    g=cam(565,lerp(700,640,ease(p)),lerp(1.4,2.2,ease(p)),bathroom({open3:op,peek,light:0.8}))+heartOverlay(t,41.9,0.75,0.35); break;}
  case 12:{ const reach=seg(lt,0.2,1.0), drag=seg(lt,1.0,1.6);
    const floor=`<rect x="-400" y="-400" width="1520" height="2100" fill="#7f908a"/>`;
    let s=floor+`<rect x="-400" y="300" width="1520" height="300" fill="#b9474f"/><rect x="-400" y="600" width="1520" height="60" fill="#050507"/>`;
    const lx=lerp(430,60,drag);
    s+=`<g transform="translate(${lx},0)"><rect x="0" y="-300" width="80" height="860" fill="${PAL.pants}"/><rect x="4" y="520" width="72" height="50" fill="#e8e8e8"/><ellipse cx="60" cy="590" rx="80" ry="34" fill="${PAL.shoe}"/></g>`;
    const hx=lerp(-120,lx+10,reach);
    s+=`<g transform="translate(${hx},545) scale(1.6)"><rect x="-260" y="30" width="260" height="22" rx="11" fill="#f3ebe6"/>
        <ellipse cx="0" cy="34" rx="26" ry="20" fill="#f3ebe6"/>${[0,10,20,30].map(d=>`<rect x="6" y="${d}" width="${reach>0.95?52:30}" height="8" rx="4" fill="#f3ebe6" stroke="#c9bdb6" stroke-width="1"/>`).join('')}</g>`;
    const [sx,sy]=lt>0.9&&lt<1.7?shake(t,10):[0,0];
    g=cam(360,600,1.0,s,sx,sy);
    if(lt>1.55) g+=`<rect width="720" height="1280" fill="#000" opacity="${seg(lt,1.55,1.7)}"/>`; break;}
  case 13:{ const dark=seg(lt,0.5,4.0)*0.85;
    g=cam(lerp(420,520,ease(p)),760,lerp(1.05,1.3,ease(p)),hallway({dark})+withPal(schoolPal,()=>at(400,1150,1,fig({face:lt>3?'scared':'calm'})))); break;}
  case 14:{ const kn=TL.allKnocks.some(k=>t>k-0.1&&t<k+0.12); const [sx,sy]=knockShake(t,5);
    const student=withPal({top:'#1d2a4a',hair:'#3a2a20'},()=>at(470,1420,1.15,fig({armR:kn?70:40})+`<ellipse cx="0" cy="-470" rx="57" ry="66" fill="#3a2a20"/><path d="M-60,-470 Q-70,-380 -50,-340 L50,-340 Q70,-380 60,-470Z" fill="#3a2a20"/>`));
    g=cam(lerp(480,565,ease(p)),lerp(740,680,ease(p)),lerp(1.1,1.7,ease(p)),bathroom({light:0.85})+student+knockFx(t,565,640,46),sx,sy)+heartOverlay(t,55.1,0.75,0.3); break;}
  case 15:{
    if(lt>1.4){ g=`<rect width="720" height="1280" fill="#000"/>`; break; }
    const k=seg(lt,0,1.1); const [sx,sy]=shake(t,7);
    const me=withPal({skin:'#c9cdd6'},()=>at(600,1000,0.95,fig({face:'stare'})));
    const peek=`<rect x="470" y="380" width="190" height="620" fill="#050507"/>`+me+`<g transform="translate(560,640)"><ellipse rx="22" ry="16" fill="#f3ebe6"/></g>`;
    g=cam(lerp(565,600,k),lerp(640,560,k),lerp(1.8,4.2,k),bathroom({open3:0.35,peek,light:0.6}),sx,sy);
    if(lt>1.2) g+=`<rect width="720" height="1280" fill="#fff" opacity="${1-seg(lt,1.2,1.4)}"/>`; break;}
  }
  return g+vignette(0.7);
}
