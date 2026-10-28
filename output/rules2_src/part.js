const META={next:'ตอนจบ<br>กฎข้อที่เจ็ด'};
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{ g=`<g opacity="${1-seg(lt,2.6,3.4)}">${peephole({z:0.6,eye:1})}</g>`+fadeIn(lt,0.5); break;}
  case 2:{ const lobby=`<rect x="-400" y="-400" width="1520" height="2100" fill="#cbbfa8"/><rect x="-400" y="990" width="1520" height="700" fill="#8f7d66"/>
      <rect x="380" y="760" width="340" height="230" fill="#7a5a44"/><rect x="60" y="300" width="220" height="300" fill="#bfe3ff"/><rect x="60" y="300" width="220" height="300" fill="none" stroke="#7a5a44" stroke-width="12"/>`;
    g=cam(400,740,lerp(1.05,1.25,ease(p)),lobby+at(560,1150,1,landlady({face:'calm'}))+at(220,1150,1,fig({face:'calm'}))); break;}
  case 3:{ const pale=t>chunkT(3,0)+0.6;
    g=cam(0,-470,lerp(3.6,4.2,ease(p)),`<rect x="-900" y="-1500" width="1800" height="2600" fill="#cbbfa8"/>`+landlady({face:pale?'scared':'calm',pale})); break;}
  case 4:{ const z=t>chunkT(4,1)-0.2;
    g=cam(z?lerp(380,770,seg(t,chunkT(4,1)-0.2,chunkT(4,1)+1.2)):380,700,z?lerp(1.0,1.5,seg(t,chunkT(4,1)-0.2,chunkT(4,1)+1.2)):1.0,aptHall({light:1,taped:true})); break;}
  case 5:{ const hl=t>chunkT(5,1)-0.1?5:0; g=cam(360,lerp(450,760,seg(lt,1.2,2.2)),1.3,rulesPaper(hl,{bg:'#141a30'})); break;}
  case 6:{ const off=t>chunkT(6,1)-0.05;
    g=off?`<rect width="720" height="1280" fill="#000"/>`:cam(330,760,1.1,roomApt('calm')); if(off) g+=flash(t,chunkT(6,1)-0.05,chunkT(6,1)+0.15,'#fff'); break;}
  case 7:{ // counting 1..7 in the dark
    const ch=TL.chunks.filter(c=>c.scene===7); let n=0;
    ch.forEach((c,i)=>{const per=i<2?3:1; for(let k=0;k<per;k++){ const ts=c.start+(c.end-c.start)*k/per; if(t>=ts) n=i*3+k+1; }});
    const since=t-[...Array(n)].reduce((a,_,i)=>a,0);
    g=`<rect width="720" height="1280" fill="#000"/>`+(n?bigNum(n,{op:0.85}):''); break;}
  case 8:{ const [sx,sy]=shake(t,6); g=`<rect width="720" height="1280" fill="#000"/><g transform="translate(${sx},${sy})">${bigNum('8',{col:'#d11f2f',red:1,size:lerp(260,300,seg(lt,0,0.4))})}</g>`+flash(lt,0.2,0.6,'#3a0006'); break;}
  case 9: g=`<rect width="720" height="1280" fill="#000"/><g opacity="0.35">${cam(230,665,4.6,`<rect x="-500" y="-500" width="2000" height="2500" fill="#05070f"/>`+person('scared'))}</g>`+heartOverlay(t,0,0.7,0.3); break;
  case 10:{ const second=t>chunkT(10,1)-0.05; const [sx,sy]=shake(t,second?9:6);
    g=`<rect width="720" height="1280" fill="#000"/><g transform="translate(${sx},${sy})">${bigNum(second?'10':'9',{col:'#d11f2f',red:1,size:second?380:300})}</g>`+heartOverlay(t,0,0.6,0.4); break;}
  case 11:{ const k=seg(lt,0.6,2.4);
    g=`<rect width="720" height="1280" fill="#000"/><g opacity="0.45">${cam(230,640,lerp(3.4,3.9,ease(p)),`<rect x="-500" y="-500" width="2000" height="2500" fill="#05070f"/>`+
      `<g opacity="${k}">${at(lerp(420,330,k),1110,1.05,`<path d="M-66,-500 Q-92,-320 -84,-180 L84,-180 Q92,-320 66,-500 Q0,-570 -66,-500Z" fill="#000"/>`+fig({sil:'#000',face:'sscared'}))}</g>`+person('scared'))}</g>`+heartOverlay(t,0,0.6,0.45); break;}
  case 12:{ const h=seg(t,chunkT(12,1),chunkT(12,1)+0.5); const [sx,sy]=h>0?shake(t,7):[0,0];
    const handS=`<g transform="translate(150,${lerp(560,690,h)}) rotate(15)" opacity="${h}"><ellipse rx="40" ry="26" fill="#dfe3ea"/>${[-18,-6,6,18].map(d=>`<rect x="${d-6}" y="10" width="12" height="44" rx="6" fill="#dfe3ea"/>`).join('')}</g>`;
    g=`<rect width="720" height="1280" fill="#000"/><g transform="translate(${sx},${sy})" opacity="0.6">${cam(230,640,3.4,`<rect x="-500" y="-500" width="2000" height="2500" fill="#05070f"/>`+person('scared')+`<g transform="translate(230,640) scale(${1/3.4}) translate(-360,-640)">${handS}</g>`)}</g>`;
    if(h>0) g+=flash(t,chunkT(12,1)+0.1,chunkT(12,1)+0.6,'#b3121c');
    const end=TL.scenes.find(s=>s.scene===12).end; if(t>end-0.7) g+=`<rect width="720" height="1280" fill="#000"/>`; break;}
  }
  return g+vignette(0.7);
}
