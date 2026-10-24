#!/bin/bash
# Build one episode end to end.  usage: build.sh EPDIR OUTNAME [preview t1,t2,...]
set -e
SERIES=$(cd "$(dirname "$0")" && pwd)
EP=$(cd "$1" && pwd); OUT=$2
export NODE_PATH=$(npm root -g)
ln -sfn "$SERIES/fonts" "$EP/fonts"
cp "$SERIES/render.js" "$EP/render.js"
[ -f "$EP/timeline.json" ] && [ "$EP/timeline.json" -nt "$EP/script.py" ] || python3 "$SERIES/gen_ep.py" "$EP"
cat "$SERIES/head.html" "$SERIES/lib.js" "$EP/scenes.js" > "$EP/scene.html"
echo '</script></body></html>' >> "$EP/scene.html"
if [ "$3" = preview ]; then
  (cd "$EP" && node render.js preview "$4")
  exit 0
fi
python3 "$SERIES/gen_music.py" "$EP" >/dev/null
python3 "$SERIES/mix_ep.py" "$EP"
(cd "$EP" && node render.js video 30 > render.log 2>&1)
ffmpeg -v error -y -i "$EP/video_noaudio.mp4" -i "$EP/mix.wav" -c:v copy -c:a aac -b:a 192k -shortest "$EP/$OUT"
echo "DONE $OUT $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$EP/$OUT")"
