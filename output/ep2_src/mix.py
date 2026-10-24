#!/usr/bin/env python3
"""Mix EP2: voice + drone + music box (ducked) + knocks/heartbeat/hits -> mix.wav"""
import json, os, subprocess

P = os.path.dirname(os.path.abspath(__file__))
os.chdir(P)
d = json.load(open("timeline.json"))
T = d["total"]
beats = [x for b in [15.0, 15.8, 16.6, 17.4, 18.2] for x in (b, b + 0.25)]
ev = [("sfx/knock.wav", k, 0.55 if k < 4 or 12 < k < 14 else 1.0) for k in d["allKnocks"] if k not in beats]
ev += [("sfx/beat.wav", k, 1.0) for k in beats]
ev += [("sfx/knock.wav", k, 0.5) for k in beats]
ev += [("sfx0/hit.wav", 30.76, 1.0), ("sfx0/hit.wav", 39.9, 0.35), ("sfx0/whoosh.wav", 49.3, 0.6),
       ("sfx0/hit.wav", 49.6, 0.7), ("sfx0/hit.wav", 57.1, 1.0), ("sfx0/hit.wav", 33.9, 0.4)]

subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i",
    f"aevalsrc=0.5*sin(2*PI*55*t)+0.4*sin(2*PI*57.5*t)+0.15*sin(2*PI*110.3*t):s=44100:d={T}",
    "-f", "lavfi", "-i", f"anoisesrc=c=pink:a=0.25:d={T}:r=44100", "-filter_complex",
    f"[1]lowpass=f=400[n];[0][n]amix=inputs=2:normalize=0,volume=0.16,afade=t=in:d=2,afade=t=out:st={T-5}:d=5",
    "-ac", "1", "drone.wav"], check=True)

inp = ["-i", "voice.wav", "-i", "drone.wav", "-i", "music.wav"]
f = ["[0]volume=1.25,acompressor=threshold=-18dB:ratio=3,asplit=2[vo][key0]",
     "[key0]aformat=channel_layouts=mono,volume=3[key]",
     "[2]volume=0.22[mu0]", "[mu0][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[mu]"]
for i, (fn, t, v) in enumerate(ev):
    inp += ["-i", fn]
    ms = int(t * 1000)
    f.append(f"[{i+3}]aformat=channel_layouts=mono,volume={v},adelay={ms}|{ms}[e{i}]")
f.append("[vo][1][mu]" + "".join(f"[e{i}]" for i in range(len(ev))) +
         f"amix=inputs={len(ev)+3}:normalize=0,atrim=0:{T},alimiter=limit=0.95[m]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inp, "-filter_complex", ";".join(f), "-map", "[m]",
                "-ar", "44100", "-ac", "2", "mix.wav"], check=True)
print("mixed", len(ev), "events")
