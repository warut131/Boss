const META={next:'เทเกะ เทเกะ<br>ผีครึ่งตัวริมรางรถไฟ'};
window.setup=tl=>{TL=tl; TL.allKnocks=knocksFrom(tl);};
const R7=['ถ้าคุณจำไม่ได้ว่า','ย้ายเข้ามาวันไหน','ให้หนีออกไปทันที'];
const R7mine=['อย่าเปิดประตู','ให้ฉันนะ'];
function draw(sc,lt,p,t){
  let g='';
  switch(sc){
  case 1:{ const n=lt<1.0?'8':lt<2.0?'9':'10'; g=`<rect width="720" height="1280" fill="#000"/>`+bigNum(n,{col:'#d11f2f',red:1,op:1-seg(lt,2.6,3.2)}); break;}
  case 2:{ const on=lt>0.15; g=on?cam(lerp(330,420,ease(p)),760,1.1,room('bright',{door:true})+person('scared')+bed('morning')+blanket('morning')):`<rect width="720" height="1280" fill="#000"/>`; if(on) g+=flash(lt,0.15,0.6); break;}
  case 3:{ const pap=`<g transform="translate(260,960) rotate(-10)"><rect x="-60" y="-30" width="120" height="60" fill="#efe6d2"/><path d="M-40,-10 h70 M-40,8 h50" stroke="#a3121c" stroke-width="5"/></g>`;
    g=cam(lerp(300,260,ease(p)),lerp(820,960,ease(p)),lerp(1.2,3.0,ease(p)),room('bright',{door:true})+bed('morning')+pap+blanket('morning')); break;}
  case 4: g=cam(360,lerp(740,780,ease(p)),1.3,rulesPaper(7,{rule7:R7,bg:'#141a30',y:440})); break;
  case 5:{ const cal=`<g transform="translate(480,380)"><rect x="0" y="0" width="200" height="220" fill="#f4f0e4"/><rect x="0" y="0" width="200" height="40" fill="#b3121c"/>
      ${[...Array(28)].map((_,i)=>`<path d="M${12+(i%7)*26},${54+Math.floor(i/7)*40} l16,24 M${28+(i%7)*26},${54+Math.floor(i/7)*40} l-16,24" stroke="#a3121c" stroke-width="3" opacity="${seg(lt,i*0.06,i*0.06+0.1)}"/>`).join('')}</g>`;
    g=cam(lerp(300,560,seg(t,chunkT(5,1)-0.3,chunkT(5,1)+0.6)),lerp(700,500,seg(t,chunkT(5,1)-0.3,chunkT(5,1)+0.6)),lerp(1.4,2.2,ease(p)),room('bright',{door:true,noWardrobe:true})+cal+person('scared')+bed('morning')+blanket('morning'))+heartOverlay(t,0,0.75,0.25); break;}
  case 6:{ // stairwell
    let st=`<rect x="-400" y="-400" width="1520" height="2100" fill="#4a4a52"/>`;
    for(let i=0;i<14;i++) st+=`<rect x="${-200+i*70}" y="${300+i*70}" width="${1200}" height="70" fill="${i%2?'#5c5c66':'#55555f'}"/>`;
    st+=`<path d="M-200,240 L800,1240" stroke="#2a2a30" stroke-width="12"/>`;
    const k=ease(lt/2.6); const [sx,sy]=shake(t,4);
    g=cam(lerp(160,560,k),lerp(560,960,k),1.3,st+at(lerp(120,560,k),lerp(820,1220,k),0.9,fig({walk:lt*14,face:'scared'})),sx,sy); break;}
  case 7: g=cam(360,700,lerp(1.05,1.25,ease(p)),`<rect x="-400" y="-400" width="1520" height="2100" fill="#2e2a24"/><rect x="-400" y="990" width="1520" height="700" fill="#1e1a16"/><rect x="380" y="760" width="340" height="230" fill="#4a3628"/>`+at(470,1150,1,landlady({face:'stare',pale:true}))+meBack(200,1450,1.2))+heartOverlay(t,0,0.75,0.3); break;
  case 8: g=cam(0,-470,lerp(3.8,4.6,ease(p)),`<rect x="-900" y="-1500" width="1800" height="2600" fill="#2e2a24"/>`+landlady({face:'calm'}))+heartOverlay(t,0,0.7,0.35); break;
  case 9:{ const see=t>chunkT(9,1)-0.1; const op=see?lerp(0.9,0.3,seg(t,chunkT(9,1)-0.1,chunkT(9,1)+0.8)):0.95;
    const flick=see&&Math.sin(t*30)>0.6?0.15:0;
    let fl=`<rect width="720" height="1280" fill="#1e1a16"/>`; for(let r=0;r<10;r++) for(let c=0;c<6;c++) if((r+c)%2) fl+=`<rect x="${c*120}" y="${r*130}" width="120" height="130" fill="#2a241e"/>`;
    const handV=(x,flip)=>`<g transform="translate(${x},760) scale(${flip?-1:1},1)"><ellipse rx="90" ry="110" fill="${SKIN}"/>${[-60,-20,20,60].map(d=>`<rect x="${d-16}" y="-260" width="32" height="170" rx="16" fill="${SKIN}"/>`).join('')}<rect x="80" y="-60" width="30" height="110" rx="15" fill="${SKIN}" transform="rotate(30 95 0)"/></g>`;
    g=fl+`<g opacity="${op-flick}">${handV(220,true)}${handV(500,false)}</g>`+(see?heartOverlay(t,0,0.6,0.4):''); break;}
  case 10:{ const lob=`<rect x="-400" y="-400" width="1520" height="2100" fill="#cbbfa8"/><rect x="-400" y="990" width="1520" height="700" fill="#8f7d66"/><rect x="60" y="300" width="220" height="300" fill="#bfe3ff"/>`;
    const give=seg(t,chunkT(10,1),chunkT(10,1)+0.8);
    g=cam(380,740,1.1,lob+at(520,1150,1,landlady({face:'grin',armL:give*70}))+withPal({top:'#2f6b4a',hair:'#4a2f20'},()=>at(240,1150,1,fig({face:'calm',armR:give*60})))+`<rect x="${lerp(430,350,give)}" y="830" width="60" height="40" fill="#efe6d2" opacity="${give}"/>`); break;}
  case 11:{ const hl=t>chunkT(11,1)-0.1; const [sx,sy]=hl&&t<chunkT(11,1)+0.5?shake(t,5):[0,0];
    g=`<g transform="translate(${sx},${sy})">${cam(360,hl?lerp(560,680,seg(t,chunkT(11,1)-0.1,chunkT(11,1)+0.8)):560,hl?lerp(1.0,1.6,seg(t,chunkT(11,1)-0.1,chunkT(11,1)+0.8)):1.0,rulesPaper(hl?7:0,{rule7:R7mine,bg:'#2a2420',y:440}))}</g>`; break;}
  case 12:{ const kn=TL.allKnocks.some(k=>t>k-0.1&&t<k+0.12); const [sx,sy]=knockShake(t,6);
    g=cam(lerp(360,360,ease(p)),lerp(700,640,ease(p)),lerp(1.0,1.4,ease(p)),aptHall({light:0.6,extra:ghostMe(300,1180,1.0,'stare',{armR:kn?75:50,op:0.6})+knockFx(t,360,700,44)}),sx,sy)+heartOverlay(t,0,0.75,0.3); break;}
  case 13:{ const end=TL.scenes.find(s=>s.scene===13); if(t>end.end-0.9){ g=`<rect width="720" height="1280" fill="#000"/>`; break; }
    const k=seg(lt,0,1.4); const [sx,sy]=shake(t,lt<1.4?6:2);
    g=`<g transform="translate(${sx},${sy})">${cam(300,665,lerp(3.0,5.6,k),aptHall({light:0.4})+ghostMe(300,1180,1.0,'grin',{op:0.8}))}</g>`;
    if(lt>1.3) g+=flash(lt,1.3,1.6); break;}
  }
  return g+vignette(0.7);
}
