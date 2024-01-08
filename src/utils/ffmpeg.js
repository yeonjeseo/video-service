import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

import config from '../config/config.js'
import ffmpeg from 'fluent-ffmpeg';

const ffmpegPath = ffmpegInstaller.path;
const ffprobePath = ffprobeInstaller.path;

const UNIT_SEGMENT_DURATION = config.UNIT_SEGMENT_DURATION || 10;

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
  ffmpeg(videoPath)
    .videoCodec('libx264')
    .setStartTime(offset * UNIT_SEGMENT_DURATION)
    .setDuration(UNIT_SEGMENT_DURATION)
    .on('end', (stdout, stderr) => {
      resolve();
    })
    .on('error', (err) => {
      reject(err);
    })
    .outputOptions(['-preset fast'])
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
      resolve({tempPath, tempFileName: temp});
    })
    .on('error', (err) => {
      console.error('Error:', err);
      reject(new Error('Error merging segments'));
    })
    .mergeToFile(tempPath);
});

export const trimTempVideo = ({tempPath, tempFileName, trimStart, duration}) => new Promise((resolve, reject) => {
    const trimmedTempPath = `${process.cwd()}/temp/${Date.now()}_${tempFileName}`;
    ffmpeg(tempPath)
      .setStartTime(trimStart)
      .setDuration(duration)
      .on('end', (stdout, stderr) => {
        resolve(trimmedTempPath);
      })
      .on('error', (err) => {
        reject(err);
      })
      .outputOptions(['-preset fast'])
      .save(trimmedTempPath)
  }
);