// ---------- คุจิสะเกะอนนะ (ผู้หญิงปากฉีก) ----------
const META={next:'ฮานาโกะซัง<br>ผีในห้องน้ำโรงเรียน'};
const backHead=`<ellipse cx="0" cy="-470" rx="57" ry="66" fill="${PAL.hair}"/>`;
const backPerson=(x,y,s,o={})=>at(x,y,s,fig({armL:o.armL||0,armR:o.armR||0,walk:o.walk})+backHead);
function withPal(p,fn){const old={...PAL}; Object.assign(PAL,p); const s=fn(); Object.assign(PAL,old); return s;}

// --- street ---
function jpStreet(o={}){
  const lamp=o.lamp==null?1:o.lamp;
  let s=`<rect x="-400" y="-400" width="1520" height="2100" fill="#0f1428"/>`;
  // houses
  s+=`<polygon points="-200,640 -60,540 80,640" fill="#0a0d1b"/><rect x="-180" y="640" width="250" height="300" fill="#0c1020"/>
      <polygon points="470,600 640,500 810,600" fill="#0a0d1b"/><rect x="490" y="600" width="300" height="340" fill="#0c1020"/>
      <rect x="-120" y="700" width="40" height="50" fill="#f5c76a" opacity="0.8"/><rect x="700" y="660" width="44" height="56" fill="#f5c76a" opacity="0.6"/>
      <polygon points="100,700 230,620 360,700" fill="#0b0e1d"/><rect x="120" y="700" width="220" height="230" fill="#0d1122"/>`;
  // road
  s+=`<polygon points="250,900 470,900 1100,1700 -380,1700" fill="#22263a"/><polygon points="-400,900 250,900 -380,1700 -400,1700" fill="#191c2c"/><polygon points="470,900 1120,900 1120,1700 1100,1700" fill="#191c2c"/>`;
  for(let i=0;i<6;i++){const y=920+i*i*22+i*30, w=4+i*3; s+=`<rect x="${360-w/2}" y="${y}" width="${w}" height="${12+i*8}" fill="#cfd3dc" opacity="0.5"/>`;}
  // poles + wires
  s+=`<rect x="96" y="260" width="14" height="660" fill="#1b1e2c"/><rect x="612" y="230" width="16" height="700" fill="#1b1e2c"/>
      <path d="M-200,330 Q100,380 103,300 Q360,360 620,270 Q800,320 920,290" stroke="#05060c" stroke-width="3" fill="none"/>
      <path d="M-200,360 Q120,410 103,330 Q360,400 620,300 Q800,350 920,320" stroke="#05060c" stroke-width="2" fill="none"/>`;
  // streetlight
  s+=`<rect x="560" y="300" width="60" height="8" fill="#1b1e2c"/><rect x="548" y="300" width="30" height="16" rx="5" fill="${lamp?'#fff4c8':'#3a3d4a'}"/>`;
  if(lamp) s+=`<polygon points="550,316 576,316 700,1000 420,1000" fill="#fff2bf" opacity="${0.16*lamp}"/><ellipse cx="560" cy="1000" rx="150" ry="26" fill="#fff2bf" opacity="${0.18*lamp}"/>`;
  // vending machine
  s+=`<rect x="20" y="640" width="150" height="330" rx="8" fill="#dfe8f5"/><rect x="32" y="656" width="126" height="170" fill="#eaf4ff"/>`;
  const cans=['#e8453c','#2f7de1','#f2b233','#3cb36b','#9a4fd1'];
  for(let r=0;r<3;r++) for(let c=0;c<5;c++) s+=`<rect x="${40+c*23}" y="${668+r*52}" width="14" height="34" rx="4" fill="${cans[(r+c)%5]}"/>`;
  s+=`<rect x="40" y="850" width="110" height="40" fill="#1b1e2c"/><ellipse cx="95" cy="985" rx="160" ry="30" fill="#bfe0ff" opacity="0.18"/><rect x="-60" y="600" width="300" height="420" fill="#bfe0ff" opacity="0.05"/>`;
  return s;
}
// --- the woman: red coat, long hair, mask; o.maskY 0..1 (pulled down), o.slit, o.tilt
function womanK(o={}){
  const coat='#7a1c22', skin='#efe3dc';
  const hairBack=`<path d="M-66,-500 Q-92,-320 -84,-180 L84,-180 Q92,-320 66,-500 Q0,-570 -66,-500Z" fill="#07070a"/>`;
  let body=withPal({top:coat,skin,pants:'#1a1414',shoe:'#0b0b0d'},()=>fig({walk:o.walk,armR:o.armR||0,armL:o.armL||0}));
  let s=hairBack+body+`<rect x="-72" y="-210" width="144" height="120" rx="20" fill="${coat}"/><rect x="-4" y="-400" width="8" height="300" fill="#5a1218"/>`;
  // eyes
  s+=`<ellipse cx="-21" cy="-478" rx="12" ry="7.5" fill="#fff"/><ellipse cx="21" cy="-478" rx="12" ry="7.5" fill="#fff"/>
      <circle cx="-21" cy="-478" r="4.6" fill="#141018"/><circle cx="21" cy="-478" r="4.6" fill="#141018"/>
      <path d="M-34,-484 q13,-9 26,0 M8,-484 q13,-9 26,0" stroke="#141018" stroke-width="3.5" fill="none"/>`;
  if(o.slit){ s+=`<path d="M-56,-462 Q-30,-420 0,-416 Q30,-420 56,-462 Q30,-438 0,-436 Q-30,-438 -56,-462Z" fill="#4a070d" stroke="#b3121f" stroke-width="4"/>
      ${[-36,-24,-12,0,12,24,36].map(x=>`<rect x="${x-4}" y="${-446+Math.abs(x)*0.25}" width="8" height="${12-Math.abs(x)*0.12}" fill="#f4efe6"/>`).join('')}
      <path d="M-56,-462 l-4,-14 M56,-462 l4,-14" stroke="#b3121f" stroke-width="4"/>
      ${[-44,-50,44,50].map(x=>`<path d="M${x-4},${-462+(Math.abs(x)-44)*-1.5} l8,6 M${x+4},${-462+(Math.abs(x)-44)*-1.5} l-8,6" stroke="#2a0306" stroke-width="2"/>`).join('')}`; }
  else s+=`<path d="M-10,-440 h20" stroke="#8a5a5a" stroke-width="3"/>`;
  // mask
  const my=(o.maskY||0)*58;
  s+=`<g transform="translate(0,${my})"><path d="M-54,-468 L-40,-462 M54,-468 L40,-462" stroke="#e4e8ec" stroke-width="3"/>
      <rect x="-42" y="-466" width="84" height="48" rx="14" fill="#f4f6f8"/><path d="M-36,-452 h72 M-36,-440 h72 M-36,-428 h72" stroke="#d3d9df" stroke-width="2"/></g>`;
  // bangs
  s+=`<path d="M-58,-490 Q-60,-552 0,-546 Q60,-552 58,-490 Q40,-512 20,-500 Q0,-516 -20,-500 Q-40,-512 -58,-490Z" fill="#07070a"/>`;
  if(o.scissors) s+=`<g transform="translate(96,-210) rotate(-30)"><path d="M0,0 L-8,-120 L8,-120Z" fill="#cfd5dc"/><path d="M0,0 L14,-118 L24,-112Z" fill="#b7bec7"/><circle cx="-10" cy="14" r="12" fill="none" stroke="#c23" stroke-width="6"/><circle cx="12" cy="14" r="12" fill="none" stroke="#c23" stroke-width="6"/></g>`;
  return o.tilt?`<g transform="rotate(${o.tilt} 0 -470)">${s}</g>`:s;
}
const closeW=(o,z,cy=-470)=>cam(0,cy,z,`<rect x="-900" y="-1500" width="1800" height="2600" fill="#141a30"/><ellipse cx="0" cy="-470" rx="260" ry="320" fill="#26305a" opacity="0.5"/>`+womanK(o));
const redFlash=(lt,a,b)=>{const k=1-seg(lt,a,b); return k>0?`<rect width="720" height="1280" fill="#b3121f" opacity="${k*0.55}"/>`:'';};

