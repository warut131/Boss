// ---------- ข้อความจากเบอร์ตัวเอง ----------
const META={next:'เทเกะ เทเกะ<br>ผีครึ่งตัวริมรางรถไฟ'};
const chunkT=(s,i)=>TL.chunks.filter(c=>c.scene===s)[i].start;
const flashIn=(lt,a,b,col='#fff')=>lt>a?`<rect width="720" height="1280" fill="${col}" opacity="${1-seg(lt,a,b)}"/>`:'';
const MSGS=[{t:'อย่าเปิดไฟ',time:'03:00'},{t:'มันอยู่ใต้เตียง|รอให้เธอเปิดไฟ',time:'03:01',alert:1},
            {t:'ถ้ามันออกมา|วิ่งไปห้องน้ำ|แล้วล็อกประตู!!',time:'03:02',alert:1},{t:'ขอบคุณที่มาหาฉัน|ในห้องน้ำนะ :)',time:'03:04',evil:1}];
// chat with your own number; n = how many messages are shown, pop = 0..1 for the newest
function myPhone(n,pop=1){
  let s=`<rect width="720" height="1280" fill="#06070e"/><ellipse cx="360" cy="860" rx="250" ry="150" fill="${SKIN}"/>
    <rect x="160" y="90" width="400" height="740" rx="48" fill="#14151c"/><rect x="174" y="104" width="372" height="712" rx="38" fill="#0f1426"/>
    <text x="202" y="160" font-family="P" font-size="20" fill="#cfd6ea">03:0${Math.max(0,n-1)}</text>
    <rect x="174" y="178" width="372" height="86" fill="#151b33"/><circle cx="222" cy="221" r="26" fill="#3a4470"/>
    ${at(222,262,0.07,fig({face:'calm'}))}
    <text x="262" y="214" font-family="P" font-weight="700" font-size="28" fill="#fff">ฉัน</text>
    <text x="262" y="244" font-family="P" font-size="20" fill="#8f9bc4">089-xxx-xxxx (เบอร์คุณ)</text>`;
  const shown=MSGS.slice(0,n); let y=780;
  for(let i=shown.length-1;i>=0;i--){ const m=shown[i], lines=m.t.split('|'), h=36+lines.length*40, op=i===n-1?pop:1;
    y-=h+40; if(y<280) break;
    s+=`<g opacity="${op}" transform="translate(196,${y}) scale(${i===n-1?0.85+0.15*pop:1})"><rect width="320" height="${h}" rx="22" fill="${m.evil?'#4a0a10':m.alert?'#3a1720':'#2a3150'}"/>`+
      lines.map((l,j)=>`<text x="18" y="${44+j*40}" font-family="P" font-weight="${m.alert||m.evil?700:500}" font-size="27" fill="${m.evil?'#ff6b7a':m.alert?'#ff9aa8':'#eef1fb'}">${l}</text>`).join('')+
      `<text x="0" y="${h+24}" font-family="P" font-size="17" fill="#6f7899">${m.time}</text></g>`; }
  return s;
}
function scrapeFx(t,x,y){
  const c=TL.chunks.find(c=>c.style==='k'); if(!c) return ''; let s='';
  [0,0.9].forEach(k=>{const d=t-(c.start+k); if(d>=0&&d<0.8) s+=`<text x="${x+(k?50:-40)}" y="${y-d*20}" text-anchor="middle" font-family="P" font-weight="700" font-size="46" fill="#ffd23f" stroke="#000" stroke-width="6" paint-order="stroke" opacity="${1-d/0.8}">แกรก</text>`;});
  return s;
}
const phoneGlow=(on)=>on?`<g transform="translate(380,838) rotate(-8)"><rect x="-26" y="-14" width="52" height="28" rx="6" fill="#14151c"/><rect x="-22" y="-10" width="44" height="20" rx="4" fill="#9fc2ff"/></g><circle cx="380" cy="838" r="80" fill="#9fc2ff" opacity="0.15"/>`:'';
// dark bony hand coming out from under the bed; k = 0..1 reach
function darkHand(x,k){
  const y=1040;
  return `<g transform="translate(${x},${y})" style="filter:drop-shadow(0 0 3px #8a90a8)"><rect x="-260" y="-14" width="260" height="30" rx="14" fill="#050507"/><ellipse cx="10" cy="0" rx="32" ry="24" fill="#050507"/>
    ${[-16,-5,6,17].map((d,i)=>`<path d="M30,${d} q${40+i*4},${-10-k*20} ${70+i*6},${10+k*30}" stroke="#050507" stroke-width="9" stroke-linecap="round" fill="none"/>`).join('')}</g>`;
}
function bath(o={}){
  const l=o.light==null?0.6:o.light;
  let s=`<rect x="-400" y="-400" width="1520" height="2100" fill="#3f5468"/>`;
  for(let y=-400;y<1000;y+=64) s+=`<rect x="-400" y="${y}" width="1520" height="3" fill="#33465a"/>`;
  for(let x=-400;x<1120;x+=64) s+=`<rect x="${x}" y="-400" width="3" height="1400" fill="#33465a"/>`;
  s+=`<rect x="-400" y="990" width="1520" height="700" fill="#2a3442"/>`;
  // shower curtain on the left
  const op=o.curtain||0;
  s+=`<rect x="-40" y="190" width="340" height="12" rx="6" fill="#aab4bd"/><rect x="-30" y="202" width="320" height="790" fill="#5b6f84"/>`;
  if(o.thing) s+=`<g opacity="${o.thing}">${at(lerp(40,70,op),1040,1.05,`<path d="M-66,-500 Q-92,-320 -84,-180 L84,-180 Q92,-320 66,-500 Q0,-570 -66,-500Z" fill="#000"/>`+fig({sil:'#000',face:'sgrin'}))}</g>`;
  const cw=320*(1-op*0.55);
  s+=`<rect x="${290-cw}" y="202" width="${cw}" height="790" fill="#c9d3dc"/>`;
  for(let i=0;i<8;i++) s+=`<rect x="${290-cw+i*cw/8}" y="202" width="6" height="790" fill="#aab6c1"/>`;
  // door (locked) on the right
  s+=`<rect x="470" y="440" width="230" height="550" fill="#6b5446"/><rect x="490" y="700" width="16" height="40" rx="6" fill="#c9a24a"/><rect x="494" y="700" width="30" height="10" fill="#c9a24a"/>`;
  s+=`<rect x="300" y="130" width="120" height="16" rx="8" fill="${l>0.3?'#fff6d6':'#444'}"/>`;
  if(o.person) s+=o.person;
  if(l<1) s+=`<rect x="-400" y="-400" width="1520" height="2100" fill="#000" opacity="${(1-l)*0.7}"/>`;
  return s;
}

