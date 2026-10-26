// ---------- EP4: กระจกที่ไม่ยอมกะพริบตา ----------
const META={next:'ลิฟต์ที่หยุด<br>ชั้น 13'};
const _face=face;
face=function(kind,sil){
  if(kind==='stare') return `<ellipse cx="-21" cy="-476" rx="14" ry="14" fill="#fff"/><ellipse cx="21" cy="-476" rx="14" ry="14" fill="#fff"/>
    <circle cx="-21" cy="-476" r="2.4" fill="#1b1b22"/><circle cx="21" cy="-476" r="2.4" fill="#1b1b22"/>
    <path d="M-34,-494 l24,0 M10,-494 l24,0" stroke="#1b1b22" stroke-width="5" stroke-linecap="round"/>
    <path d="M-12,-440 h24" stroke="#1b1b22" stroke-width="4" stroke-linecap="round"/>`;
  return _face(kind,sil);
};
const BATH={night:{wall:'#5b7287',grout:'#4d6377',sink:'#dfe6ec',frame:'#c9d2da',glass:'#2d3d52',refl:'#3f5468'},
            morning:{wall:'#c9dde6',grout:'#b3c9d3',sink:'#f3f6f8',frame:'#dfe5ea',glass:'#8fa7ba',refl:'#a9c0cd'}};
function tiles(c){ let s=`<rect x="-300" y="-300" width="1320" height="1900" fill="${c.wall}"/>`;
  for(let y=-300;y<1600;y+=70) s+=`<rect x="-300" y="${y}" width="1320" height="3" fill="${c.grout}"/>`;
  for(let x=-300;x<1020;x+=70) s+=`<rect x="${x}" y="-300" width="3" height="1900" fill="${c.grout}"/>`;
  return s; }
// mirror at x170..550 y240..770; reflection = person front, armR = mirrored arm
function mirror(mode,o={}){
  const c=BATH[mode];
  let s=`<rect x="156" y="226" width="408" height="558" rx="14" fill="${c.frame}"/>
    <defs><clipPath id="mc"><rect x="170" y="240" width="380" height="530" rx="6"/></clipPath></defs>
    <g clip-path="url(#mc)"><rect x="170" y="240" width="380" height="530" fill="${c.refl}"/>
    <rect x="170" y="240" width="380" height="530" fill="${c.grout}" opacity="0.25"/>`;
  if(!o.empty) s+=at(o.rx||360,o.ry||846,o.rs||0.8,fig({face:o.face||'calm',armL:o.armL||0,armR:o.armR||0}))+(o.reflExtra||'');
  if(o.brush) s+=`<rect x="${(o.rx||360)-20}" y="${(o.ry||846)-0.8*440}" width="46" height="8" rx="4" fill="#3fb6c9"/>`;
  s+=`<polygon points="170,240 300,240 170,420" fill="#fff" opacity="0.07"/>`;
  if(o.fog) s+=`<rect x="170" y="240" width="380" height="530" fill="#e8eef2" opacity="${o.fog*0.75}"/>`;
  if(o.print) s+=`<g opacity="${o.print}">${handprint(300,560,4.2,-8,'rgba(255,255,255,0.75)')}</g>`;
  if(o.write!=null){ const w=o.write;
    s+=`<defs><clipPath id="wc"><rect x="180" y="300" width="${360*w}" height="200"/></clipPath></defs>
      <g clip-path="url(#wc)"><text x="360" y="380" text-anchor="middle" font-family="P" font-weight="700" font-size="54" fill="#3d4f62" opacity="0.85" transform="rotate(-4 360 380)">ปล่อยฉัน</text>
      <text x="360" y="455" text-anchor="middle" font-family="P" font-weight="700" font-size="54" fill="#3d4f62" opacity="0.85" transform="rotate(-4 360 455)">ออกไป</text></g>`; }
  if(o.cracks){ const k=o.cracks; let cr='';
    [[0,-1],[0.8,-0.6],[1,0.2],[0.6,0.9],[-0.2,1],[-0.9,0.5],[-1,-0.3],[-0.5,-0.9]].forEach(([dx,dy],i)=>{
      const L=(160+i*23%90)*k; cr+=`<path d="M360,500 l${dx*L*0.5},${dy*L*0.5} l${dx*L*0.5+dy*20},${dy*L*0.5-dx*20}" stroke="#fff" stroke-width="3" fill="none" opacity="0.9"/>`;});
    s+=cr+`<circle cx="360" cy="500" r="${18*k}" fill="#fff" opacity="0.6"/>`;
    if(o.shatter) s+=`<polygon points="240,300 330,330 280,420" fill="#1a2430"/><polygon points="420,560 520,600 470,700" fill="#1a2430"/><polygon points="200,620 260,600 230,720" fill="#1a2430"/>`; }
  s+=`</g>`;
  return s;
}
function sink(mode){ const c=BATH[mode];
  return `<rect x="330" y="780" width="60" height="30" rx="8" fill="#aab4bd"/><rect x="352" y="770" width="16" height="50" fill="#aab4bd"/>
    <rect x="120" y="808" width="480" height="70" rx="20" fill="${c.sink}"/><rect x="100" y="870" width="520" height="500" fill="#3a4250"/>`; }
// person seen from behind (no face, full hair)
const backHead=`<ellipse cx="0" cy="-470" rx="57" ry="66" fill="${PAL.hair}"/>`;
const backPerson=(x,y,s,o={})=>at(x,y,s,fig({armL:o.armL||0,armR:o.armR||0})+backHead);
function bathroom(mode,o={}){
  return tiles(BATH[mode])+`<rect x="330" y="120" width="60" height="24" rx="10" fill="#f6efd0"/><circle cx="360" cy="150" r="70" fill="#fff6d6" opacity="0.12"/>`+
    mirror(mode,o.m||{})+sink(mode)+(o.noBack?'':backPerson(o.bx||220,o.by||1330,o.bs||1.3,o.back||{}));
}

