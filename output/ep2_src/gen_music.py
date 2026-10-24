#!/usr/bin/env python3
"""Creepy music-box lullaby (A minor), synthesised; drops out in SIL windows for tension."""
import numpy as np, wave, os

import json
SR = 44100
T = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"timeline.json")))["total"]
P = os.path.dirname(os.path.abspath(__file__))
out = np.zeros(int(SR * (T + 3)))

def note(midi, t0, dur=2.2, vel=1.0, detune=0.0):
    f = 440 * 2 ** ((midi - 69 + detune) / 12)
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 2.8) * np.minimum(1, t / 0.004)
    tone = (np.sin(2*np.pi*f*t) + 0.45*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*4)
            + 0.25*np.sin(2*np.pi*f*3.98*t)*np.exp(-t*7))
    i = int(t0 * SR)
    seg = tone * env * vel
    out[i:i+len(seg)] += seg[:len(out)-i]

# melody (midi, beats); beat = 0.5s
A = [(76,1),(72,1),(69,1),(72,1),(76,2),(74,1),(72,1),(71,2),(68,2),(69,4),
     (76,1),(77,1),(76,1),(72,1),(74,2),(71,2),(72,1),(71,1),(68,2),(69,4)]
BASS = [45, 41, 40, 45]  # A F E A, one per 4s bar
beat = 0.5
SIL = [(25.4, 28.6), (49.3, 53.8)]
insil = lambda t, pre=0.5: any(a - pre < t < b for a, b in SIL)
t = 1.0
rng = np.random.default_rng(3)
while t < T - 3:
    for m, b in A:
        if t >= T - 3: break
        if not insil(t):
            # slight random detune + occasional dropped note = "broken music box"
            if rng.random() > 0.06:
                note(m, t, vel=0.55, detune=rng.normal(0, 0.06))
        t += b * beat
for k, bt in enumerate(np.arange(1.0, T - 3, 4.0)):
    if not insil(bt, 2):
        note(BASS[k % 4], bt, dur=4.0, vel=0.45)
        note(BASS[k % 4] + 7, bt + 2, dur=3.0, vel=0.2)

# simple feedback-delay reverb
y = out.copy()
for d, g in [(0.113, 0.35), (0.271, 0.25), (0.419, 0.18), (0.6, 0.12)]:
    n = int(d * SR)
    y[n:] += out[:-n] * g
y = y[:int(SR * T)]
# fades: in, around the silent gap, and out under the end card
tt = np.arange(len(y)) / SR
fade = np.clip(tt / 2, 0, 1) * np.clip((T - tt) / 4, 0, 1)
y *= fade
y = y / np.max(np.abs(y)) * 0.9
with wave.open(os.path.join(P, 'music.wav'), 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype('<i2').tobytes())
print('ok', len(y) / SR)
