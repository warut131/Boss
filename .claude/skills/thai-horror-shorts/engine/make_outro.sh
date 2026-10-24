#!/bin/bash
# Regenerate the spoken end-card line (after changing the channel name).  usage: make_outro.sh "อย่าลืมกดติดตาม <ชื่อช่อง> แล้วเจอกันตอนหน้านะ"
set -e
D=$(cd "$(dirname "$0")" && pwd)
for i in 1 2 3 4; do
  edge-tts --proxy "$HTTPS_PROXY" --voice th-TH-NiwatNeural --rate=-10% --pitch=-5Hz --text "$1" --write-media "$D/outro.mp3" && [ -s "$D/outro.mp3" ] && break
  sleep 2
done
ffmpeg -v error -y -i "$D/outro.mp3" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,volume=1.25" -ar 44100 -ac 2 "$D/outro.wav"
rm -f "$D/outro.mp3"