// ---------- scenes ----------
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{
    g=cam(360,lerp(640,560,ease(p)),lerp(1.0,1.2,ease(p)),bathroom('night',{m:{face:'calm'}}));
    const fi=1-seg(lt,0,0.8); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 2: g=cam(360,lerp(500,470,ease(p)),lerp(1.7,2.4,ease(p)),bathroom('night',{m:{face:lt>2.0?'stare':'calm'},noBack:true})); break;
  case 3:{
    const brush=Math.sin(lt*14)*6;
    g=cam(360,600,1.15,bathroom('night',{m:{face:'calm',armR:150+brush,brush:true},back:{armL:150+brush}})); break;}
  case 4:{
    if(lt<1.3){ const bl=lt>0.55&&lt<0.95; g=cam(230,665,4.6,tiles(BATH.night)+person(bl?'closed':'calm')); break; }
    g=cam(360,480,lerp(2.2,2.7,ease((lt-1.3)/3)),bathroom('night',{m:{face:'stare'},noBack:true})); break;}
  case 5:{
    const grin=lt>2.3;
    const [sx,sy]=grin&&lt<2.9?shake(t,5):[0,0];
    g=cam(360,480,lerp(2.2,2.7,ease(p)),bathroom('night',{m:{face:grin?'grin':'calm'},noBack:true}),sx,sy); break;}
  case 6:{
    const back=ease((lt-0.2)/2.2);
    g=cam(360,620,1.1,bathroom('night',{m:{face:'grin',rs:lerp(0.8,0.86,back)},bx:lerp(220,170,back),by:lerp(1330,1500,back),bs:lerp(1.3,1.6,back)}))+heartOverlay(t,22.1,0.8,0.3); break;}
  case 7:{
    const up=ease((lt-0.2)/0.8)*150, pr=seg(lt,0.95,1.05);
    const [sx,sy]=lt>0.95&&lt<1.3?shake(t,7):[0,0];
    g=cam(360,520,lerp(1.6,1.9,ease(p)),bathroom('night',{m:{face:'grin',armL:up,print:pr,cracks:pr*0.35},noBack:true}),sx,sy)+heartOverlay(t,26.3,0.8,0.3); break;}
  case 8: g=cam(360,520,1.9,bathroom('night',{m:{face:'grin',armL:150,print:1,cracks:0.35,fog:seg(lt,0,1.8)},noBack:true}))+heartOverlay(t,30.4,0.8,0.3); break;
  case 9:{
    const [sx,sy]=shake(t,lt<1.5?3:1);
    g=cam(360,470,lerp(2.0,2.3,ease(p)),bathroom('night',{m:{empty:lt>2.2,face:'grin',armL:150,print:1,cracks:0.35,fog:1,write:seg(lt,0.2,2.0)},noBack:true}),sx,sy); break;}
  case 10:{
    const close=seg(lt,1.2,1.75);
    const inner=room('night',{door:true,doorOpen:1-close})+`<rect x="520" y="560" width="${156*(1-close)*0.85}" height="430" fill="#9fb6c8" opacity="${1-close}"/>`+at(lerp(560,330,ease(lt/1.2)),1150,1,fig({walk:lt<1.2?lt*12:null,face:'scared'}));
    const [sx,sy]=lt>1.7&&lt<2.0?shake(t,8):[0,0];
    g=cam(420,700,1.05,inner,sx,sy); break;}
  case 11:{
    g=cam(360,lerp(520,500,ease(p)),lerp(1.3,1.6,ease(p)),bathroom('morning',{m:{empty:true,cracks:1,shatter:true},noBack:true}));
    const fi=1-seg(lt,0,0.6); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 12:{
    const up=ease(lt/1.2)*150;
    const ph=at(300,1150,1,`<g transform="translate(80,-385) rotate(${-up})"><rect x="-22" y="170" width="44" height="70" rx="8" fill="#14151c"/></g>`);
    g=cam(330,720,lerp(1.05,1.25,ease(p)),room('morning')+at(300,1150,1,fig({face:'calm',armR:up}))+ph); break;}
  case 13:{
    const stare=lt>1.3, flash=1-seg(lt,0,0.35);
    const [sx,sy]=stare&&lt<1.9?shake(t,7):[0,0];
    const prev=`<defs><clipPath id="pc"><rect x="194" y="124" width="332" height="672" rx="36"/></clipPath></defs><g clip-path="url(#pc)">`+
      cam(300,720,2.2,room('morning')+at(300,1150,1,fig({face:stare?'grin':'calm'})))+`</g>`;
    g=`<g transform="translate(${sx},${sy})"><rect width="720" height="1280" fill="#cfd8e6"/>
      <ellipse cx="360" cy="840" rx="250" ry="150" fill="${SKIN}"/>
      <rect x="180" y="110" width="360" height="700" rx="46" fill="#14151c"/>
      <g transform="translate(-360,-640) scale(1)">${''}</g>
      <svg x="0" y="0" width="720" height="1280" viewBox="0 0 720 1280">${prev}</svg>
      <circle cx="360" cy="740" r="30" fill="none" stroke="#fff" stroke-width="5"/><circle cx="360" cy="740" r="22" fill="#fff"/></g>`;
    if(flash>0) g+=`<rect width="720" height="1280" fill="#fff" opacity="${flash}"/>`;
    if(stare) g+=`<rect width="720" height="1280" fill="#ff0000" opacity="${0.08+0.06*Math.sin(t*25)}"/>`;
    break;}
  }
  return g+vignette(0.7);
}
