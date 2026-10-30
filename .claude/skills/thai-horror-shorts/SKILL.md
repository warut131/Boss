---
name: thai-horror-shorts
description: Make 9:16 Thai horror-story shorts (Reels/TikTok/Shorts) in a flat 2D cartoon style, with Thai AI narration, Thai subtitles, a music-box background track, sound effects and a spoken "follow" outro, all rendered to MP4. Use when the user asks for a เรื่องผี / เรื่องหลอน / horror story clip, the next episode of the "หลอนก่อนนอน" series, a clip "like this reel", or a cover/thumbnail, title, caption or hashtags for one.
---

# Thai horror shorts (หลอนก่อนนอน)

Each episode is about 60–75 s long, has 12 to 17 scenes, is narrated in the second person ("คุณ…") and ends on a twist, then an end card ("ตอนต่อไป …" followed by "อย่าลืมกดติดตาม"). **No EP numbers** appear on end cards or covers; the user asked for them to be removed. Well-known legends work well, for example Japanese ones such as Kuchisake-onna and Hanako-san.
Everything is generated in code. The art is SVG drawn in Chromium and captured frame by frame with Playwright. The voice comes from Microsoft Edge TTS. Music and SFX are synthesised. No stock assets are used, so the output has no copyright issues.

## Requirements

- `ffmpeg`/`ffprobe`, `python3` with `numpy`, `node` with `playwright` (Chromium), and `pip install edge-tts`.
- **Network access to `speech.platform.bing.com`.** The environment's network policy must allow this host, otherwise TTS fails with 403 or DNS errors. Call `edge-tts` with `--proxy "$HTTPS_PROXY"`. It sometimes returns `NoAudioReceived` or a truncated file; `gen_ep.py` validates each file and retries up to 15 times with backoff.
- `export NODE_PATH=$(npm root -g)` when Playwright is installed globally (`build.sh` sets this).

## Layout

```
engine/
  build.sh       one episode end to end (narration → music → mix → render → mux)
  gen_ep.py      narration (edge-tts) + timeline.json + outro voice
  gen_music.py   music-box lullaby, silent in SIL windows
  mix_ep.py      voice + drone + ducked music + SFX events
  render.js      Playwright frame renderer (preview stills or 30 fps video)
  cover.js       9:16 cover/thumbnail
  head.html      page shell, Prompt font, character fig(), faces, room(), cam(), CHANNEL
  lib.js         shared props + subtitle/end-card renderer
  sfx/*.wav      hit knock beat step creak vib ring ding hum click door whoosh crack shutter static squeak
  fonts/         Prompt 500/700 (OFL)
  outro.wav      "อย่าลืมกดติดตาม หลอนก่อนนอน แล้วเจอกันตอนหน้านะ"
  make_outro.sh  regenerate outro.wav for another channel name
examples/ep4 ep5 ep6 kuchisake hanako   complete episodes (script.py + scenes.js) to copy from
```

## Making an episode

1. **Write the story first and show it to the user** as a scene table (scene → narration → visual). Keep lines short. Each scene should have one beat. Use 2–3 red-box lines for the scariest words. Ending: a twist plus the next-episode title.
2. Create `EPDIR/script.py` (copy an example):
   - `SCRIPT = [(scene, [(text, style), ...]), ...]`
     - Styles: `n` white, `y` yellow, `r` red box (narrator, male `th-TH-NiwatNeural`)
     - `f` is a female voice close by, `m` is a distant female voice, and `c` is a little girl (all get pink italic subtitles in quotes)
     - `v` is the narrator's own voice, distorted, for a final reveal (red box, shaking)
     - `x` is a distorted female whisper (red box, shaking)
     - `k:<sfx>:<sec>` is an SFX-only pause with no voice and no subtitle
   - `SCENE_PAD = {scene: extra_seconds}` gives a pause after a scene. Use it for dread.
   - `SIL_SCENES = [(from, to)]` sets the scenes where the music drops out. Use it for the tension stretch.
   - `HEART(sc)` returns `[(t_from, t_to, period)]` heartbeat ranges.
   - `EVENTS(sc, ch)` returns `[(sfx, time, volume)]`. Times come from `sc[n]["start"]` or chunk starts.
3. Run `python3 engine/gen_ep.py EPDIR` and read the printed timings. Total length should be about 55–68 s.
4. Write `EPDIR/scenes.js`:
   - Define `const META={next:'ชื่อตอนต่อไป<br>บรรทัดสอง'};`
   - Define `function draw(sc,lt,p,t){ switch(sc){…} return g+vignette(0.7); }`. Here `lt` is the time within the scene, `p` is the progress from 0 to 1, and `t` is the absolute time.
