// ---------- ห้องเช่ากฎ 7 ข้อ: shared props for all three parts ----------
function withPal(p,fn){const old={...PAL}; Object.assign(PAL,p); const s=fn(); Object.assign(PAL,old); return s;}
const _face=face;
face=function(kind,sil){
  if(kind==='stare') return `<ellipse cx="-21" cy="-476" rx="13" ry="13" fill="#fff"/><ellipse cx="21" cy="-476" rx="13" ry="13" fill="#fff"/>
    <circle cx="-21" cy="-476" r="2.4" fill="#111"/><circle cx="21" cy="-476" r="2.4" fill="#111"/>
    <ellipse cx="-21" cy="-460" rx="14" ry="5" fill="#5d4f6e" opacity="0.5"/><ellipse cx="21" cy="-460" rx="14" ry="5" fill="#5d4f6e" opacity="0.5"/>
    <path d="M-12,-438 h24" stroke="#111" stroke-width="4" stroke-linecap="round"/>`;
  return _face(kind,sil);
};
const meBack=(x,y,s,o={})=>at(x,y,s,fig({armR:o.armR||0,walk:o.walk})+`<ellipse cx="0" cy="-470" rx="57" ry="66" fill="${PAL.hair}"/>`);
const ghostMe=(x,y,s,face,o={})=>`<g opacity="${o.op==null?0.75:o.op}">`+withPal({skin:'#c9cdd6'},()=>at(x,y,s,fig({face,armR:o.armR||0,walk:o.walk})))+`</g>`;
function landlady(o={}){
  const body=withPal({top:'#6b4c7a',pants:'#4a3f3a',skin:o.pale?'#dcd6d0':'#e7c9a9',hair:'#bdbdbd',shoe:'#2a2222'},()=>fig({face:o.face||'calm',armR:o.armR||0}));
  return `<circle cx="0" cy="-548" r="28" fill="#bdbdbd"/>`+body+
    `<circle cx="-21" cy="-476" r="17" fill="none" stroke="#3a2f2a" stroke-width="3"/><circle cx="21" cy="-476" r="17" fill="none" stroke="#3a2f2a" stroke-width="3"/><path d="M-4,-476 h8" stroke="#3a2f2a" stroke-width="3"/>`;
}
const RULES=['กลับห้องก่อนเที่ยงคืน','มีคนเคาะประตู ห้ามเปิด','ห้ามมองตาแมว หลังตีสอง','ห้ามตอบเสียงจากห้อง 404','ไฟดับ ให้นับดังๆ ถึงเจ็ด','ห้ามย้ายเตียงออกจากที่เดิม'];
// paper close-up; hl = highlighted rule (1-based), rule7 = text in red scrawl (or null = torn off)
function rulesPaper(hl,o={}){
  let s=`<rect width="720" height="1280" fill="${o.bg||'#2a2420'}"/><g transform="translate(360,${o.y||600}) rotate(${o.rot==null?-3:o.rot})">
    <rect x="-280" y="-420" width="560" height="${o.rule7?820:740}" fill="#efe6d2"/>
    <text x="0" y="-340" text-anchor="middle" font-family="P" font-weight="700" font-size="46" fill="#3a2f2a">กฎของหอพัก</text>
    <rect x="-220" y="-318" width="440" height="4" fill="#3a2f2a"/>`;
  RULES.forEach((r,i)=>{ const y=-250+i*84;
    if(hl===i+1) s+=`<rect x="-250" y="${y-44}" width="500" height="60" fill="#ffe14d" opacity="0.65"/>`;
    s+=`<text x="-235" y="${y}" font-family="P" font-weight="${hl===i+1?700:500}" font-size="32" fill="#3a2f2a">${i+1}. ${r}</text>`; });
  const y7=-250+6*84;
  if(o.rule7) s+=`${hl===7?`<rect x="-250" y="${y7-44}" width="500" height="${o.rule7.length*52+20}" fill="#ffe14d" opacity="0.4"/>`:''}`+
      o.rule7.map((l,j)=>`<g transform="translate(0,${y7+j*52}) skewX(-8)"><text x="-235" y="0" font-family="P" font-weight="700" font-size="34" fill="#a3121c">${j?'&#160;&#160;&#160;':'7. '}${l}</text></g>`).join('');
  else s+=`<text x="-235" y="${y7}" font-family="P" font-size="32" fill="#3a2f2a">7. </text><polygon points="-280,${y7-30} -200,${y7-10} -120,${y7-34} -40,${y7-8} 40,${y7-30} 120,${y7-6} 200,${y7-32} 280,${y7-12} 280,400 -280,400" fill="${o.bg||'#2a2420'}"/>`;
  return s+`</g>`;
}
function aptHall(o={}){
  const l=o.light==null?1:o.light;
  let s=`<rect x="-400" y="-400" width="1520" height="2100" fill="#3b4152"/><rect x="-400" y="990" width="1520" height="700" fill="#262a36"/>
    <rect x="200" y="140" width="320" height="14" rx="7" fill="${l>0.5?'#e8fff6':'#444'}"/>${l>0.5?'<polygon points="200,154 520,154 700,990 20,990" fill="#e8fff6" opacity="0.06"/>':''}`;
  [[-170,'402'],[240,'403'],[650,'404']].forEach(([x,n])=>{
    s+=`<rect x="${x-10}" y="430" width="260" height="570" fill="#2a2e3c"/><rect x="${x}" y="440" width="240" height="560" fill="${n==='404'?'#4a4038':'#6b5446'}"/>
      <rect x="${x+80}" y="470" width="80" height="40" rx="6" fill="#d9d2c0"/><text x="${x+120}" y="502" text-anchor="middle" font-family="P" font-weight="700" font-size="28" fill="#333">${n}</text>
      <circle cx="${x+120}" cy="600" r="7" fill="#1a1a1a"/><circle cx="${x+200}" cy="740" r="10" fill="#c9a24a"/>`;
    if(n==='404'&&o.taped) s+=`<path d="M${x},460 L${x+240},980 M${x+240},460 L${x},980" stroke="#e0c040" stroke-width="18" opacity="0.85"/>`;
  });
  s+=o.extra||'';
  if(l<1) s+=`<rect x="-400" y="-400" width="1520" height="2100" fill="#000" opacity="${(1-l)*0.8}"/>`;
  return s;
}
// inside the room, looking at the front door (peephole on the door)
const roomApt=(face,o={})=>room('night',{door:true,doorOpen:0})+`<circle cx="598" cy="690" r="7" fill="#111"/>`+doorLight({feet:o.feet||0,fx:o.fx||0})+(o.noPerson?'':person(face,o))+bed('night')+blanket('night')+(o.extra||'');
function peephole(o={}){
  let s=`<rect width="720" height="1280" fill="#000"/><defs><clipPath id="ph"><circle cx="360" cy="600" r="280"/></clipPath>
    <radialGradient id="pv" cx="50%" cy="50%" r="50%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.95"/></radialGradient></defs>
    <g clip-path="url(#ph)"><g transform="translate(360,600) scale(${o.z||0.55}) translate(-360,-640)">${aptHall({light:o.light==null?0.8:o.light})}</g>`;
  if(o.eye){ const e=o.eye;
    s+=`<g transform="translate(360,600) scale(${0.6+e*0.6})"><ellipse rx="300" ry="220" fill="#f1ece4"/>
      ${[0,40,80,140,200,250,300,330].map(a=>`<path d="M${Math.cos(a/57.3)*290},${Math.sin(a/57.3)*200} Q${Math.cos(a/57.3)*200},${Math.sin(a/57.3)*150+20} ${Math.cos(a/57.3)*150},${Math.sin(a/57.3)*110}" stroke="#c0392b" stroke-width="3" fill="none" opacity="0.7"/>`).join('')}
      <circle r="130" fill="#4a2e1c"/><circle r="130" fill="none" stroke="#2a180c" stroke-width="8"/><circle r="${lerp(70,40,e)}" fill="#050505"/><circle cx="-40" cy="-45" r="20" fill="#fff" opacity="0.8"/></g>`; }
  return s+`<rect x="0" y="0" width="720" height="1280" fill="url(#pv)"/></g><circle cx="360" cy="600" r="280" fill="none" stroke="#111" stroke-width="20"/>`;
}
function bigNum(txt,o={}){
  return `<text x="360" y="${o.y||660}" text-anchor="middle" font-family="P" font-weight="700" font-size="${o.size||220}" fill="${o.col||'#d8dbe6'}" opacity="${o.op==null?1:o.op}" ${o.red?'style="filter:drop-shadow(0 0 18px rgba(255,0,0,.7))"':''}>${txt}</text>`;
}
function building(){
  let s=`<rect width="720" height="1280" fill="#0d1124"/><rect x="140" y="240" width="440" height="1100" fill="#3a3530"/>`;
  for(let r=0;r<6;r++) for(let c=0;c<4;c++){ const lit=(r*4+c)%5===1; s+=`<rect x="${175+c*100}" y="${290+r*140}" width="60" height="80" fill="${r===0&&c===2?'#05060a':lit?'#f0c873':'#1c2033'}"/>`; }
  s+=`<rect x="150" y="1080" width="420" height="200" fill="#2a2622"/><rect x="300" y="1120" width="120" height="160" fill="#f0c873" opacity="0.6"/>
     <g transform="translate(0,-330) rotate(-4 360 1000)"><rect x="210" y="960" width="300" height="110" fill="#f4f0e4"/><text x="360" y="1010" text-anchor="middle" font-family="P" font-weight="700" font-size="40" fill="#b3121c">ห้องว่าง ให้เช่า</text>
     <text x="360" y="1056" text-anchor="middle" font-family="P" font-weight="700" font-size="36" fill="#333">เดือนละ ฿1,500</text></g>`;
  return s;
}
const knocksFrom=(tl,fast)=>tl.chunks.filter(c=>c.style==='k').flatMap(c=>((fast&&fast(c))?[0.05,0.3,0.55,0.8,1.05,1.3,1.55]:[0.1,0.75,1.4]).map(k=>c.start+k));
const chunkT=(s,i)=>TL.chunks.filter(c=>c.scene===s)[i].start;
const fadeIn=(lt,d=0.8)=>{const k=1-seg(lt,0,d); return k>0?`<rect width="720" height="1280" fill="#000" opacity="${k}"/>`:'';};
const flash=(lt,a,b,col='#fff')=>lt>a?`<rect width="720" height="1280" fill="${col}" opacity="${1-seg(lt,a,b)}"/>`:'';
