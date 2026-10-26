#!/usr/bin/env python3
"""Narration + timeline for one episode. usage: gen_ep.py EPDIR   (EPDIR/script.py defines SCRIPT, SCENE_PAD, SIL)
Styles: n/r/y narrator, f = female voice close by, m = distant female voice, x = distorted female whisper, k:<sfx>:<sec> = SFX-only gap.
Adds the spoken 'follow' outro on the end card."""
import json, os, subprocess, sys, time, importlib.util

EP = os.path.abspath(sys.argv[1])
spec = importlib.util.spec_from_file_location("script", os.path.join(EP, "script.py"))
S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
A = os.path.join(EP, "audio"); os.makedirs(A, exist_ok=True)
SERIES = os.path.dirname(os.path.abspath(__file__))
PROXY = os.environ.get("HTTPS_PROXY", "")
MALE, FEMALE = "th-TH-NiwatNeural", "th-TH-PremwadeeNeural"
LEAD, CHUNK_GAP, SCENE_GAP = 0.8, 0.55, 0.8
OUTRO_AT = 2.6  # outro voice starts this long after the end card appears


def dur(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def tts(text, out, voice=MALE, rate="-10%", pitch="-5Hz", fx=None):
    mp3 = out.replace(".wav", ".mp3")
    ok = lambda: os.path.exists(mp3) and subprocess.run(
        ["ffprobe", "-v", "error", mp3], capture_output=True).returncode == 0 and os.path.getsize(mp3) > 2000
    for i in range(15):  # edge-tts sometimes returns nothing or a truncated file
        if ok():
            break
        if i:
            time.sleep(min(2 * i, 8))
        r = subprocess.run(["edge-tts", "--proxy", PROXY, "--voice", voice, f"--rate={rate}", f"--pitch={pitch}",
                            "--text", text, "--write-media", mp3], capture_output=True)
        if r.returncode != 0 and os.path.exists(mp3):
            os.remove(mp3)
    af = ("silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
          "silenceremove=start_periods=1:start_threshold=-45dB,areverse")
    if fx:
        af += "," + fx
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-af", af, "-ar", "44100", "-ac", "1", out], check=True)


timeline, files, scenes, t, n = [], [], [], LEAD, 0
for sc, chunks in S.SCRIPT:
    s0 = t
    for i, (text, style) in enumerate(chunks):
        if style.startswith("k:"):
            _, sfx, d = style.split(":")
            d = float(d)
            timeline.append({"scene": sc, "text": text, "style": "k", "sfx": sfx, "start": round(t, 3), "end": round(t + d, 3)})
        else:
            out = os.path.join(A, f"c{n:02d}.wav")
            if style == "m":
                tts(text, out, FEMALE, rate="-20%", pitch="-8Hz",
                    fx="lowpass=f=2600,highpass=f=250,aecho=0.8:0.6:90|170:0.4|0.25,volume=0.9")
            elif style == "f":  # female voice, close by
                tts(text, out, FEMALE, rate="-18%", pitch="-12Hz", fx="aecho=0.8:0.5:40:0.25,volume=1.1")
            elif style == "x":
                tts(text, out, FEMALE, rate="-40%", pitch="-35Hz",
                    fx="highpass=f=200,aecho=0.8:0.75:50|120|200:0.5|0.35|0.25,volume=1.6")
            else:
                tts(text, out)
            d = dur(out)
            files.append((t, out))
            timeline.append({"scene": sc, "text": text, "style": style, "start": round(t, 3), "end": round(t + d, 3)})
        t += d + (CHUNK_GAP if i < len(chunks) - 1 else 0)
        n += 1
    t += SCENE_GAP + S.SCENE_PAD.get(sc, 0)
    scenes.append({"scene": sc, "start": round(s0 - 0.25 if sc > 1 else 0, 3)})
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else round(t - 0.2, 3)
s99 = round(t - 0.2, 3)
outro = os.path.join(SERIES, "outro.wav")
vs = round(s99 + OUTRO_AT, 3)
total = round(vs + dur(outro) + 0.9, 3)
scenes.append({"scene": 99, "start": s99, "end": total})
files.append((vs, outro))

inputs, filt = [], []
for i, (st, f) in enumerate(files):
    inputs += ["-i", f]
    ms = int(st * 1000)
    filt.append(f"[{i}]aformat=channel_layouts=mono,adelay={ms}|{ms}[a{i}]")
filt.append("".join(f"[a{i}]" for i in range(len(files))) + f"amix=inputs={len(files)}:normalize=0,apad=whole_dur={total}[v]")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[v]",
                "-ar", "44100", "-ac", "1", os.path.join(EP, "voice.wav")], check=True)

scm = {s["scene"]: s for s in scenes}
sil = [(round(scm[a]["start"] - 0.4, 3), scm[b]["end"]) for a, b in getattr(S, "SIL_SCENES", [])]
json.dump({"total": total, "outro": vs, "chunks": timeline, "scenes": scenes, "sil": sil},
          open(os.path.join(EP, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print(f"total {total:.2f}s")
for c in timeline:
    print(c["scene"], c["style"], c["start"], c["end"], c["text"])
for s in scenes:
    print(s)
