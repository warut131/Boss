// ---------- EP5: ลิฟต์ที่หยุดชั้น 13 ----------
const META={ep:5,next:'ตุ๊กตาที่<br>ย้ายที่ทุกคืน'};
const backHead=`<ellipse cx="0" cy="-470" rx="57" ry="66" fill="${PAL.hair}"/>`;
const backPerson=(x,y,s,o={})=>at(x,y,s,fig({armL:o.armL||0,armR:o.armR||0})+backHead);
// woman: long hair; back view = hair covers the head
function woman(back,o={}){
  const hair=`<path d="M-66,-480 Q-84,-300 -78,-200 L78,-200 Q84,-300 66,-480 Q0,-560 -66,-480Z" fill="#050507"/>`;
  let s=fig({sil:'#0a0a10',face:back?null:(o.face||'sgrin')});
  return back?s+hair+`<ellipse cx="0" cy="-475" rx="58" ry="68" fill="#050507"/>`:hair+s;
}
function building(){
  let s=`<rect width="720" height="1280" fill="#0b1026"/><circle cx="590" cy="160" r="46" fill="#f3efd2"/><circle cx="590" cy="160" r="80" fill="#f3efd2" opacity="0.1"/>`;
  s+=`<rect x="170" y="140" width="380" height="1200" fill="#1c223a"/>`;
  let seed=11; const rnd=()=>((seed=seed*16807%2147483647)/2147483647);
  for(let r=0;r<16;r++){ const y=180+r*68, floor=17-r;
    for(let c=0;c<5;c++){ const lit=floor!==13&&rnd()>0.55;
      s+=`<rect x="${195+c*70}" y="${y}" width="46" height="40" fill="${floor===13?'#05060a':lit?'#f5d58a':'#2a3150'}"/>`; }
    if(floor===13) s+=`<text x="150" y="${y+32}" text-anchor="end" font-family="P" font-weight="700" font-size="30" fill="#ff3b3b">13</text>`; }
  return s;
}
// elevator interior facing the doors; open 0..1; view = what is behind the doors
function elevator(o={}){
  const open=o.open||0, lightOn=o.light==null?1:o.light;
  let s=`<rect x="-300" y="-300" width="1320" height="1900" fill="#7d8796"/>`;
  s+=`<rect x="-300" y="1000" width="1320" height="600" fill="#4a505b"/>`;
  for(let x=-300;x<1020;x+=120) s+=`<rect x="${x}" y="-300" width="4" height="1300" fill="#6c7584"/>`;
  // opening
  s+=`<rect x="190" y="290" width="340" height="710" fill="#23272f"/>`;
  s+=`<defs><clipPath id="dv"><rect x="200" y="300" width="320" height="700"/></clipPath></defs><g clip-path="url(#dv)">${o.view||''}</g>`;
  const w=160*(1-open);
  s+=`<rect x="200" y="300" width="${w}" height="700" fill="#a9b2bf"/><rect x="${520-w}" y="300" width="${w}" height="700" fill="#a9b2bf"/>`;
  if(open<0.02) s+=`<rect x="358" y="300" width="4" height="700" fill="#6c7584"/>`;
  // floor indicator
  s+=`<rect x="300" y="200" width="120" height="70" rx="8" fill="#0d0d12"/>
     <text x="360" y="254" text-anchor="middle" font-family="P" font-weight="700" font-size="50" fill="#ff3b3b" style="filter:drop-shadow(0 0 6px rgba(255,40,40,.8))">${o.floor==null?'1':o.floor}</text>`;
  // panel
  s+=`<rect x="570" y="520" width="80" height="260" rx="10" fill="#b8c0cb"/>`;
  for(let i=0;i<4;i++) s+=`<circle cx="610" cy="${560+i*50}" r="16" fill="${o.lit===i?'#ffcf5a':'#e4e8ee'}" stroke="#8b94a1" stroke-width="3"/>`;
  s+=`<rect x="0" y="-300" width="720" height="${300+18}" fill="#59606b"/><rect x="220" y="0" width="280" height="14" rx="7" fill="#fff8de" opacity="${lightOn}"/>`;
  if(lightOn<1) s+=`<rect x="-300" y="-300" width="1320" height="1900" fill="#000" opacity="${(1-lightOn)*0.7}"/>`;
  return s;
}
function corridor(o={}){
  let s=`<rect x="200" y="300" width="320" height="700" fill="#1a1d29"/>
    <polygon points="200,1000 520,1000 400,640 320,640" fill="#2a2e3d"/>
    <polygon points="200,300 320,600 320,640 200,1000" fill="#161926"/><polygon points="520,300 400,600 400,640 520,1000" fill="#161926"/>
    <rect x="320" y="600" width="80" height="40" fill="#1c2030"/><rect x="352" y="604" width="16" height="6" fill="#ff3b3b" opacity="0.6"/>`;
  if(o.w!=null){ const k=o.w; // 0 = far, 1 = right at the door
    s+=at(360,lerp(640,1180,k),lerp(0.08,1.25,Math.pow(k,1.6)),woman(true)); }
  return s;
}
const lobby=`<rect x="200" y="300" width="320" height="700" fill="#e8e1cf"/><rect x="200" y="860" width="320" height="140" fill="#c9b99b"/><rect x="250" y="420" width="90" height="140" fill="#9ab"/>`;

