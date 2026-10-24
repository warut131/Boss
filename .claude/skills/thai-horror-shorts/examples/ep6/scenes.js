// ---------- EP6: ตุ๊กตาที่ย้ายที่ทุกคืน ----------
const META={ep:6,next:'เสียงหัวเราะ<br>ในห้องน้ำโรงเรียน'};
const _face=face;
face=function(kind,sil){
  if(kind==='button') return `<circle cx="-21" cy="-476" r="15" fill="#0b0b0f"/><circle cx="21" cy="-476" r="15" fill="#0b0b0f"/>
    ${[-21,21].map(x=>`<circle cx="${x-4}" cy="-480" r="2.6" fill="#555"/><circle cx="${x+4}" cy="-480" r="2.6" fill="#555"/><circle cx="${x-4}" cy="-472" r="2.6" fill="#555"/><circle cx="${x+4}" cy="-472" r="2.6" fill="#555"/>`).join('')}
    <path d="M-20,-440 h40 M-14,-446 v12 M-4,-446 v12 M6,-446 v12 M16,-446 v12" stroke="#1b1b22" stroke-width="3"/>`;
  return _face(kind,sil);
};
// teddy bear; look: -1..1 (eyes toward camera when 0 with turn), grin 0..1, walk phase
function bear(x,y,s,o={}){
  const B='#9a6a43', L='#c89a6c', lk=o.look==null?0:o.look, w=o.walk==null?0:Math.sin(o.walk)*10;
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${o.tilt||0})">
    <ellipse cx="-34" cy="${-8+(o.walk!=null?-Math.abs(w):0)}" rx="22" ry="18" fill="${B}"/><ellipse cx="34" cy="${-8-(o.walk!=null?Math.abs(w):0)}" rx="22" ry="18" fill="${B}"/>
    <ellipse cx="0" cy="-60" rx="52" ry="58" fill="${B}"/><ellipse cx="0" cy="-48" rx="30" ry="34" fill="${L}"/>
    <ellipse cx="-56" cy="-74" rx="16" ry="30" fill="${B}" transform="rotate(${20+w} -56 -74)"/><ellipse cx="56" cy="-74" rx="16" ry="30" fill="${B}" transform="rotate(${-20-w} 56 -74)"/>
    <g transform="translate(${lk*10},0)">
    <circle cx="-38" cy="-178" r="20" fill="${B}"/><circle cx="38" cy="-178" r="20" fill="${B}"/><circle cx="-38" cy="-178" r="10" fill="${L}"/><circle cx="38" cy="-178" r="10" fill="${L}"/>
    <circle cx="0" cy="-140" r="50" fill="${B}"/><ellipse cx="${lk*6}" cy="-122" rx="22" ry="16" fill="${L}"/><ellipse cx="${lk*6}" cy="-130" rx="8" ry="6" fill="#2a1a10"/>
    <circle cx="${-18+lk*8}" cy="-150" r="7" fill="#0b0b0f"/><circle cx="${18+lk*8}" cy="-150" r="7" fill="#0b0b0f"/>
    <circle cx="${-16+lk*8}" cy="-152" r="2" fill="#fff"/><circle cx="${20+lk*8}" cy="-152" r="2" fill="#fff"/>
    ${o.grin?`<path d="M${-22+lk*6},-116 Q${lk*6},${-96} ${22+lk*6},-116" stroke="#2a1a10" stroke-width="3" fill="#f2e8d8" opacity="${o.grin}"/><path d="M${-12+lk*6},-112 v8 M${lk*6},-109 v10 M${12+lk*6},-112 v8" stroke="#2a1a10" stroke-width="2" opacity="${o.grin}"/>`:`<path d="M${lk*6},-124 v8" stroke="#2a1a10" stroke-width="3"/>`}
    <path d="M-6,-188 l6,8 l6,-8" stroke="#5a3a20" stroke-width="2" fill="none"/></g></g>`;
}
const shelf=(b)=>`<rect x="430" y="520" width="200" height="16" fill="#5a4636"/><rect x="450" y="536" width="10" height="30" fill="#5a4636"/><rect x="600" y="536" width="10" height="30" fill="#5a4636"/>${b?bear(530,520,0.55,b):''}`;
const desk=(b,mode)=>`<rect x="470" y="840" width="230" height="20" fill="${mode==='morning'?'#8b6b4f':'#3f3346'}"/><rect x="490" y="860" width="16" height="140" fill="${mode==='morning'?'#6c523c':'#2c2436'}"/><rect x="664" y="860" width="16" height="140" fill="${mode==='morning'?'#6c523c':'#2c2436'}"/>${b?bear(585,840,0.6,b):''}`;
const bedroomB=(mode,face,o={})=>room(mode,{noWardrobe:true})+shelf(o.shelf)+desk(o.desk,mode)+person(face)+bed(mode)+blanket(mode)+(o.pillow?bear(140,812,0.42,{...o.pillow,tilt:-70}):'');
const NV='filter:grayscale(1) sepia(1) hue-rotate(65deg) saturate(2.6) brightness(0.95) contrast(1.15)';
function playback(inner,t,ts){
  const rec=Math.floor(t*2)%2===0;
  return `<g style="${NV}">${inner}</g>`+
    `<g stroke="#fff" stroke-width="5" fill="none" opacity="0.8"><path d="M40,90 v-50 h50 M680,90 v-50 h-50 M40,1190 v50 h50 M680,1190 v50 h-50"/></g>`+
    `<circle cx="80" cy="130" r="13" fill="#ff2a2a" opacity="${rec?1:0.2}"/><text x="104" y="142" font-family="P" font-weight="700" font-size="32" fill="#fff">REC</text>`+
    `<text x="640" y="142" text-anchor="end" font-family="P" font-weight="700" font-size="32" fill="#fff">${ts}</text>`+
    `<rect width="720" height="1280" fill="url(#scan)"/><defs><pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000" opacity="0.18"/></pattern></defs>`;
}
const stamp=lt=>{const s=42+Math.floor(lt); return `03:17:${String(s%60).padStart(2,'0')}`;};

