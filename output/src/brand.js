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
      document.body.style.width = w + 'px'; document.body.style.height = h + 'px';
      document.body.innerHTML = new Function('NAME', 'HANDLE', 'return `' + body + '`')(NAME, HANDLE);
    }, [w, h, body, NAME, HANDLE]);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(dir, out) });
    await page.close();
  };

  // profile picture (circle-safe): grinning shadow head under the moon
  await shot(720, 720, 'brand_profile.png', `
<svg width="720" height="720" viewBox="0 0 720 720">
 <defs><radialGradient id="bg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#34407a"/><stop offset="1" stop-color="#0c1026"/></radialGradient></defs>
 <rect width="720" height="720" fill="url(#bg)"/>
 <circle cx="500" cy="190" r="70" fill="#f3efd2"/><circle cx="500" cy="190" r="120" fill="#f3efd2" opacity="0.1"/>
 \${at(360,1530,2.25,fig({sil:'#05060f',face:'sgrin'}))}
 <text x="360" y="640" text-anchor="middle" font-family="P" font-weight="700" font-size="64" fill="#fff" stroke="#05060f" stroke-width="10" paint-order="stroke">\${NAME}</text>
</svg>`);

  // EP1 cover / thumbnail 9:16
  await shot(720, 1280, 'cover_ep1.png', `
<svg width="720" height="1280" viewBox="0 0 720 1280">
 \${cam(400,640,1.08,room('night')+wallShadow(450,{face:'sgrin',armL:25,armR:25})+at(250,1150,1,fig({face:'scared'})))}
 \${vignette(0.8)}
 <rect x="0" y="0" width="720" height="300" fill="#05060f" opacity="0.55"/>
</svg>
<div style="position:absolute;top:70px;left:0;right:0;text-align:center;color:#fff">
 <div style="display:inline-block;background:#d7263d;color:#fff;font-weight:700;font-size:30px;padding:2px 18px 6px;border-radius:10px">EP.1</div>
 <div style="font-weight:700;font-size:74px;line-height:1.2;margin-top:10px;text-shadow:0 4px 0 #000,0 0 12px #000">เงาที่ช้ากว่า<br><span style="color:#ffd23f">ครึ่งจังหวะ</span></div>
</div>
<div style="position:absolute;bottom:60px;left:0;right:0;text-align:center;color:#fff;font-weight:700;font-size:36px;text-shadow:0 3px 0 #000">\${NAME} · \${HANDLE}</div>`);

  await browser.close();
})();
