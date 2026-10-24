// ---------- EP2 props ----------
const BED={night:{wood:'#3f3346',woodD:'#2c2436',mat:'#7d88ad',pil:'#9aa4c6',blank:'#4c5a8f',gap:'#04050b'},
           morning:{wood:'#8b6b4f',woodD:'#6c523c',mat:'#e4e8f1',pil:'#f4f6fa',blank:'#7f93c9',gap:'#262b3b'}};
function bed(mode){
  const b=BED[mode];
  return `<rect x="20" y="630" width="36" height="390" rx="14" fill="${b.woodD}"/>
   <rect x="54" y="912" width="404" height="92" fill="${b.gap}"/>
   <rect x="40" y="910" width="24" height="100" fill="${b.woodD}"/><rect x="440" y="910" width="24" height="100" fill="${b.woodD}"/>
   <rect x="30" y="882" width="444" height="34" rx="6" fill="${b.wood}"/>
   <rect x="50" y="826" width="418" height="62" rx="16" fill="${b.mat}"/>
   <ellipse cx="112" cy="812" rx="62" ry="26" fill="${b.pil}"/>`;
}
const blanket=mode=>`<path d="M140,812 Q300,792 472,820 L472,892 L140,892Z" fill="${BED[mode].blank}"/><path d="M160,840 Q300,826 460,846" stroke="rgba(0,0,0,0.15)" stroke-width="5" fill="none"/>`;
// pale hand gripping the mattress edge; hy = knuckle height
function hand(hx,hy,grip){
  const f=grip; // 0..1 fingers curl over the edge
  let s=`<rect x="${hx-13}" y="${hy+20}" width="26" height="${1010-hy}" rx="12" fill="#cfd4df"/>`;
  s+=`<ellipse cx="${hx}" cy="${hy+18}" rx="26" ry="30" fill="#d9dde6"/>`;
  [-18,-6,6,18].forEach((dx,i)=>{const L=58+(i===1||i===2?8:0);
    s+=`<path d="M${hx+dx},${hy+6} q${dx*0.3},${-L*(1-f*0.3)} ${dx*0.2+f*4},${-L+f*12}" stroke="#d9dde6" stroke-width="12" stroke-linecap="round" fill="none"/>
        <path d="M${hx+dx},${hy+6} q${dx*0.3},${-L*(1-f*0.3)} ${dx*0.2+f*4},${-L+f*12}" stroke="#8a90a3" stroke-width="1.5" fill="none" opacity="0.6"/>`;});
  s+=`<path d="M${hx-26},${hy+22} q-14,-14 -10,-34" stroke="#d9dde6" stroke-width="12" stroke-linecap="round" fill="none"/>`;
  return s;
}
const handprint=(x,y,s,r,c='rgba(225,228,238,0.55)')=>`<g transform="translate(${x},${y}) rotate(${r}) scale(${s})" fill="${c}"><ellipse cx="0" cy="0" rx="10" ry="12"/>
  <ellipse cx="-9" cy="-15" rx="3" ry="6"/><ellipse cx="-3" cy="-18" rx="3" ry="7"/><ellipse cx="3" cy="-18" rx="3" ry="7"/><ellipse cx="9" cy="-15" rx="3" ry="6"/><ellipse cx="13" cy="-2" rx="3" ry="5" transform="rotate(40 13 -2)"/></g>`;
let PRINTS=null;
function prints(){ if(PRINTS) return PRINTS; let s='',seed=7; const rnd=()=>((seed=seed*16807%2147483647)/2147483647);
  for(let i=0;i<34;i++) s+=handprint(70+rnd()*370,925+rnd()*120,0.7+rnd()*0.5,rnd()*360);
  return PRINTS=s; }
function knockFx(t,x,y,size=54){
  let s='';
  for(const k of TL.allKnocks){ const d=t-k; if(d>=0&&d<0.55){ const sc=1+d*0.8, op=1-d/0.55;
    s+=`<text x="${x+(Math.round(k*10)%3-1)*60}" y="${y-d*30}" text-anchor="middle" font-family="P" font-weight="700" font-size="${size}" fill="#ffd23f" stroke="#000" stroke-width="6" paint-order="stroke" opacity="${op}" transform="translate(0,0)" style="transform-origin:${x}px ${y}px;transform:scale(${sc})">ก๊อก</text>`; } }
  return s;
}
const knockShake=(t,a=6)=>{for(const k of TL.allKnocks){const d=t-k; if(d>=0&&d<0.18) return shake(t,a*(1-d/0.18));} return [0,0];};
const dim=a=>`<rect x="-500" y="-500" width="2000" height="2500" fill="#000" opacity="${a}"/>`;
const LEGCLIP='<defs><clipPath id="lc"><rect x="-300" y="-700" width="600" height="575"/></clipPath></defs>';
const person=(face,o={})=>LEGCLIP+at(o.x||230,1120,1,`<g clip-path="url(#lc)">${fig({face,...o})}</g>`);
const bedroom=(mode,face,o={})=>room(mode)+(o.noPerson?'':person(face,o))+bed(mode)+blanket(mode);

