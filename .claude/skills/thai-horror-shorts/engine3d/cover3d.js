// cover for a 3D episode: render one moment, hide subtitles, add the title block.  usage: node cover3d.js T "badge" "line1" "line2" out.png
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [T, badge, l1, l2, out] = process.argv.slice(2); const dir = process.env.EP || __dirname;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  await p.goto('file://' + path.join(dir, 'scene3d.html')); await p.waitForFunction(() => window.ready);
  await p.evaluate(tl => window.setup(tl), JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'))));
  await p.evaluate(([t, badge, l1, l2]) => { window.render(+t); document.getElementById('sub').innerHTML = '';
    document.getElementById('title').style.display = 'block';
    document.getElementById('title').innerHTML = `<div style="position:absolute;top:0;left:0;right:0;height:300px;background:linear-gradient(#05060fdd,#05060f00)"></div>
      <div style="position:absolute;top:70px;width:100%"><div style="display:inline-block;background:#d7263d;font-weight:700;font-size:30px;padding:2px 18px 6px;border-radius:10px">${badge}</div>
      <div style="font-weight:700;font-size:74px;line-height:1.2;margin-top:10px;text-shadow:0 4px 0 #000,0 0 12px #000">${l1}<br><span style="color:#ffd23f">${l2}</span></div></div>
      <div style="position:absolute;bottom:60px;width:100%;font-weight:700;font-size:36px;text-shadow:0 3px 0 #000">หลอนก่อนนอน</div>`; }, [T, badge, l1, l2]);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(dir, out) }); await b.close();
})();
