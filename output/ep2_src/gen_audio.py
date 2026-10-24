#!/usr/bin/env python3
"""EP2 narration: edge-tts chunks + silent SFX-only chunks ('k'), concatenated; writes timeline.json."""
import json, os, subprocess

P = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(P, "audio")
os.makedirs(A, exist_ok=True)
PROXY = os.environ.get("HTTPS_PROXY", "")
VOICE = "th-TH-NiwatNeural"

# style: n normal, r red box, y yellow, w whisper (red, shaky), k = knock SFX only (no voice), value = seconds
SCRIPT = [
    (1, [("ถ้าคืนไหน คุณได้ยินเสียงเคาะ", "n"), ("จากใต้เตียง", "y")]),
    (2, [("อย่าเคาะตอบ", "r")]),
    (3, [("ก๊อก… ก๊อก… ก๊อก…", "k"), ("สามครั้ง ทุกคืน ตอนตีสาม", "y")]),
    (4, [("คืนแรก คุณคิดว่าเป็นเสียงท่อน้ำ", "n")]),
    (5, [("คืนที่สอง", "n"), ("เสียงเคาะ ดังตามจังหวะหัวใจคุณ", "y")]),
    (6, [("คืนที่สาม คุณทนไม่ไหว", "n"), ("เคาะตอบไปสามครั้ง", "r"), ("ก๊อก… ก๊อก… ก๊อก…", "k")]),
    (7, [("แล้วทุกอย่างก็เงียบ", "n")]),
    (8, [("มือซีดๆ ข้างหนึ่ง", "n"), ("ค่อยๆ เลื้อยขึ้นมาจับขอบเตียง", "r")]),
    (9, [("คุณหลับตาแน่น นับหนึ่งถึงสิบ", "n")]),
    (10, [("พอลืมตา", "n"), ("มือนั้นหายไปแล้ว", "y")]),
    (11, [("เช้าวันต่อมา คุณก้มลงมองใต้เตียง", "n")]),
    (12, [("มีแต่ฝุ่น", "n"), ("กับรอยมือเล็กๆ เต็มพื้น", "y")]),
    (13, [("และกระดาษแผ่นหนึ่ง เขียนว่า", "n")]),
    (14, [("ขอบคุณที่เปิดประตูให้", "w")]),
    (15, [("คืนนั้น เสียงเคาะย้ายไปอยู่", "n"), ("ในตู้เสื้อผ้า", "r")]),
]
K_DUR = 2.0
LEAD, CHUNK_GAP, SCENE_GAP = 0.8, 0.55, 0.85
SCENE_PAD = {2: 0.6, 7: 1.2, 8: 1.0, 10: 0.6, 12: 0.5, 14: 1.4, 15: 1.4}
OUTRO = 5.0


def dur(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def tts(text, out, rate="-10%", pitch="-5Hz"):
    mp3 = out.replace(".wav", ".mp3")
    if not os.path.exists(mp3):
        subprocess.run(["edge-tts", "--proxy", PROXY, "--voice", VOICE, f"--rate={rate}", f"--pitch={pitch}",
                        "--text", text, "--write-media", mp3], check=True, capture_output=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-ar", "44100", "-ac", "1", out], check=True)


timeline, files, knocks, scenes, t, n = [], [], [], [], LEAD, 0
for sc, chunks in SCRIPT:
    s0 = t
    for i, (text, style) in enumerate(chunks):
        if style == "k":
            d = K_DUR
            knocks += [round(t + k, 3) for k in (0.1, 0.75, 1.4)]
        else:
            out = os.path.join(A, f"c{n:02d}.wav")
            if style == "w":
                raw = out.replace(".wav", "_raw.wav")
                tts(text, raw, rate="-35%", pitch="-20Hz")
                subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af",
                                "highpass=f=300,aecho=0.8:0.7:60|140:0.45|0.3,volume=1.4", out], check=True)
            else:
                tts(text, out)
            d = dur(out)
            files.append((t, out))
        timeline.append({"scene": sc, "text": text, "style": style, "start": round(t, 3), "end": round(t + d, 3)})
        t += d + (CHUNK_GAP if i < len(chunks) - 1 else 0)
        n += 1
    t += SCENE_GAP + SCENE_PAD.get(sc, 0)
    scenes.append({"scene": sc, "start": round(s0 - 0.25 if sc > 1 else 0, 3)})
total = t + OUTRO
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else round(t - 0.2, 3)
scenes.append({"scene": 99, "start": round(t - 0.2, 3), "end": round(total, 3)})

inputs, filt = [], []
for i, (st, f) in enumerate(files):
    inputs += ["-i", f]
    ms = int(st * 1000)
    filt.append(f"[{i}]adelay={ms}|{ms}[a{i}]")
filt.append("".join(f"[a{i}]" for i in range(len(files))) + f"amix=inputs={len(files)}:normalize=0,apad=whole_dur={total}[v]")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[v]",
                "-ar", "44100", "-ac", "1", os.path.join(P, "voice.wav")], check=True)

json.dump({"total": round(total, 3), "chunks": timeline, "scenes": scenes, "knocks": knocks},
          open(os.path.join(P, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print(f"total {total:.2f}s knocks {knocks}")
for s in scenes:
    print(s)