// ---------- scenes ----------
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{
    const inner=bedroom('night','calm')+knockFx(t,250,980,40);
    g=cam(lerp(330,270,ease(p)),lerp(720,880,ease(p)),lerp(1.0,1.3,ease(p)),inner);break;}
  case 2:{
    const [sx,sy]=shake(t,3);
    const inner=`<rect x="-500" y="-500" width="2000" height="2500" fill="#1e2546"/><ellipse cx="160" cy="700" rx="190" ry="70" fill="#9aa4c6"/>`+person('scared')+blanket('night');
    g=cam(230,665,lerp(4.4,5.0,ease(p)),inner,sx,sy);break;}
  case 3:{
    const [sx,sy]=knockShake(t,10);
    const blink=(Math.floor(t*2)%2)?1:0.25;
    g=`<rect width="720" height="1280" fill="#0b0e1c"/>
      <g transform="translate(${sx},${sy})">
      <rect x="130" y="470" width="460" height="230" rx="34" fill="#15131c" stroke="#2c2836" stroke-width="8"/>
      <text x="360" y="640" text-anchor="middle" font-family="P" font-weight="700" font-size="150" fill="#ff3b3b" style="filter:drop-shadow(0 0 14px rgba(255,40,40,.7))">03<tspan opacity="${blink}">:</tspan>00</text>
      ${knockFx(t,360,1040,64)}</g>`;
    break;}
  case 4:{
    const inner=bedroom('night','calm')+knockFx(t,250,980,34);
    g=cam(300,780,lerp(1.15,1.2,ease(p)),inner);break;}
  case 5:{
    const beat=Math.pow(Math.max(0,Math.sin((t-15.0)*Math.PI/0.8)),8);
    const [sx,sy]=knockShake(t,7);
    const inner=bedroom('night','scared')+knockFx(t,250,960,40);
    g=cam(250,920,lerp(1.9,2.3,ease(p)),inner,sx,sy)+`<rect width="720" height="1280" fill="url(#hb)"/><defs><radialGradient id="hb" cx="50%" cy="50%" r="70%"><stop offset="40%" stop-color="#ff0000" stop-opacity="0"/><stop offset="100%" stop-color="#b00000" stop-opacity="${0.15+beat*0.45}"/></radialGradient></defs>`;
    break;}
  case 6:{
    const reach=ease((lt-0.4)/1.0)*48;
    let bob=0; for(const k of TL.allKnocks){const d=t-k; if(d>=-0.12&&d<0.12) bob=(0.12-Math.abs(d))*120;}
    const inner=room('night')+person('scared',{armR:reach+bob*0.3})+bed('night')+blanket('night')+knockFx(t,380,900,40);
    g=cam(300,820,lerp(1.15,1.35,ease(p)),inner);break;}
  case 7:{
    const inner=bedroom('night','scared')+dim(0.35);
    g=cam(lerp(300,250,ease(p)),lerp(800,930,ease(p)),lerp(1.2,1.7,ease(p)),inner);break;}
  case 8:{
    const rise=ease((lt-0.3)/2.2), hy=lerp(1010,836,rise), grip=seg(lt,2.3,2.8);
    const [sx,sy]=lt>2.4&&lt<2.9?shake(t,6):[0,0];
    const inner=room('night')+person('scared')+bed('night')+blanket('night')+hand(330,hy,grip)+dim(0.12);
    g=cam(lerp(300,330,ease(p)),lerp(880,860,ease(p)),lerp(1.6,2.1,ease(p)),inner,sx,sy);break;}
  case 9:{
    const [sx,sy]=shake(t,2.5);
    const inner=`<rect x="-500" y="-500" width="2000" height="2500" fill="#151a33"/><ellipse cx="160" cy="700" rx="190" ry="70" fill="#9aa4c6"/>`+person('closed')+blanket('night');
    g=cam(230,665,lerp(4.6,5.0,ease(p)),inner,sx,sy);
    const n=Math.min(10,Math.floor(lt/0.22)+1);
    g+=`<text x="600" y="300" text-anchor="middle" font-family="P" font-weight="700" font-size="90" fill="#fff" opacity="0.35">${n}</text>`;
    break;}
  case 10:{
    const inner=bedroom('night',lt<1.2?'scared':'calm');
    g=cam(lerp(330,300,ease(p)),lerp(860,800,ease(p)),lerp(1.6,1.2,ease(p)),inner);break;}
  case 11:{
    const inner=room('morning')+bed('morning')+blanket('morning');
    g=cam(lerp(330,250,ease(p)),lerp(760,950,ease(p)),lerp(1.0,1.9,ease(p)),inner);
    const fi=1-seg(lt,0,0.6); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`;
    break;}
  case 12:{
    const reveal=seg(lt,1.4,2.2);
    const inner=room('morning')+bed('morning')+blanket('morning')+`<g opacity="${0.15+reveal*0.85}">${prints()}</g>`;
    g=cam(250,lerp(950,975,ease(p)),lerp(1.9,2.4,ease(p)),inner);break;}
  case 13:{
    const inner=room('morning')+bed('morning')+blanket('morning')+prints()+
      `<g transform="translate(300,1080) rotate(-8)"><rect x="-70" y="-45" width="140" height="90" fill="#f6f1e4"/><path d="M-50,-20 h90 M-50,0 h70 M-50,20 h80" stroke="#b3202a" stroke-width="5"/></g>`;
    g=cam(lerp(260,300,ease(p)),lerp(980,1070,ease(p)),lerp(1.8,3.2,ease(p)),inner);break;}
  case 14:{
    const [sx,sy]=shake(t,lt<1.5?3:1);
    g=`<rect width="720" height="1280" fill="#1a1712"/>
      <g transform="translate(${360+sx},${520+sy}) rotate(-5)">
       <rect x="-300" y="-230" width="600" height="420" fill="#f3ecda"/>
       <rect x="-300" y="-230" width="600" height="420" fill="none" stroke="#d8ccb0" stroke-width="4"/>
       <text x="0" y="-50" text-anchor="middle" font-family="P" font-weight="700" font-size="76" fill="#a3121c" opacity="${seg(lt,0.1,0.6)}" transform="skewX(-6)">ขอบคุณ</text>
       <text x="0" y="60" text-anchor="middle" font-family="P" font-weight="700" font-size="66" fill="#a3121c" opacity="${seg(lt,0.6,1.2)}" transform="skewX(-6)">ที่เปิดประตูให้</text>
       ${handprint(220,120,2.2,20,'rgba(90,60,50,0.45)')}</g>`;
    break;}
  case 15:{
    const open=seg(lt,2.8,3.6), eyes=seg(lt,3.4,3.9);
    const [sx,sy]=knockShake(t,6);
    const crack=`<rect x="${606-open*16}" y="480" width="${4+open*30}" height="500" fill="#020308"/>
       <g opacity="${eyes}"><ellipse cx="${598}" cy="690" rx="6" ry="5" fill="#fff"/><ellipse cx="${614}" cy="690" rx="6" ry="5" fill="#fff"/></g>`;
    const inner=room('night')+person('scared')+bed('night')+blanket('night')+crack+knockFx(t,610,720,40);
    g=cam(lerp(420,605,ease(p*1.2)),lerp(760,700,ease(p*1.2)),lerp(1.1,2.0,ease(p)),inner,sx,sy);break;}
  }
  return g+vignette(sc===2||sc===9||sc===14?0.85:0.65);
}

function endCard(lt){
  const a=seg(lt,0,0.6)*(1-seg(lt,2.2,2.6)), b=seg(lt,2.75,3.25);
  return `<div style="opacity:${a};position:absolute;top:520px;width:100%">
      <div style="color:#ff6b8a;font-size:30px;font-weight:700">ตอนต่อไป</div>
      <div style="font-size:60px;font-weight:700;line-height:1.25;margin-top:6px">อย่าขานรับ<br>เมื่อมีคนเรียกชื่อ</div>
      <div style="color:#8f9bc4;font-size:24px;margin-top:14px">เรื่องเล่าขนลุก · EP3</div></div>
    <div style="opacity:${b};position:absolute;top:560px;width:100%">
      <div style="color:#c7cfe8;font-size:30px">ติดตามตอนต่อไป</div>
      <div style="font-size:66px;font-weight:700;margin-top:4px">${CHANNEL}</div></div>`;
}

function render(t){
  const sc=TL.scenes.find(s=>t>=s.start&&t<s.end)||TL.scenes[TL.scenes.length-1];
  const lt=t-sc.start, p=lt/(sc.end-sc.start);
  const svg=document.getElementById('stage'), end=document.getElementById('end'), sub=document.getElementById('sub');
  if(sc.scene===99){
    svg.innerHTML=`<rect width="720" height="1280" fill="#1f2747"/>`+vignette(0.6);
    end.style.display='block'; end.innerHTML=endCard(lt);
  } else { end.style.display='none'; svg.innerHTML=draw(sc.scene,lt,p,t); }
  let cur=null;
  TL.chunks.forEach((c,i)=>{const nx=TL.chunks[i+1]; const until=Math.min(c.end+0.6,nx?nx.start:1e9); if(t>=c.start-0.05&&t<until) cur=c;});
  if(cur){
    const k=clamp((t-cur.start+0.05)/0.12), sc2=0.85+0.15*k;
    const [sx,sy]=cur.style==='w'?shake(t,4):cur.style==='k'?knockShake(t,8):[0,0];
    sub.innerHTML=`<span class="${cur.style==='k'?'y':cur.style}" style="white-space:nowrap;transform:translate(${sx}px,${sy}px) scale(${sc2})">${cur.text}</span>`;
    const sp=sub.firstChild; let fs=46; while(sp.offsetWidth>640&&fs>30){fs-=2; sp.style.fontSize=fs+'px';}
  } else sub.innerHTML='';
}
window.setup=tl=>{TL=tl;};
window.render=render;
