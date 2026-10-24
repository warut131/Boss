#!/usr/bin/env python3
"""EP3 narration. Styles: n/r/y narrator (Niwat), m = mother's voice from afar (Premwadee, distant),
x = distorted female whisper, k:<sfx>:<sec> = SFX-only gap. Writes voice.wav + timeline.json."""
import json, os, subprocess

P = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(P, "audio")
os.makedirs(A, exist_ok=True)
PROXY = os.environ.get("HTTPS_PROXY", "")
MALE, FEMALE = "th-TH-NiwatNeural", "th-TH-PremwadeeNeural"

SCRIPT = [
    (1, [("คนเฒ่าคนแก่ชอบเตือนว่า ถ้ากลางดึกมีคนเรียกชื่อคุณ", "n")]),
    (2, [("อย่าขานรับ", "r")]),
    (3, [("คืนนั้น ที่บ้านมีแค่คุณกับแม่", "n")]),
    (4, [("ห้าทุ่มตรง เสียงแม่ดังมาจากในครัว", "n"), ("ลูก… มานี่หน่อยสิ", "m")]),
    (5, [("คุณกำลังจะลุกออกไป", "n"), ("แต่โทรศัพท์ก็สั่น", "y")]),
    (6, [("ข้อความจากแม่… ยังอยู่ร้านป้าแดงนะลูก เดี๋ยวกลับ", "y")]),
    (7, [("แล้ว… ใครอยู่ในครัว", "r")]),
    (8, [("ลูก… ได้ยินแม่ไหม", "m")]),
    (9, [("เสียงฝีเท้า ค่อยๆ เดินมาหยุดหน้าห้องคุณ", "y")]),
    (10, [("คุณเอามือปิดปาก กลั้นหายใจ", "n")]),
    (11, [("ลูกบิดประตู", "n"), ("ค่อยๆ หมุน", "r")]),
    (12, [("โทรศัพท์สั่นอีกครั้ง", "n"), ("แม่ยังไม่ถึงบ้าน ห้ามขานรับใครเด็ดขาด", "y")]),
    (13, [("ลูกบิดหยุดหมุน", "n"), ("ทุกอย่างเงียบสนิท", "n")]),
    (14, [("แล้วจู่ๆ", "n"), ("โทรศัพท์ของคุณ ก็ดังลั่นห้อง", "r"), ("📞 แม่ กำลังโทรเข้า…", "k:ring:2.4")]),
    (15, [("เจอแล้ว", "x")]),
]
LEAD, CHUNK_GAP, SCENE_GAP = 0.8, 0.55, 0.8
SCENE_PAD = {2: 0.6, 4: 0.4, 7: 0.8, 8: 0.6, 9: 1.4, 10: 0.8, 11: 1.6, 12: 0.4, 13: 1.6, 15: 1.8}
OUTRO = 5.0


def dur(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def tts(text, out, voice=MALE, rate="-10%", pitch="-5Hz", fx=None):
    mp3 = out.replace(".wav", ".mp3")
    if not os.path.exists(mp3):
        subprocess.run(["edge-tts", "--proxy", PROXY, "--voice", voice, f"--rate={rate}", f"--pitch={pitch}",
                        "--text", text, "--write-media", mp3], check=True, capture_output=True)
    af = ("silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
          "silenceremove=start_periods=1:start_threshold=-45dB,areverse")
    if fx:
        af += "," + fx
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-af", af, "-ar", "44100", "-ac", "1", out], check=True)


timeline, files, scenes, t, n = [], [], [], LEAD, 0
for sc, chunks in SCRIPT:
    s0 = t
    for i, (text, style) in enumerate(chunks):
        if style.startswith("k:"):
            _, sfx, d = style.split(":")
            d = float(d)
            timeline.append({"scene": sc, "text": text, "style": "k", "sfx": sfx, "start": round(t, 3), "end": round(t + d, 3)})
        else:
            out = os.path.join(A, f"c{n:02d}.wav")
            if style == "m":   # mum calling from the kitchen: distant, roomy
                tts(text, out, FEMALE, rate="-20%", pitch="-8Hz",
                    fx="lowpass=f=2600,highpass=f=250,aecho=0.8:0.6:90|170:0.4|0.25,volume=0.9")
            elif style == "x":  # the thing behind the door
                tts(text, out, FEMALE, rate="-40%", pitch="-35Hz",
                    fx="highpass=f=200,aecho=0.8:0.75:50|120|200:0.5|0.35|0.25,volume=1.6")
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

json.dump({"total": round(total, 3), "chunks": timeline, "scenes": scenes},
          open(os.path.join(P, "timeline.json"), "w"), ensure_ascii=False, indent=1)
print(f"total {total:.2f}s")
for c in timeline:
    print(c["scene"], c["style"], c["start"], c["end"], c["text"])
for s in scenes:
    print(s)
