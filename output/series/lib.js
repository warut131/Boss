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

// ---------- EP3 props ----------
(()=>{const st=document.createElement('style');st.textContent='.m{color:#ffc2d4;font-style:italic;text-shadow:0 0 6px #000,0 3px 0 #000,0 -2px 0 #000,3px 0 0 #000,-3px 0 0 #000}.x{color:#fff;background:#d7263d;box-shadow:0 4px 0 #7a1020}';document.head.appendChild(st);})();
const SKIN=PAL.skin;
function doorLight(o={}){
  let s=`<polygon points="520,990 676,990 760,1090 440,1090" fill="rgba(255,205,120,0.16)"/><rect x="520" y="978" width="156" height="12" fill="#ffd27a"/>`;
  if(o.feet){ const fx=o.fx||0, op=o.feet;
    s+=`<g opacity="${op}"><rect x="${560+fx}" y="978" width="30" height="12" fill="#120c08"/><rect x="${612+fx}" y="978" width="30" height="12" fill="#120c08"/>
      <polygon points="${560+fx},990 ${590+fx},990 ${600+fx*1.3},1090 ${540+fx*1.3},1090" fill="rgba(0,0,0,0.5)"/>
      <polygon points="${612+fx},990 ${642+fx},990 ${670+fx*1.3},1090 ${610+fx*1.3},1090" fill="rgba(0,0,0,0.5)"/></g>`; }
  return s;
}
const roomD=(face,o={})=>room('night',{door:true,doorOpen:o.doorOpen||0})+doorLight(o)+(o.noPerson?'':person(face,o))+bed('night')+blanket('night')+(o.extra||'');
function closeFace(face,z,extra='',bg='#1e2546'){
  return cam(230,665,z,`<rect x="-500" y="-500" width="2000" height="2500" fill="${bg}"/><ellipse cx="160" cy="700" rx="190" ry="70" fill="#9aa4c6"/>`+person(face)+extra+blanket('night'));
}
const mouthHands=at(230,1120,1,`<circle cx="-20" cy="-436" r="26" fill="${SKIN}"/><circle cx="18" cy="-430" r="26" fill="${SKIN}"/>
  <path d="M-40,-446 h40 M-40,-434 h40 M0,-440 h38 M0,-428 h38" stroke="#c99a76" stroke-width="3"/>`);
function heartOverlay(t,t0,period,k=0.45){
  const beat=Math.pow(Math.max(0,Math.sin((t-t0)*Math.PI/period)),8);
  return `<defs><radialGradient id="hb" cx="50%" cy="50%" r="70%"><stop offset="40%" stop-color="#ff0000" stop-opacity="0"/><stop offset="100%" stop-color="#b00000" stop-opacity="${0.12+beat*k}"/></radialGradient></defs><rect width="720" height="1280" fill="url(#hb)"/>`;
}
function knob(angle){
  return `<rect width="720" height="1280" fill="#3f3346"/><rect x="60" y="0" width="600" height="1280" fill="#46394e"/>
   <rect x="250" y="330" width="220" height="440" rx="40" fill="#b8913f"/><rect x="262" y="342" width="196" height="416" rx="34" fill="#9a7531"/>
   <circle cx="360" cy="480" r="118" fill="#d9b55a"/><circle cx="360" cy="480" r="96" fill="#e6c776"/>
   <g transform="rotate(${angle} 360 480)"><rect x="352" y="390" width="16" height="180" rx="8" fill="#b8913f"/><ellipse cx="320" cy="430" rx="34" ry="16" fill="#fff6d0" opacity="0.6" transform="rotate(-30 320 430)"/></g>
   <circle cx="360" cy="660" r="16" fill="#2a1d10"/><rect x="354" y="660" width="12" height="40" fill="#2a1d10"/>
   <rect x="0" y="1220" width="720" height="16" fill="#ffd27a" opacity="0.8"/>`;
}
const heart=(x,y,s)=>`<path transform="translate(${x},${y}) scale(${s})" d="M0,6 C-10,-6 -24,4 0,22 C24,4 10,-6 0,6Z" fill="#ff5b7f"/>`;
function phone(o){
  let s=`<rect width="720" height="1280" fill="#0a0d1c"/>
   <ellipse cx="360" cy="840" rx="250" ry="150" fill="${SKIN}"/>
   <rect x="180" y="110" width="360" height="700" rx="46" fill="#14151c"/><rect x="194" y="124" width="332" height="672" rx="36" fill="#0f1426"/>
   <rect x="320" y="136" width="80" height="18" rx="9" fill="#14151c"/>
   <text x="222" y="186" font-family="P" font-size="20" fill="#cfd6ea">23:01</text>`;
  if(o.ring){
    const pulse=(o.t*1.6)%1;
    s+=`<circle cx="360" cy="380" r="${70+pulse*70}" fill="none" stroke="#5ad17a" stroke-width="4" opacity="${1-pulse}"/>
      <circle cx="360" cy="380" r="70" fill="#2b3357"/><text x="360" y="402" text-anchor="middle" font-family="P" font-weight="700" font-size="60" fill="#fff">แม่</text>
      <text x="360" y="510" text-anchor="middle" font-family="P" font-weight="700" font-size="40" fill="#fff">แม่</text>${heart(410,488,1)}
      <text x="360" y="556" text-anchor="middle" font-family="P" font-size="26" fill="#aab3d0">กำลังโทรเข้า…</text>
      <circle cx="270" cy="700" r="40" fill="#e0384f"/><circle cx="450" cy="700" r="40" fill="#35c15e"/>
      <rect x="250" y="696" width="40" height="8" rx="4" fill="#fff"/><path d="M438,690 q12,-14 24,0" stroke="#fff" stroke-width="7" fill="none"/>`;
  } else {
    s+=`<rect x="194" y="200" width="332" height="70" fill="#151b33"/><circle cx="240" cy="235" r="22" fill="#2b3357"/><text x="240" y="244" text-anchor="middle" font-family="P" font-weight="700" font-size="20" fill="#fff">แม่</text>
      <text x="276" y="245" font-family="P" font-weight="700" font-size="28" fill="#fff">แม่</text>${heart(338,226,0.8)}`;
    (o.msgs||[]).forEach((m,i)=>{ const y=310+i*170, op=m.op==null?1:m.op, sc=0.85+0.15*op;
      s+=`<g opacity="${op}" transform="translate(214,${y}) scale(${sc})"><rect x="0" y="0" width="290" height="${40+m.lines.length*44}" rx="22" fill="${m.alert?'#3a1720':'#2a3150'}"/>`+
        m.lines.map((l,j)=>`<text x="20" y="${50+j*44}" font-family="P" font-weight="${m.alert?700:500}" font-size="28" fill="${m.alert?'#ff8a9b':'#eef1fb'}">${l}</text>`).join('')+
        `<text x="0" y="${70+m.lines.length*44}" font-family="P" font-size="18" fill="#6f7899">${m.time}</text></g>`; });
  }
  return s;
}
function momSil(){
  return `<path d="M-64,-470 Q-90,-300 -86,-150 L86,-150 Q90,-300 64,-470 Q0,-560 -64,-470Z" fill="#000"/>`+fig({sil:'#000',face:'sgrin'});
}
const MSG1={lines:['ยังอยู่ร้านป้าแดงนะลูก','เดี๋ยวกลับ'],time:'23:01'};
const MSG2={lines:['แม่ยังไม่ถึงบ้าน','ห้ามขานรับใครเด็ดขาด!!'],time:'23:06',alert:true};