// ---------- scenes ----------
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{ const look=seg(lt,3.2,3.8);
    g=cam(lerp(520,530,ease(p)),lerp(560,450,ease(p)),lerp(1.4,2.6,ease(p)),bedroomB('night','calm',{shelf:{look:-1+look}}));
    const fi=1-seg(lt,0,0.8); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 2: g=`<rect width="720" height="1280" fill="#e9d9b8"/><rect y="820" width="720" height="460" fill="#b88a5a"/>
      <rect x="120" y="760" width="200" height="70" rx="6" fill="#f2e6cc" transform="rotate(-6 220 795)"/>
      ${bear(400,840,1.6,{look:lerp(-0.3,0.2,p)})}<g transform="rotate(8 560 640)"><rect x="500" y="600" width="130" height="70" rx="8" fill="#fff"/><text x="565" y="648" text-anchor="middle" font-family="P" font-weight="700" font-size="36" fill="#c0392b">฿20</text></g>`; break;
  case 3: g=cam(420,700,lerp(1.05,1.2,ease(p)),bedroomB('night','closed',{shelf:{look:-1}})); break;
  case 4:{ const sc_=lt>0.9;
    g=cam(lerp(420,560,ease(p)),lerp(720,760,ease(p)),lerp(1.05,1.6,ease(p)),bedroomB('morning',sc_?'scared':'calm',{desk:{look:0}}));
    const fi=1-seg(lt,0,0.5); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 5:{
    if(lt<2.6){ const out=seg(lt,0.6,1.4);
      g=cam(560,780,1.3,room('night',{door:true,doorOpen:1-seg(lt,1.4,2.0)})+bear(lerp(500,610,out),990,0.6,{look:0.5})+at(lerp(420,380,out),1150,1,fig({face:'calm',armR:40*(1-out)}))); break; }
    const [sx,sy]=lt>3.3&&lt<3.8?shake(t,5):[0,0];
    g=cam(lerp(220,170,ease((lt-2.6)/2)),lerp(760,740,ease((lt-2.6)/2)),lerp(1.4,2.2,ease((lt-2.6)/2)),bedroomB('morning','scared',{pillow:{look:0.6,grin:0}}),sx,sy); break;}
  case 6:{ const tri=`<g transform="translate(600,1000)"><path d="M0,0 L-40,140 M0,0 L40,140 M0,0 L0,150" stroke="#222" stroke-width="7"/><rect x="-46" y="-90" width="92" height="64" rx="10" fill="#14151c"/><circle cx="-26" cy="-58" r="12" fill="#2b3357"/><circle cx="30" cy="-76" r="6" fill="#ff2a2a" opacity="${lt>1.2&&Math.floor(t*2)%2?1:0.25}"/></g>`;
    g=cam(lerp(420,560,ease(p)),lerp(760,900,ease(p)),lerp(1.05,1.5,ease(p)),bedroomB('night','calm',{shelf:{look:-1}})+tri); break;}
  case 7:{ const turn=seg(lt,3.0,4.6);
    g=playback(cam(lerp(420,530,turn),lerp(700,450,turn),lerp(1.05,2.8,turn),bedroomB('night','closed',{shelf:{look:-1+turn*1}})),t,stamp(lt));
    break;}
  case 8:{ const k=ease(lt/3.0);
    const bx=lerp(530,300,k), by=lt<0.6?520:lerp(1000,900,k);
    const b=lt<0.6?shelf({look:0}):shelf(null)+bear(bx,by,0.6,{walk:lt*9,look:-0.4});
    g=playback(cam(380,760,1.05,room('night',{noWardrobe:true})+desk(null,'night')+person('closed')+bed('night')+blanket('night')+(lt<0.6?shelf({look:0}):shelf(null)+bear(bx,by,0.6,{walk:lt*9,look:-0.4}))),t,stamp(lt+6)); break;}
  case 9:{ const lean=seg(lt,0.4,1.6);
    g=playback(cam(250,700,lerp(1.9,2.6,ease(p)),room('night',{noWardrobe:true})+shelf(null)+person('closed')+bed('night')+blanket('night')+bear(330,800,0.6,{tilt:-25*lean,look:-1,grin:lean})),t,stamp(lt+10)); break;}
  case 10:{ const v=seg(lt,0.3,1.2);
    g=`<rect width="720" height="1280" fill="#0a0d1c"/><rect x="180" y="110" width="360" height="700" rx="46" fill="#14151c"/>
      <defs><clipPath id="sc"><rect x="194" y="124" width="332" height="672" rx="36"/></clipPath></defs>
      <g clip-path="url(#sc)"><svg x="194" y="124" width="332" height="672" viewBox="0 0 720 1280" preserveAspectRatio="xMidYMid slice">${playback(cam(250,700,2.6,room('night',{noWardrobe:true})+person('closed')+bed('night')+blanket('night')+bear(330,800,0.6,{tilt:-25,look:-1,grin:1})),t,stamp(13))}</svg></g>
      <rect x="230" y="640" width="260" height="14" rx="7" fill="#333"/><rect x="230" y="640" width="${260*v}" height="14" rx="7" fill="#fff"/>
      <path d="M200,647 l12,-10 v20z" fill="#fff"/><text x="500" y="656" font-family="P" font-weight="700" font-size="26" fill="#fff">${Math.round(v*100)}%</text>
      <ellipse cx="360" cy="840" rx="250" ry="150" fill="${SKIN}"/>`; break;}
  case 11:{ const [sx,sy]=shake(t,3);
    g=playback(cam(lerp(320,300,ease(p)),lerp(700,690,ease(p)),lerp(3.0,4.4,ease(p)),room('night',{noWardrobe:true})+person('closed')+bed('night')+blanket('night')+bear(330,800,0.6,{tilt:-25,look:-1,grin:1}),sx,sy),t,stamp(17));
    if(Math.sin(t*13)>0.85) g+=`<rect width="720" height="1280" fill="#fff" opacity="0.25"/>`; break;}
  case 12:{ g=cam(lerp(360,520,ease(p)),lerp(720,640,ease(p)),lerp(1.05,1.6,ease(p)),bedroomB('morning','scared',{}));
    const fi=1-seg(lt,0,0.4); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 13:{ const btn=lt>2.0; const [sx,sy]=btn&&lt<2.6?shake(t,7):[0,0];
    g=`<g transform="translate(${sx},${sy})"><rect width="720" height="1280" fill="#cfd8e6"/><rect x="80" y="150" width="560" height="900" rx="18" fill="#e3e8ee"/>
      <defs><clipPath id="mm"><rect x="96" y="166" width="528" height="868" rx="10"/></clipPath></defs>
      <g clip-path="url(#mm)">${cam(230,640,lerp(3.4,4.4,ease(p)),`<rect x="-500" y="-500" width="2000" height="2500" fill="#a9b6c6"/>`+person(btn?'button':'scared'))}<polygon points="96,166 300,166 96,500" fill="#fff" opacity="0.12"/></g></g>`;
    if(btn) g+=`<rect width="720" height="1280" fill="#ff0000" opacity="${0.06+0.05*Math.sin(t*25)}"/>`;
    break;}
  }
  return g+vignette(0.7);
}
