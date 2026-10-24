#!/bin/bash
# re-render each episode with the extended end card, add outro voice to its mix, mux
set -e
S=/tmp/claude-0/-home-user-Boss/80e877ef-1f33-5a93-a554-a01656d6ea82/scratchpad
export NODE_PATH=$(npm root -g)
for spec in "shadow mix_music.wav shadow_ep1.mp4" "ep2 mix.wav knock_ep2.mp4" "ep3 mix.wav call_ep3.mp4"; do
  set -- $spec; d=$S/$1
  read VS T < <(python3 -c "import json;t=json.load(open('$d/timeline.json'));print(t['outro'],t['total'])")
  (cd $d && node render.js video 30 > render_outro.log 2>&1)
  MS=$(python3 -c "print(int($VS*1000))")
  ffmpeg -v error -y -i $d/$2 -i $S/outro/outro.wav -filter_complex "[0]apad=whole_dur=$T[a];[1]adelay=$MS|$MS[o];[a][o]amix=inputs=2:normalize=0:duration=first,atrim=0:$T,alimiter=limit=0.95[m]" -map "[m]" -ar 44100 -ac 2 $d/final_mix.wav
  ffmpeg -v error -y -i $d/video_noaudio.mp4 -i $d/final_mix.wav -c:v copy -c:a aac -b:a 192k -shortest $d/$3
  cp $d/$3 /home/user/Boss/output/
  echo "DONE $3 $(ffprobe -v error -show_entries format=duration -of csv=p=0 $d/$3)"
done
