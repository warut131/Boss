#!/usr/bin/env python3
"""Mix one episode: voice + drone + music box (ducked under voice) + EVENTS from script.py -> mix.wav
EVENTS(sc, ch) returns [(sfx_name, time, volume)]; sc = {scene: {start,end}}, ch = list of chunks."""
import json, os, subprocess, sys, importlib.util

EP = os.path.abspath(sys.argv[1])
SERIES = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("script", os.path.join(EP, "script.py"))
S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
d = json.load(open(os.path.join(EP, "timeline.json")))
T = d["total"]
sc = {s["scene"]: s for s in d["scenes"]}
ev = S.EVENTS(sc, d["chunks"])


def heartbeats(a, b, per):
    out, x = [], a + 0.2
    while x < b - 0.3:
        out += [("beat", x, 0.9), ("beat", x + 0.24, 0.6)]
        x += per
    return out


for a, b, per in getattr(S, "HEART", lambda sc: [])(sc):
    ev += heartbeats(a, b, per)

drone = os.path.join(EP, "drone.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i",
    f"aevalsrc=0.5*sin(2*PI*55*t)+0.4*sin(2*PI*57.5*t)+0.15*sin(2*PI*110.3*t):s=44100:d={T}",
    "-f", "lavfi", "-i", f"anoisesrc=c=pink:a=0.25:d={T}:r=44100", "-filter_complex",
    f"[1]lowpass=f=400[n];[0][n]amix=inputs=2:normalize=0,volume=0.17,afade=t=in:d=2,afade=t=out:st={T-5}:d=5",
    "-ac", "1", drone], check=True)

inp = ["-i", os.path.join(EP, "voice.wav"), "-i", drone, "-i", os.path.join(EP, "music.wav")]
f = ["[0]volume=1.25,acompressor=threshold=-18dB:ratio=3,asplit=2[vo][key0]",
     "[key0]aformat=channel_layouts=mono,volume=3[key]",
     "[2]volume=0.22[mu0]", "[mu0][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[mu]"]
for i, (name, t, v) in enumerate(ev):
    inp += ["-i", os.path.join(SERIES, "sfx", name + ".wav")]
    ms = max(0, int(t * 1000))
    f.append(f"[{i+3}]aformat=channel_layouts=mono,volume={v:.2f},adelay={ms}|{ms}[e{i}]")
f.append("[vo][1][mu]" + "".join(f"[e{i}]" for i in range(len(ev))) +
         f"amix=inputs={len(ev)+3}:normalize=0,atrim=0:{T},alimiter=limit=0.95[m]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inp, "-filter_complex", ";".join(f), "-map", "[m]",
                "-ar", "44100", "-ac", "2", os.path.join(EP, "mix.wav")], check=True)
print("mixed", len(ev), "events")
