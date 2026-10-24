#!/usr/bin/env python3
"""Generate narration chunks with edge-tts, concatenate with pauses, write timeline.json."""
import json, os, subprocess

P = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(P, "audio")
os.makedirs(A, exist_ok=True)
PROXY = os.environ.get("HTTPS_PROXY", "")
VOICE = "th-TH-NiwatNeural"

# (scene, [(text, style)]); style: n=normal, r=red box, y=yellow
SCRIPT = [
    (1, [("ถ้าวันหนึ่ง เงาของคุณ", "n"), ("ขยับช้ากว่าคุณครึ่งจังหวะ", "n")]),
    (2, [("อย่าหันไปมอง", "r")]),
    (3, [("คืนแรก คุณคิดว่าแค่ตาฝาด", "n")]),
    (4, [("คืนที่สอง", "n"), ("เงาหยุดเดิน ก่อนคุณ", "y")]),
    (5, [("คืนที่สาม คุณยกมือขึ้นเกาหัว", "n")]),
    (6, [("แต่เงาบนผนัง ยังยืนนิ่ง", "y")]),
    (7, [("แล้วมันก็ค่อยๆ", "n"), ("หันหน้ามาทางคุณ", "r")]),
    (8, [("คุณวิ่งไปเปิดไฟทุกดวงในบ้าน", "n")]),
    (9, [("ไม่มีเงา ไม่มีอะไรเลย", "n"), ("คุณถอนหายใจ", "n")]),
    (10, [("จนหลอดไฟ", "n"), ("กะพริบ", "y")]),
    (11, [("ในความมืด มีเสียงกระซิบข้างหู", "n")]),
    (12, [("ตาฉันบ้างนะ", "w")]),
    (13, [("เช้าวันรุ่งขึ้น", "n"), ("คุณตื่นมา อยู่บนผนัง", "y")]),
    (14, [("มองดูร่างของตัวเอง เดินออกจากห้องไป", "n"), ("พร้อมรอยยิ้ม", "r")]),
]
LEAD, CHUNK_GAP, SCENE_GAP, SCENE_PAD = 0.8, 0.55, 0.85, {2: 0.6, 6: 0.5, 7: 0.9, 10: 0.8, 12: 1.2, 14: 1.0}
OUTRO = 4.5


def dur(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                       capture_output=True, text=True)
    return float(r.stdout.strip())


def tts(text, out, rate="-10%", pitch="-5Hz"):
    mp3 = out.replace(".wav", ".mp3")
    if not os.path.exists(mp3):
        subprocess.run(["edge-tts", "--proxy", PROXY, "--voice", VOICE, f"--rate={rate}", f"--pitch={pitch}",
                        "--text", text, "--write-media", mp3], check=True, capture_output=True)
    # trim leading/trailing silence, normalise to 44.1k mono wav
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-ar", "44100", "-ac", "1", out], check=True)


timeline, files, t, n = [], [], LEAD, 0
scenes = []
for sc, chunks in SCRIPT:
    s0 = t
    for i, (text, style) in enumerate(chunks):
        out = os.path.join(A, f"c{n:02d}.wav")
        if style == "w":  # whisper-ish: slower, lower, airy echo
            raw = out.replace(".wav", "_raw.wav")
            tts(text, raw, rate="-35%", pitch="-20Hz")
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af",
                            "highpass=f=300,aecho=0.8:0.7:60|140:0.45|0.3,volume=1.4",
                            out], check=True)
        else:
            tts(text, out)
        d = dur(out)
        timeline.append({"scene": sc, "text": text, "style": style, "start": round(t, 3), "end": round(t + d, 3)})
        files.append((t, out))
        t += d + (CHUNK_GAP if i < len(chunks) - 1 else 0)
        n += 1
    t += SCENE_GAP + SCENE_PAD.get(sc, 0)
    scenes.append({"scene": sc, "start": round(s0 - (0.25 if sc > 1 else s0), 3)})
total = t + OUTRO
for i, s in enumerate(scenes):
    s["end"] = scenes[i + 1]["start"] if i + 1 < len(scenes) else round(t - 0.2, 3)
scenes.append({"scene": 99, "start": round(t - 0.2, 3), "end": round(total, 3)})

# mix voice track with adelay
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
for s in scenes:
    print(s)
