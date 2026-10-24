// usage: node render.js preview t1,t2,...  |  node render.js video [fps]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const dir = __dirname;
const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json')));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 } });
  await page.goto('file://' + path.join(dir, 'scene.html'));
  await page.evaluate(tl => window.setup(tl), tl);
  await page.evaluate(() => document.fonts.ready);
  const mode = process.argv[2];
  if (mode === 'preview') {
    fs.mkdirSync(path.join(dir, 'preview'), { recursive: true });
    for (const t of process.argv[3].split(',').map(Number)) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(dir, 'preview', `t${t.toFixed(2)}.png`) });
    }
  } else {
    const fps = Number(process.argv[3] || 30);
    const n = Math.ceil(tl.total * fps);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', path.join(dir, 'video_noaudio.mp4')],
      { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.render(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log(`frame ${i}/${n}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
