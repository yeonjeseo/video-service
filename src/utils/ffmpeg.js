import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

import config from '../config/config.js'
import ffmpeg from 'fluent-ffmpeg';

const ffmpegPath = ffmpegInstaller.path;
const ffprobePath = ffprobeInstaller.path;
const {UNIT_SEGMENT_DURATION} = config;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export const getVideoMeta = (videoPath) =>  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });

export const splitVideo = ({identifier, videoPath, offset = 0}) => new Promise((resolve, reject) => ffmpeg(videoPath)
  .setStartTime(offset * UNIT_SEGMENT_DURATION)
  .setDuration((offset + 1) * UNIT_SEGMENT_DURATION)
  .on('end', (stdout, stderr) => {
    resolve();
  })
  .on('error', (err) => {
    reject(err);
  })
  .save(`./uploads/${identifier}_${offset}.mov`));