function endCard(lt){
  const a=seg(lt,0,0.6)*(1-seg(lt,2.2,2.6)), b=seg(lt,2.75,3.25);
  return `<div style="opacity:${a};position:absolute;top:520px;width:100%">
      <div style="color:#ff6b8a;font-size:30px;font-weight:700">ตอนต่อไป</div>
      <div style="font-size:60px;font-weight:700;line-height:1.25;margin-top:6px">${META.next}</div>
      <div style="color:#8f9bc4;font-size:24px;margin-top:14px">เรื่องเล่าขนลุก</div></div>
    <div style="opacity:${b};position:absolute;top:560px;width:100%">
      <div style="color:#c7cfe8;font-size:30px">อย่าลืมกดติดตาม</div>
      <div style="font-size:66px;font-weight:700;margin-top:4px">${CHANNEL}</div><div style="display:inline-block;margin-top:26px;background:#e3263f;color:#fff;font-size:36px;font-weight:700;padding:6px 40px 12px;border-radius:40px;box-shadow:0 5px 0 #8a1020;transform:scale(${1+0.06*Math.sin(lt*7)})">+ ติดตาม</div><div style="color:#8f9bc4;font-size:28px;margin-top:22px">แล้วเจอกันตอนหน้านะ</div></div>`;
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
  if(cur&&cur.style!=='k'){
    const k=clamp((t-cur.start+0.05)/0.12), sc2=0.85+0.15*k;
    const [sx,sy]=(cur.style==='x'||cur.style==='v')?shake(t,6):[0,0];
    const txt='mfc'.includes(cur.style)?`“${cur.text}”`:cur.text;
    sub.innerHTML=`<span class="${'fc'.includes(cur.style)?'m':cur.style==='v'?'x':cur.style}" style="white-space:nowrap;transform:translate(${sx}px,${sy}px) scale(${sc2})">${txt}</span>`;
    const sp=sub.firstChild; let fs=46; while(sp.offsetWidth>640&&fs>36){fs-=2; sp.style.fontSize=fs+'px';}
    if(sp.offsetWidth>640){ // break at the space nearest the middle
      const sps=[...txt.matchAll(/ /g)].map(m=>m.index); const mid=txt.length/2;
      const at_=sps.sort((x,y)=>Math.abs(x-mid)-Math.abs(y-mid))[0];
      if(at_!=null){sp.innerHTML=txt.slice(0,at_)+'<br>'+txt.slice(at_+1); sp.style.fontSize='44px'; sp.style.lineHeight='1.3';}}
  } else sub.innerHTML='';
}
window.setup=tl=>{TL=tl; TL.allKnocks=TL.allKnocks||[];};
window.render=render;