5. Preview before the full render: `engine/build.sh EPDIR out.mp4 preview 2,8,15,...`. Tile the PNGs with `ffmpeg … tile=8x2` and **look at them**. Fix overlaps, unreadable dark-on-dark, and subtitles covering the key prop.
6. Full build: `engine/build.sh EPDIR name_epN.mp4` takes about 1.5 min for 60 s. Run it in the background and check a few frames of the final MP4.
7. Make the cover: `node engine/cover.js EPDIR "<badge, e.g. ตำนานผีญี่ปุ่น>" "บรรทัด1" "บรรทัด2" "<svg expression>" cover_name.png`. Do not put an EP number on the badge.
8. Give the user the title, a caption, and **exactly 5 hashtags** (the user's preference):
   `#เรื่องผี #หลอนก่อนนอน #การ์ตูนผี #ขนลุก #fyp`

## Drawing API (head.html + lib.js)

- **Maths:** `lerp(a,b,p)`, `ease(p)` (smoothstep), `seg(t,a,b)` (eased 0→1 between a and b), `clamp`, `shake(t,amp)` → `[dx,dy]`
- **Camera:** `cam(cx,cy,zoom,inner,dx,dy)` centres the world point `(cx,cy)`. The world is 720×1280, floor y≈990.
- **Character:** `fig({face, armL, armR, walk, sil, faceOp})` with feet at the origin, about 530 px tall. Place it with `at(x,y,scale,svg)`.
  - Arms take degrees raised. `walk` is a phase (pass `lt*7`). `sil:'#000'` gives a silhouette.
  - Faces: `calm closed scared grin` plus silhouette faces `sgrin sscared`. EP4 adds `stare` and EP6 adds `button`, by wrapping `face` the same way.
  - `person(face,o)` draws the character with legs clipped so he can sit behind a bed.
- **Rooms:** `room(mode,{door,doorOpen,noWardrobe,frames})` with mode `night|bright|morning`. Also `bed(mode)`, `blanket(mode)`, `roomD(face,{feet,fx,doorOpen,extra})` (room with a lit door gap and feet shadows), `doorLight`.
- **Shadows:** `wallShadow(x, figOpts, colour)` draws the character's shadow on the wall (EP1).
- **Props:**
  - Body parts and marks: `hand(x,y,grip)` (pale hand), `handprint(x,y,s,rot,colour)`, `mouthHands`
  - Knocks: `knockFx(t,x,y)` / `knockShake(t)` read `TL.allKnocks`
  - Objects: `knob(angle)`, `phone({msgs|ring,t})`, `momSil()`
- **Overlays:** `heartOverlay(t,t0,period,k)` (red pulse), `dim(a)`, `vignette(k)`, `closeFace(face,zoom,extra,bg)`
- **Example-only helpers** (copy them if needed):
  - EP4: `bathroom/mirror/tiles`
  - EP5: `elevator/corridor/woman/building/backPerson`
  - EP6: `bear/shelf/desk/playback` (night-vision camera UI)
  - kuchisake: `jpStreet` (Japanese night street with vending machine), `womanK` (red coat, mask, `maskY`, `slit`, `scissors`), `withPal` (recolour `fig`), split-screen choice card
  - hanako: `schoolExt`, `hallway`, three-stall `bathroom({open3,peek,feet,eyes,light})`, `girl()` (bob cut, red skirt); it overrides `window.setup` to derive knock times from `k` chunks

## Multi-part series

`examples/rules/` is a 3-part serial ("ห้องเช่ากฎ 7 ข้อ"). Shared props live in `common.js`. Each part's `scenes.js` is `cat common.js partN/part.js`. Label parts with words, not numbers: ตอนแรก / ตอนสอง / ตอนจบ (on the cover badge and in the end-card `next`).
- End parts 1 and 2 on a cliffhanger.
- Open parts 2 and 3 with a one-line recap ("ตอนที่แล้ว…").
- Make the final part loop back on the first one.

## 3D style (Three.js)

`examples/teke3d/` uses real 3D instead of SVG: a toy/diorama look with low-poly scenery, soft shadows, fog, street lamps, blinking crossing lights and a camera that moves through the scene. Audio, music and the mix are the same as for 2D episodes.

1. Three.js r169 is bundled at `engine3d/three/` (MIT licence), so there is nothing to install.
2. In the episode folder, create two symlinks:
   - `ln -s <skill>/engine3d/three three`
   - `ln -s <skill>/engine/fonts fonts`
3. Write `script.py` and run `engine/gen_ep.py`, `engine/gen_music.py` and `engine/mix_ep.py` as for 2D.
4. Put the episode in `EPDIR/scene3d.html`, starting from the example. It defines `window.setup(tl)` and `window.render(t)`:
   - `render(t)` places the meshes and the camera through `shot(...)`, then calls `R.render`.
   - HTML overlays draw the subtitles, the title and the end card.
5. Preview with `EP=EPDIR node engine3d/render3d.js preview 3,10,20`, then render with `video 30`. Then mux `video_noaudio.mp4` with `mix.wav` using ffmpeg.
6. Make the cover with `EP=EPDIR node engine3d/cover3d.js <t> "badge" "line1" "line2" cover.png`.

Things to know:
- Chromium renders WebGL in software through SwiftShader, at about 0.6–1 s per frame. A 60 s clip takes about 25–30 min, so run it in the background.
- When waiting on the render, wait on its PID (`kill -0`). Never use `pgrep -f` with a pattern that also appears in your own wait loop, because the loop then matches itself.
- Characters need the fill light that follows the camera (`fill`), or their faces go black. Hair should be a top hemisphere, not a full sphere, or it covers the face.
- For the half-body ghost lying forward, `look(1)` makes the face point forward.

## House style that worked

- Dark navy night palette, warm door light, a vignette on everything, and slow push-in cameras.
- Hard shakes only on hits.
- Close-ups of the face at zoom ≈4.6 centred on `(230,665)`.
- Music stops for the scariest stretch so only drone and heartbeat remain. The final scare is a flash to white, then black.
- Subtitles auto-shrink, and long lines break at the space nearest the middle. Keep lines under about 30 Thai characters.

## Channel settings

- `CHANNEL` is set in `head.html`.
- Change the spoken outro with `engine/make_outro.sh "อย่าลืมกดติดตาม <ชื่อ> แล้วเจอกันตอนหน้านะ"`.