// ---------- scenes ----------
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{ const buzz=lt>0.7; const [px,py]=buzz?shake(t,2):[0,0];
    const inner=room('night')+person(lt>chunkT(1,1)-TL.scenes[0].start?'scared':'closed')+bed('night')+blanket('night')+`<g transform="translate(${px},${py})">${phoneGlow(buzz)}</g>`;
    g=cam(lerp(300,340,ease(p)),lerp(760,800,ease(p)),lerp(1.1,1.5,ease(p)),inner);
    const fi=1-seg(lt,0,0.6); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 2:{ const [sx,sy]=lt<0.5?shake(t,5):[0,0]; g=`<g transform="translate(${sx},${sy})">${myPhone(1,seg(lt,0.1,0.4))}</g>`; break;}
  case 3: g=cam(230,665,lerp(4.4,4.8,ease(p)),`<rect x="-500" y="-500" width="2000" height="2500" fill="#1e2546"/><ellipse cx="160" cy="700" rx="190" ry="70" fill="#9aa4c6"/>`+person('calm')+blanket('night'))+`<rect width="720" height="1280" fill="#9fc2ff" opacity="0.08"/>`; break;
  case 4:{ const [sx,sy]=lt<0.5?shake(t,5):[0,0]; const pop=seg(t,chunkT(4,1)-0.4,chunkT(4,1)-0.1);
    g=`<g transform="translate(${sx},${sy})">${myPhone(t>chunkT(4,1)-0.4?2:1,pop)}</g>`;
    if(t>chunkT(4,1)) g+=heartOverlay(t,0,0.8,0.3); break;}
  case 5:{ const [sx,sy]=shake(t,TL.chunks.some(c=>c.style==='k'&&t>c.start&&t<c.end)?3:1);
    g=cam(lerp(300,250,ease(p)),lerp(820,950,ease(p)),lerp(1.4,2.4,ease(p)),room('night')+person('scared')+bed('night')+blanket('night')+phoneGlow(1)+scrapeFx(t,250,970),sx,sy)+heartOverlay(t,0,0.7,0.35); break;}
  case 6:{ const [sx,sy]=lt<0.5?shake(t,5):[0,0]; g=`<g transform="translate(${sx},${sy})">${myPhone(3,seg(lt,0.1,0.4))}</g>`+heartOverlay(t,0,0.7,0.35); break;}
  case 7:{ const k=seg(lt,0.2,1.2); const [sx,sy]=lt>0.4&&lt<1.4?shake(t,8):shake(t,1);
    g=cam(lerp(260,300,k),lerp(960,920,k),lerp(2.4,1.9,k),room('night')+person('scared')+bed('night')+blanket('night')+darkHand(lerp(80,330,k),k),sx,sy)+heartOverlay(t,0,0.6,0.45);
    g+=flashIn(lt,0.3,0.7,'#b3121c'); break;}
  case 8:{ const k=ease(lt/2.2); const [sx,sy]=shake(t,4);
    if(lt<2.3) g=cam(420,700,1.05,room('night',{door:true,doorOpen:1})+`<rect x="520" y="560" width="132" height="430" fill="#7d93a6"/>`+at(lerp(260,600,k),1150,1,fig({walk:lt*14,face:'scared'})),sx,sy);
    else g=`<rect width="720" height="1280" fill="#000"/>`;
    break;}
  case 9:{ const breath=Math.sin(lt*5)*4;
    g=cam(lerp(380,420,ease(p)),lerp(720,700,ease(p)),lerp(1.1,1.25,ease(p)),bath({light:0.6,person:at(560,1150+breath,1,fig({face:lt<1.2?'scared':'closed'}))}))+(lt<0.4?`<rect width="720" height="1280" fill="#000" opacity="${1-lt/0.4}"/>`:''); break;}
  case 10:{
    if(t<chunkT(10,1)-0.3){ const [px,py]=shake(t,2); g=cam(520,640,1.6,bath({light:0.6,person:at(560,1150,1,fig({face:'calm',armR:70}))+`<g transform="translate(${px},${py})"><rect x="610" y="760" width="40" height="66" rx="8" fill="#14151c"/><rect x="614" y="764" width="32" height="58" rx="5" fill="#9fc2ff"/></g>`})); break; }
    const [sx,sy]=t<chunkT(10,1)+0.3?shake(t,6):[0,0];
    g=`<g transform="translate(${sx},${sy})">${myPhone(4,seg(t,chunkT(10,1)-0.3,chunkT(10,1)))}</g>`+heartOverlay(t,0,0.6,0.4); break;}
  case 11:{ const end=TL.scenes.find(s=>s.scene===11).end;
    if(t>end-0.9){ g=`<rect width="720" height="1280" fill="#000"/>`; break; }
    const k=seg(lt,0,1.3); const [sx,sy]=shake(t,lt<1.3?6:2);
    g=cam(lerp(380,90,k),lerp(700,560,k),lerp(1.2,2.6,k),bath({light:0.5,curtain:k,thing:seg(lt,0,0.5),person:at(560,1150,1,fig({face:'scared'}))}),sx,sy);
    if(lt>1.25) g+=flashIn(lt,1.25,1.55); break;}
  }
  return g+vignette(0.7);
}
