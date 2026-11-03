#!/bin/sh
# Builds the fake-camera videos for camera.mjs from MediaPipe's public sample photo. Needs ffmpeg. The output stays out of git.
set -e
cd "$(dirname "$0")"; mkdir -p fixtures; cd fixtures
curl -sL -o hand.jpg https://storage.googleapis.com/mediapipe-tasks/hand_landmarker/woman_hands.jpg
# a wave of 1.4 s, then the hand rests for 2.6 s
ffmpeg -y -loglevel error -f lavfi -i color=c=0x333333:s=640x480:r=30:d=12 -loop 1 -i hand.jpg -filter_complex "[1:v]scale=-2:432[h];[0:v][h]overlay=x='176+160*sin(5*mod(t,4))*if(lt(mod(t,4),1.4),sin(PI*mod(t,4)/1.4),0)':y='24+70*sin(9*mod(t,4))*if(lt(mod(t,4),1.4),sin(PI*mod(t,4)/1.4),0)':shortest=1,format=yuv420p" -t 12 wave.y4m
# the hand keeps moving, then vanishes for 3 s
ffmpeg -y -loglevel error -f lavfi -i color=c=0x333333:s=640x480:r=30:d=8 -loop 1 -i hand.jpg -filter_complex "[1:v]scale=-2:432[h];[0:v][h]overlay=x='176+160*sin(5*t)':y='24+70*sin(9*t)':enable='lt(mod(t,8),5)':shortest=1,format=yuv420p" -t 8 leave.y4m
# an empty room
ffmpeg -y -loglevel error -f lavfi -i color=c=0x333333:s=640x480:r=30:d=2 -vf format=yuv420p blank.y4m
