#!/usr/bin/env python3
"""Mix EP3: voice + drone + music box (ducked) + phone/footsteps/creak/heartbeat/ring/slam -> mix.wav"""
import json, os, subprocess

P = os.path.dirname(os.path.abspath(__file__))
os.chdir(P)
d = json.load(open("timeline.json"))
T = d["total"]
sc = {s["scene"]: s for s in d["scenes"]}

ev = [("sfx/vib.wav", 16.75, 1.0), ("sfx/vib.wav", sc[6]["start"], 0.8), ("sfx/vib.wav", sc[12]["start"], 1.0)]
ev += [("sfx/step.wav", sc[9]["start"] + 0.55 * k, 0.4 + 0.15 * k) for k in range(5)]
ev += [("sfx/creak.wav", sc[11]["start"] + 1.0, 1.0)]
ev += [("sfx/ring.wav", sc[14]["start"] + 1.4, 0.7)]
for a, b, per in [(sc[7]["start"], sc[8]["start"], 0.9), (sc[9]["start"], sc[10]["start"], 0.85),
                  (sc[11]["start"], sc[14]["start"], 0.75)]:
    x = a + 0.2
    while x < b - 0.3:
        ev += [("sfx2/beat.wav", x, 0.9), ("sfx2/beat.wav", x + 0.24, 0.6)]
        x += per
s15 = sc[15]["start"]
ev += [("sfx0/door.wav", s15, 1.0), ("sfx0/whoosh.wav", s15 + 0.05, 1.0), ("sfx0/hit.wav", s15 + 0.2, 1.0),
       ("sfx0/hit.wav", s15 + 1.12, 0.8), ("sfx0/hit.wav", sc[7]["start"] + 0.2, 0.45)]

subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i",
    f"aevalsrc=0.5*sin(2*PI*55*t)+0.4*sin(2*PI*57.5*t)+0.15*sin(2*PI*110.3*t):s=44100:d={T}",
    "-f", "lavfi", "-i", f"anoisesrc=c=pink:a=0.25:d={T}:r=44100", "-filter_complex",
    f"[1]lowpass=f=400[n];[0][n]amix=inputs=2:normalize=0,volume=0.17,afade=t=in:d=2,afade=t=out:st={T-5}:d=5",
    "-ac", "1", "drone.wav"], check=True)

inp = ["-i", "voice.wav", "-i", "drone.wav", "-i", "music.wav"]
f = ["[0]volume=1.25,acompressor=threshold=-18dB:ratio=3,asplit=2[vo][key0]",
     "[key0]aformat=channel_layouts=mono,volume=3[key]",
     "[2]volume=0.22[mu0]", "[mu0][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[mu]"]
for i, (fn, t, v) in enumerate(ev):
    inp += ["-i", fn]
    ms = int(t * 1000)
    f.append(f"[{i+3}]aformat=channel_layouts=mono,volume={v:.2f},adelay={ms}|{ms}[e{i}]")
f.append("[vo][1][mu]" + "".join(f"[e{i}]" for i in range(len(ev))) +
         f"amix=inputs={len(ev)+3}:normalize=0,atrim=0:{T},alimiter=limit=0.95[m]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inp, "-filter_complex", ";".join(f), "-map", "[m]",
                "-ar", "44100", "-ac", "2", "mix.wav"], check=True)
print("mixed", len(ev), "events")