// ---------- scenes ----------
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{
    const inner=jpStreet()+at(560,1000,0.32,womanK({}))+at(lerp(330,350,p),lerp(1180,1300,ease(p)),lerp(0.75,0.95,ease(p)),fig({walk:lt*6,face:'calm'}));
    g=cam(360,lerp(760,800,ease(p)),lerp(1.0,1.1,ease(p)),inner);
    const fi=1-seg(lt,0,0.8); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 2: g=closeW({},lerp(3.2,3.8,ease(p))); break;
  case 3:{
    const a=seg(lt,0.1,0.6), b=seg(lt,2.3,2.6);
    const [sx,sy]=lt>2.3&&lt<2.7?shake(t,6):[0,0];
    g=`<defs><radialGradient id="rb" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#5a0d14"/><stop offset="1" stop-color="#12030a"/></radialGradient></defs>
      <rect width="720" height="1280" fill="url(#rb)"/>
      <g transform="translate(${sx},${sy})">${at(360,1500,1.5,womanK({slit:b>0.5,maskY:b}))}
      <text x="360" y="300" text-anchor="middle" font-family="P" font-size="34" fill="#f0c0c6" opacity="${a}">ตำนานผีญี่ปุ่น</text>
      <text x="360" y="390" text-anchor="middle" font-family="P" font-weight="700" font-size="76" fill="#fff" stroke="#000" stroke-width="8" paint-order="stroke" opacity="${a}">คุจิสะเกะอนนะ</text></g>`+redFlash(lt,2.3,2.8); break;}
  case 4:{
    const on=[0.3,0.45,1.1,1.25].reduce((v,k)=>lt>k?!v:v,true);
    const inner=jpStreet({lamp:on?1:0})+(on?at(560,1000,0.55,womanK({})):'')+backPerson(240,1500,1.2,{walk:lt*5});
    g=cam(lerp(360,480,ease(p)),lerp(760,820,ease(p)),lerp(1.05,1.4,ease(p)),inner); break;}
  case 5:{
    const k=ease(lt/4.0);
    const inner=jpStreet()+at(lerp(560,420,k),lerp(1000,1180,k),lerp(0.55,1.05,k),womanK({walk:lt*3.5}))+backPerson(230,1520,1.25);
    g=cam(lerp(480,400,k),lerp(820,820,k),lerp(1.4,1.6,k),inner)+heartOverlay(t,18,0.8,0.25); break;}
  case 6: g=closeW({tilt:lerp(0,-12,seg(lt,0,0.8))},lerp(3.6,4.2,ease(p)))+heartOverlay(t,22.2,0.8,0.25); break;
  case 7:{ const drop=`<path d="M70,-520 q10,18 0,26 q-10,-8 0,-26z" fill="#9fd3ff"/>`;
    g=cam(230,665,lerp(4.4,4.8,ease(p)),`<rect x="-500" y="-500" width="2000" height="2500" fill="#141a30"/>`+at(230,1120,1,fig({face:'calm'})+`<g transform="translate(0,${seg(lt,0.3,1.5)*30})">${drop}</g>`))+heartOverlay(t,25,0.8,0.25); break;}
  case 8:{ const m=seg(lt,0.4,2.6)*0.55;
    const handK=`<g transform="translate(-30,${-430+m*58})"><ellipse cx="0" cy="0" rx="22" ry="16" fill="#efe3dc"/><rect x="-16" y="-14" width="32" height="10" rx="5" fill="#efe3dc"/></g>`;
    g=closeW({maskY:m},lerp(3.8,4.4,ease(p)),-460)+cam(0,-460,lerp(3.8,4.4,ease(p)),handK)+heartOverlay(t,27.8,0.7,0.35); break;}
  case 9:{ const [sx,sy]=lt<0.9?shake(t,9):shake(t,2);
    g=`<g transform="translate(${sx},${sy})">${closeW({maskY:1,slit:true},lt<0.25?3.4:lerp(4.6,5.0,ease(p)),-455)}</g>`+redFlash(lt,0.2,0.9); break;}
  case 10:{ const [sx,sy]=shake(t,lt<1.5?3:1.5);
    g=`<g transform="translate(${sx},${sy})">${closeW({maskY:1,slit:true,tilt:lerp(0,10,ease(p))},lerp(5.4,6.6,ease(p)),-450)}</g>`; break;}
  case 11:{
    const a=seg(lt,0.1,0.5), b=seg(lt,2.7,3.1);
    g=`<rect width="720" height="1280" fill="#0d0f1c"/><rect x="0" y="0" width="720" height="640" fill="#1b0b10" opacity="${a}"/><rect x="0" y="640" width="720" height="640" fill="#170d1d" opacity="${b}"/>
      <g opacity="${a}"><text x="360" y="150" text-anchor="middle" font-family="P" font-weight="700" font-size="54" fill="#fff">ตอบว่า "ไม่สวย"</text>
       <g transform="translate(360,390) rotate(-20)"><path d="M0,60 L-16,-170 L16,-170Z" fill="#cfd5dc"/><path d="M0,60 L50,-160 L70,-150Z" fill="#b7bec7"/><circle cx="-22" cy="86" r="28" fill="none" stroke="#c23" stroke-width="12"/><circle cx="26" cy="86" r="28" fill="none" stroke="#c23" stroke-width="12"/></g>
       <text x="360" y="600" text-anchor="middle" font-family="P" font-weight="700" font-size="40" fill="#ff5b6b">= ถูกฆ่า</text></g>
      <g opacity="${b}"><text x="360" y="730" text-anchor="middle" font-family="P" font-weight="700" font-size="54" fill="#fff">ตอบว่า "สวย"</text>
       ${at(360,1520,1.15,womanK({maskY:1,slit:true}))}</g>
      <rect x="0" y="636" width="720" height="8" fill="#b3121f" opacity="${b}"/>`;
    break;}
  case 12:{ const q=0.6+0.4*Math.sin(t*5);
    g=cam(230,640,lerp(3.8,4.2,ease(p)),`<rect x="-500" y="-500" width="2000" height="2500" fill="#141a30"/>`+at(230,1120,1,fig({face:'calm'}))+
      `<text x="330" y="560" font-family="P" font-weight="700" font-size="60" fill="#ffd23f" opacity="${q}">?</text>`); break;}
  case 13:{
    if(lt<1.9){ const k=seg(lt,0,0.18);
      g=`<rect width="720" height="1280" fill="#101529"/><text x="360" y="560" text-anchor="middle" font-family="P" font-weight="700" font-size="${lerp(260,150,k)}" fill="#ffd23f" stroke="#000" stroke-width="12" paint-order="stroke" transform="rotate(-6 360 520)" opacity="${k}">ก็งั้นๆ</text>
        <text x="360" y="700" text-anchor="middle" font-family="P" font-size="34" fill="#c7cfe8" opacity="${seg(lt,0.6,1)}">ไม่ใช่ทั้ง "สวย" และ "ไม่สวย"</text>`; break; }
    const [sx,sy]=shake(t,3);
    g=cam(360,820,1.2,jpStreet()+at(560,940,0.3,womanK({}))+at(360,1250,0.95,fig({walk:lt*14,face:'scared'})),sx,sy); break;}
  case 14:{ const [sx,sy]=shake(t,3);
    g=cam(360,lerp(820,880,ease(p)),lerp(1.2,1.35,ease(p)),jpStreet()+at(560,940,lerp(0.3,0.15,p),womanK({}))+at(360,1260,1.0,fig({walk:lt*14,face:'scared',armL:20,armR:20})),sx,sy); break;}
  case 15:{
    g=cam(lerp(300,520,ease(p)),820,lerp(1.1,1.25,ease(p)),jpStreet()+backPerson(200,1560,1.3))+heartOverlay(t,55,0.75,0.3); break;}
  case 16:{ const open=seg(lt,0.8,1.6);
    const inner=`<rect x="-400" y="-400" width="1520" height="2100" fill="#07080f"/><rect x="230" y="400" width="260" height="600" fill="#0f1428"/>
      <rect x="230" y="400" width="${260*open}" height="600" fill="#2a3150"/>
      <rect x="${230+260*(1-open)}" y="400" width="${260*(1-open)}" height="600" fill="#3a2e2a"/>
      ${open>0.3?at(360,1000,0.9,fig({sil:'#05060c'})):''}
      <rect x="200" y="380" width="320" height="20" fill="#2a2420"/>`;
    g=cam(360,700,lerp(1.0,1.15,ease(p)),inner)+heartOverlay(t,58.2,0.75,0.3); break;}
  case 17:{
    if(lt>1.35){ g=`<rect width="720" height="1280" fill="#000"/>`; break; }
    const k=seg(lt,0.1,1.2); const [sx,sy]=shake(t,8);
    g=`<rect width="720" height="1280" fill="#05060c"/><g transform="translate(${sx},${sy})" opacity="${seg(lt,0,0.15)}">${cam(0,-455,lerp(3.2,6.0,k),`<rect x="-900" y="-1500" width="1800" height="2600" fill="#05060c"/>`+womanK({maskY:1,slit:true}))}</g>`;
    if(lt>1.18) g+=`<rect width="720" height="1280" fill="#fff" opacity="${1-seg(lt,1.18,1.35)}"/>`;
    break;}
  }
  return g+vignette(0.7);
}
