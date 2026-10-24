// Episode cover 9:16. usage: node cover.js EPDIR EPNUM "line1" "line2" "<svg expression using the episode's helpers>"
const { chromium } = require('playwright');
const path = require('path');
const [dir, ep, l1, l2, expr] = process.argv.slice(2);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  await page.goto('file://' + path.resolve(dir, 'scene.html'));
  await page.evaluate(([ep, l1, l2, expr]) => {
    TL = { allKnocks: [] };
    const art = new Function('return ' + expr)();
    document.body.innerHTML = `<svg width="720" height="1280" viewBox="0 0 720 1280">${art}${vignette(0.8)}
      <rect x="0" y="0" width="720" height="300" fill="#05060f" opacity="0.55"/></svg>
      <div style="position:absolute;top:70px;left:0;right:0;text-align:center;color:#fff">
       <div style="display:inline-block;background:#d7263d;font-weight:700;font-size:30px;padding:2px 18px 6px;border-radius:10px">EP.${ep}</div>
       <div style="font-weight:700;font-size:74px;line-height:1.2;margin-top:10px;text-shadow:0 4px 0 #000,0 0 12px #000">${l1}<br><span style="color:#ffd23f">${l2}</span></div></div>
      <div style="position:absolute;bottom:60px;left:0;right:0;text-align:center;color:#fff;font-weight:700;font-size:36px;text-shadow:0 3px 0 #000">${CHANNEL}</div>`;
  }, [ep, l1, l2, expr]);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.resolve(dir, `cover_ep${ep}.png`) });
  await browser.close();
})();
