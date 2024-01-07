import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import {spawn} from 'child_process';

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

export const splitVideo = ({identifier, videoPath, offset = 0, extension}) => new Promise((resolve, reject) => {
  console.log(offset);
  ffmpeg(videoPath)
    .setStartTime(offset * UNIT_SEGMENT_DURATION)
    .setDuration((offset + 1) * UNIT_SEGMENT_DURATION)
    .on('end', (stdout, stderr) => {
      resolve();
    })
    .on('error', (err) => {
      reject(err);
    })
    .save(`./uploads/${identifier}/${identifier}_${offset}.${extension}`)
  }
);

export const mergeSegments = ({ segmentList, temp, dir }) => new Promise((resolve, reject) => {
  const concatCommand = ffmpeg();
  segmentList.forEach(segment => concatCommand.input(`${dir}/${segment}`));
  const tempPath = `${process.cwd()}/temp/${temp}`
  concatCommand
    .on('end', () => {
      console.log('Merging finished');
      resolve(tempPath);
    })
    .on('error', (err) => {
      console.error('Error:', err);
      reject(new Error('Error merging segments'));
    })
    .mergeToFile(tempPath);
});