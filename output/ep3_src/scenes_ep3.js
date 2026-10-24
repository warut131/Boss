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

// ---------- scenes ----------
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{
    g=cam(lerp(360,320,ease(p)),lerp(700,760,ease(p)),lerp(1.0,1.15,ease(p)),roomD('calm'));
    const fi=1-seg(lt,0,0.8); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`;
    break;}
  case 2:{ const [sx,sy]=shake(t,3); g=`<g transform="translate(${sx},${sy})">${closeFace('scared',lerp(4.4,5.0,ease(p)))}</g>`; break;}
  case 3: g=cam(lerp(320,420,ease(p)),760,1.15,roomD('calm')); break;
  case 4:{
    g=cam(lerp(420,600,ease(p)),lerp(760,820,ease(p)),lerp(1.15,1.8,ease(p)),roomD('calm'));
    if(lt>2.9) g+=heartOverlay(t,0,1.2,0.2);
    break;}
  case 5:{
    const buzz=lt>2.1;
    const [px,py]=buzz?shake(t,3):[0,0];
    const ph=`<g transform="translate(${380+px},${838+py}) rotate(-8)"><rect x="-26" y="-14" width="52" height="28" rx="6" fill="#14151c"/><rect x="-22" y="-10" width="44" height="20" rx="4" fill="${buzz?'#9fc2ff':'#1b2240'}"/></g>`+
      (buzz?`<circle cx="380" cy="838" r="70" fill="#9fc2ff" opacity="${0.18+0.1*Math.sin(t*30)}"/>`:'');
    g=cam(lerp(300,330,ease(p)),lerp(760,800,ease(p)),lerp(1.2,1.45,ease(p)),roomD(buzz?'scared':'calm',{extra:ph}));
    break;}
  case 6:{
    const [sx,sy]=lt<0.6?shake(t,6):[0,0];
    g=`<g transform="translate(${sx},${sy})">${phone({msgs:[{...MSG1,op:seg(lt,0.1,0.4)}]})}</g>`; break;}
  case 7:{ g=closeFace('scared',lerp(4.6,5.4,ease(p)))+heartOverlay(t,22.2,0.9,0.35); break;}
  case 8:{ g=cam(600,lerp(800,860,ease(p)),lerp(1.8,2.2,ease(p)),roomD('scared',{feet:0})); break;}
  case 9:{
    const step=Math.floor(lt/0.55), fx=lerp(-160,0,clamp(step/4));
    g=cam(600,lerp(900,960,ease(p)),lerp(2.3,2.9,ease(p)),roomD('scared',{feet:seg(lt,0.2,0.6),fx}))+heartOverlay(t,28,0.85,0.3);
    break;}
  case 10:{ const [sx,sy]=shake(t,2); g=`<g transform="translate(${sx},${sy})">${closeFace('scared',lerp(4.6,5.0,ease(p)),mouthHands,'#151a33')}</g>`; break;}
  case 11:{
    const a=lt<1.0?0:ease((lt-1.0)/2.8)*38+Math.sin(lt*23)*1.5*(lt>1?1:0);
    const [sx,sy]=shake(t,lt>1?2:0.5);
    g=`<g transform="translate(${sx},${sy})">${knob(a)}</g>`+heartOverlay(t,36,0.75,0.4); break;}
  case 12:{
    const [sx,sy]=lt<0.7?shake(t,7):[0,0];
    g=`<g transform="translate(${sx},${sy})">${phone({msgs:[MSG1,{...MSG2,op:seg(lt,1.3,1.6)}]})}</g>`+heartOverlay(t,40.5,0.75,0.3); break;}
  case 13:{
    g=cam(600,lerp(780,820,ease(p)),lerp(1.5,2.0,ease(p)),roomD('scared',{feet:1,fx:0})+dim(0.25))+heartOverlay(t,45.7,0.7,0.35); break;}
  case 14:{
    if(lt<1.4){ g=cam(600,820,2.0,roomD('scared',{feet:1})+dim(0.3)); break; }
    const [sx,sy]=shake(t,9);
    g=`<g transform="translate(${sx},${sy})">${phone({ring:true,t})}</g>`+
      `<rect width="720" height="1280" fill="#5ad17a" opacity="${0.06+0.06*Math.sin(t*20)}"/>`; break;}
  case 15:{
    if(lt>1.25){ g=`<rect width="720" height="1280" fill="#000"/>`; break; }
    const open=seg(lt,0,0.18), lunge=seg(lt,0.2,1.15);
    const inner=room('night',{door:true,doorOpen:open})+`<rect x="520" y="560" width="${156*open*0.85}" height="430" fill="#ffd27a" opacity="${open}"/>`+
      person('scared')+bed('night')+blanket('night');
    const [sx,sy]=shake(t,lt>0.2?10:0);
    g=cam(lerp(600,600,lunge),lerp(780,560,lunge),lerp(1.4,2.6,lunge),inner+
       `<g opacity="${seg(lt,0.12,0.25)}">${at(lerp(600,560,lunge),lerp(990,1500,lunge),lerp(0.85,3.4,lunge),momSil())}</g>`,sx,sy);
    if(lt>1.12) g+=`<rect width="720" height="1280" fill="#fff" opacity="${1-seg(lt,1.12,1.25)}"/>`;
    break;}
  }
  return g+vignette(0.7);
}

function endCard(lt){
  const a=seg(lt,0,0.6)*(1-seg(lt,2.2,2.6)), b=seg(lt,2.75,3.25);
  return `<div style="opacity:${a};position:absolute;top:520px;width:100%">
      <div style="color:#ff6b8a;font-size:30px;font-weight:700">ตอนต่อไป</div>
      <div style="font-size:60px;font-weight:700;line-height:1.25;margin-top:6px">กระจกที่<br>ไม่ยอมกะพริบตา</div>
      <div style="color:#8f9bc4;font-size:24px;margin-top:14px">เรื่องเล่าขนลุก · EP4</div></div>
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
  if(cur&&cur.style!=='k'){
    const k=clamp((t-cur.start+0.05)/0.12), sc2=0.85+0.15*k;
    const [sx,sy]=cur.style==='x'?shake(t,6):[0,0];
    const txt=cur.style==='m'?`“${cur.text}”`:cur.text;
    sub.innerHTML=`<span class="${cur.style}" style="white-space:nowrap;transform:translate(${sx}px,${sy}px) scale(${sc2})">${txt}</span>`;
    const sp=sub.firstChild; let fs=46; while(sp.offsetWidth>640&&fs>36){fs-=2; sp.style.fontSize=fs+'px';}
    if(sp.offsetWidth>640){ // break at the space nearest the middle
      const sps=[...txt.matchAll(/ /g)].map(m=>m.index); const mid=txt.length/2;
      const at_=sps.sort((x,y)=>Math.abs(x-mid)-Math.abs(y-mid))[0];
      if(at_!=null){sp.innerHTML=txt.slice(0,at_)+'<br>'+txt.slice(at_+1); sp.style.fontSize='44px'; sp.style.lineHeight='1.3';}}
  } else sub.innerHTML='';
}
window.setup=tl=>{TL=tl; TL.allKnocks=TL.allKnocks||[];};
window.render=render;
