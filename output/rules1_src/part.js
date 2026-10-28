const META={next:'ห้อง 404<br>ที่ว่างมาสิบปี'};
window.setup=tl=>{TL=tl; TL.allKnocks=knocksFrom(tl,c=>c.scene===9);};
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1: g=cam(360,lerp(760,690,ease(p)),lerp(1.0,1.45,ease(p)),building())+fadeIn(lt); break;
  case 2: g=cam(330,720,lerp(1.15,1.35,ease(p)),aptHall({light:1})+at(360,1150,1,landlady({face:'grin',armR:lerp(0,70,seg(lt,0.8,1.5))}))); break;
  case 3:{ const [sx,sy]=lt>2.2&&lt<2.6?shake(t,5):[0,0];
    g=`<g transform="translate(${sx},${sy})">${cam(360,lerp(600,900,seg(lt,1.8,2.6)),lerp(1.0,1.5,seg(lt,1.8,2.6)),rulesPaper(0))}</g>`; break;}
  case 4:{ const hl=t<chunkT(4,1)-0.1?1:t<chunkT(4,2)-0.1?2:3;
    g=cam(360,lerp(380,560,(hl-1)/2),1.25,rulesPaper(hl)); break;}
  case 5: g=cam(330,760,lerp(1.05,1.15,ease(p)),roomApt('closed')); break;
  case 6:{ const [sx,sy]=knockShake(t,6); const awake=t>TL.allKnocks[0];
    g=cam(lerp(360,520,ease(p)),760,lerp(1.05,1.3,ease(p)),roomApt(awake?'scared':'closed')+knockFx(t,598,700,44),sx,sy)+heartOverlay(t,0,0.8,0.2); break;}
  case 7: g=cam(598,lerp(820,900,ease(p)),lerp(2.0,2.6,ease(p)),roomApt('scared',{feet:1,fx:0}))+heartOverlay(t,0,0.8,0.3); break;
  case 8:{ g=cam(230,665,lerp(4.4,4.9,ease(p)),`<rect x="-500" y="-500" width="2000" height="2500" fill="#1e2546"/><ellipse cx="160" cy="700" rx="190" ry="70" fill="#9aa4c6"/>`+person('scared')+blanket('night'))+heartOverlay(t,0,0.8,0.3);
    if(t>chunkT(8,1)) g+=`<g opacity="${seg(t,chunkT(8,1),chunkT(8,1)+0.3)}"><rect x="40" y="80" width="640" height="110" rx="14" fill="#efe6d2"/><text x="360" y="150" text-anchor="middle" font-family="P" font-weight="700" font-size="40" fill="#3a2f2a">2. มีคนเคาะประตู ห้ามเปิด</text></g>`;
    break;}
  case 9:{ const [sx,sy]=knockShake(t,12);
    g=cam(598,780,lerp(1.8,2.2,ease(p)),roomApt('scared',{feet:1})+knockFx(t,598,700,48),sx,sy)+heartOverlay(t,0,0.6,0.45); break;}
  case 10: g=cam(598,lerp(820,860,ease(p)),2.0,roomApt('scared',{feet:1-seg(lt,0.5,1.5)})+dim(0.35))+heartOverlay(t,0,0.8,0.3); break;
  case 11:{ const k=ease(lt/3.2);
    g=cam(lerp(450,598,k),lerp(780,690,k),lerp(1.2,4.0,k),room('night',{door:true})+`<circle cx="598" cy="690" r="7" fill="#111"/>`+doorLight({})+bed('night')+blanket('night')+meBack(lerp(330,560,k),1500,1.3,{walk:lt*4}))+heartOverlay(t,0,0.8,0.3); break;}
  case 12: g=peephole({z:lerp(0.5,0.6,ease(p))})+heartOverlay(t,0,0.8,0.35); break;
  case 13:{ const eye=t>chunkT(13,1)-0.05?seg(t,chunkT(13,1)-0.05,chunkT(13,1)+0.15):0; const [sx,sy]=eye>0?shake(t,10):[0,0];
    g=`<g transform="translate(${sx},${sy})">${peephole({z:0.6,eye})}</g>`+heartOverlay(t,0,0.6,0.4);
    if(eye>0) g+=flash(t,chunkT(13,1)-0.05,chunkT(13,1)+0.5,'#b3121c');
    if(lt>p*0+(TL.scenes.find(s=>s.scene===13).end-TL.scenes.find(s=>s.scene===13).start)-0.6) g+=`<rect width="720" height="1280" fill="#000"/>`;
    break;}
  }
  return g+vignette(0.7);
}