// ---------- scenes ----------
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{ g=cam(360,lerp(900,560,ease(p)),lerp(1.0,1.35,ease(p)),building());
    const fi=1-seg(lt,0,0.8); if(fi>0) g+=`<rect width="720" height="1280" fill="#000" opacity="${fi}"/>`; break;}
  case 2:{ const fl=(Math.sin(t*40)>-0.6)?1:0.4; const [sx,sy]=lt<0.6?shake(t,4):[0,0];
    g=cam(360,236,lerp(3.6,4.4,ease(p)),elevator({floor:'13',light:fl}),sx,sy); break;}
  case 3:{ const press=seg(lt,0.6,1.2)*(1-seg(lt,1.6,2.0));
    g=cam(400,640,1.05,elevator({floor:'1',lit:lt>1.2?2:null})+backPerson(330,1330,1.25,{armR:press*95})); break;}
  case 4:{ const n=Math.min(13,Math.floor(lerp(3,13.9,ease(lt/3.4))));
    const fl=[0.3,0.45,0.9,1.0,1.6].some(k=>lt>k&&lt<k+0.1)?0.15:1;
    g=cam(360,lerp(640,300,ease(p)),lerp(1.05,2.0,ease(p)),elevator({floor:n,light:fl,lit:2})+backPerson(330,1330,1.25)); break;}
  case 5:{ const open=seg(lt,0.3,1.4);
    g=cam(360,lerp(560,640,ease(p)),1.05,elevator({floor:'13',open,lit:2,view:corridor()})+backPerson(330,1330,1.25)); break;}
  case 6: g=cam(360,lerp(640,620,ease(p)),lerp(1.05,2.6,ease(p)),elevator({floor:'13',open:1,view:corridor({w:0})})+(p<0.3?backPerson(330,1330,1.25):'')); break;
  case 7:{ const tap=Math.abs(Math.sin(lt*21))>0.5&&lt>0.4&&lt<2.0;
    const hand=`<g transform="translate(${tap?600:640},${tap?690:720})"><circle r="26" fill="${PAL.skin}"/><rect x="-14" y="-60" width="22" height="60" rx="11" fill="${PAL.skin}" transform="rotate(-30)"/><rect x="10" y="10" width="120" height="50" rx="20" fill="${PAL.top}"/></g>`;
    const [sx,sy]=lt>2.3?shake(t,4):[0,0];
    g=cam(lerp(610,470,seg(lt,2.2,2.8)),lerp(660,640,seg(lt,2.2,2.8)),lerp(3.0,1.4,seg(lt,2.2,2.8)),elevator({floor:'13',open:1,lit:3,view:corridor({w:0.05})})+hand,sx,sy); break;}
  case 8: g=cam(360,640,1.25,elevator({floor:'13',open:1,view:corridor({w:lerp(0.08,0.45,ease(p))})})); break;
  case 9:{ const [sx,sy]=shake(t,lerp(1,5,p));
    g=cam(360,lerp(640,700,ease(p)),lerp(1.25,1.7,ease(p)),elevator({floor:'13',open:1,view:corridor({w:lerp(0.5,0.92,ease(p))})}),sx,sy); break;}
  case 10:{ const close=seg(lt,0.2,0.45), n=lt<0.8?13:Math.max(1,13-Math.floor((lt-0.8)*5));
    const [sx,sy]=lt>0.4&&lt<0.8?shake(t,10):shake(t,1.5);
    g=cam(360,lerp(640,500,seg(lt,0.8,1.6)),lerp(1.25,1.6,seg(lt,0.8,1.6)),elevator({floor:n,open:1-close,view:corridor({w:0.95})}),sx,sy); break;}
  case 11:{ const open=seg(lt,0.3,1.2), sigh=seg(lt,2.2,2.8);
    g=cam(360,640,1.05,elevator({floor:'1',open,view:lobby})+at(330,1330+sigh*10,1.25,fig({})+backHead)); break;}
  case 12:{ // the rear wall mirror: we see you (front) + what's behind you
    const hair=seg(lt,2.3,3.0);
    const refl=`<rect x="-300" y="-300" width="1320" height="1900" fill="#6b7482"/>`+
      `<g opacity="${0.35+hair*0.65}">${at(430,1200,1.15,woman(false,{face:hair>0.9?'sscared':null}))}</g>`+
      at(330,1330,1.25,fig({face:'scared'}))+
      `<path d="M300,610 Q262,700 262,800 Q262,880 282,930" stroke="#050507" stroke-width="16" fill="none" opacity="${hair}"/><path d="M318,612 Q290,700 296,820" stroke="#050507" stroke-width="10" fill="none" opacity="${hair}"/>`;
    g=cam(lerp(360,330,ease(p)),lerp(700,680,ease(p)),lerp(1.0,1.6,ease(p)),`<rect x="-300" y="-300" width="1320" height="1900" fill="#7d8796"/><rect x="60" y="120" width="600" height="1040" rx="10" fill="#c9d0d8"/>
      <defs><clipPath id="rm"><rect x="74" y="134" width="572" height="1012" rx="6"/></clipPath></defs><g clip-path="url(#rm)">${refl}<polygon points="74,134 260,134 74,460" fill="#fff" opacity="0.08"/></g>`);
    break;}
  case 13:{
    if(lt>1.3){ g=`<rect width="720" height="1280" fill="#000"/>`; break; }
    const k=seg(lt,0,0.9); const [sx,sy]=shake(t,8);
    const refl=`<rect x="-300" y="-300" width="1320" height="1900" fill="#6b7482"/>`+at(lerp(430,380,k),1200,1.15,woman(false,{face:'sgrin'}))+at(330,1330,1.25,fig({face:'scared'}));
    g=cam(lerp(370,400,k),lerp(660,620,k),lerp(1.8,3.2,k),refl,sx,sy);
    if(lt>1.15) g+=`<rect width="720" height="1280" fill="#fff" opacity="${1-seg(lt,1.15,1.3)}"/>`;
    break;}
  }
  return g+vignette(0.7);
}
