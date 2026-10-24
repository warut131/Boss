// Render channel profile picture and EP1 cover using the scene.html drawing helpers.
const { chromium } = require('playwright');
const path = require('path');
const dir = __dirname;
const NAME = process.argv[2] || 'หลอนก่อนนอน';
const HANDLE = process.argv[3] || '@lonkonnon';

(async () => {
  const browser = await chromium.launch();
  const shot = async (w, h, out, body) => {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1.5 });
    await page.goto('file://' + path.join(dir, 'scene.html'));
    await page.evaluate(([w, h, body, NAME, HANDLE]) => {
      TL = { allKnocks: [0] }; document.body.style.width = w + 'px'; document.body.style.height = h + 'px';
      document.body.innerHTML = new Function('NAME', 'HANDLE', 'return `' + body + '`')(NAME, HANDLE);
    }, [w, h, body, NAME, HANDLE]);
    await page.evaluate(() => { TL = { allKnocks: [0] }; return document.fonts.ready; });
    await page.screenshot({ path: path.join(dir, out) });
    await page.close();
  };

  // EP1 cover / thumbnail 9:16
  await shot(720, 1280, 'cover_ep2.png', `
<svg width="720" height="1280" viewBox="0 0 720 1280">
 \${cam(300,800,1.35,room('night')+person('scared')+bed('night')+blanket('night')+hand(340,836,1)+knockFx(0.15,250,975,50))}
 \${vignette(0.8)}
 <rect x="0" y="0" width="720" height="300" fill="#05060f" opacity="0.55"/>
</svg>
<div style="position:absolute;top:70px;left:0;right:0;text-align:center;color:#fff">
 <div style="display:inline-block;background:#d7263d;color:#fff;font-weight:700;font-size:30px;padding:2px 18px 6px;border-radius:10px">EP.2</div>
 <div style="font-weight:700;font-size:74px;line-height:1.2;margin-top:10px;text-shadow:0 4px 0 #000,0 0 12px #000">มีคนเคาะ<br><span style="color:#ffd23f">จากใต้เตียง</span></div>
</div>
<div style="position:absolute;bottom:60px;left:0;right:0;text-align:center;color:#fff;font-weight:700;font-size:36px;text-shadow:0 3px 0 #000">\${NAME}</div>`);

  await browser.close();
})();
