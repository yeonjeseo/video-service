import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

import config from '../config/config.js'
import ffmpeg from 'fluent-ffmpeg';

const ffmpegPath = ffmpegInstaller.path;
const ffprobePath = ffprobeInstaller.path;

const UNIT_SEGMENT_DURATION = config.UNIT_SEGMENT_DURATION || 10;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export const getVideoMetaFromFile = (videoPath) =>  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });

export const getVideoMetaFromBuffer = (videoBuffer) => new Promise((resolve, reject) => {
  ffmpeg()
    .input(videoBuffer)
    .inputFormat('mp4')
    .videoCodec('libx264')
    .on('end', () =>{
      console.log("Processing Finished!")
    })
    .on('error', (err) => {
      reject(err)
    })
    .on('progress', (progress) => {
      console.log('Processing: ' + progress.percent + '% done');
    })
    .ffprobe((err, data) => {
      if(err) {
        reject(err);
        return;
      }
      resolve({duration: data.format.duration});
    })
})

export const splitVideoFromStream = ({videoId, uuid, videoStream, offset = 0, extension}) => new Promise((resolve, reject) => {
  ffmpeg()
    .input(videoStream)
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
    .save(`./uploads/${videoId}/${uuid}.${extension}`)
  }
);

/**
 * @deprecated
 * @param identifier
 * @param videoStream
 * @returns {Promise<unknown>}
 */
export const splitVideoIntoSegment = ({identifier, videoStream}) => new Promise((resolve, reject) => {
  ffmpeg()
    .input(videoStream)
    .videoCodec('libx264')
    .outputOptions([
      '-map 0',
      '-segment_time 10',
      '-f segment',
      '-reset_timestamps 1',
    ])
    .on('end', () => {
      console.log('Processing finished');
      resolve();
    })
    .on('error', (err) => {
      console.error('Error:', err);
      reject();
    })
    .save(`${process.cwd()}/uploads/${identifier}/output-%03d.mp4`)
});

export const mergeSegments = ({ videoId, originalName, segmentUidList }) => new Promise((resolve, reject) => {
  const concatCommand = ffmpeg();
  segmentUidList.forEach(segmentUid => concatCommand.input(`./uploads/${videoId}/${segmentUid}.mp4`));
  const tempFileName = `${Date.now()}_${originalName}`;
  const tempPath = `${process.cwd()}/temp/${tempFileName}`
  concatCommand
    .on('end', () => {
      console.log('Merging finished');
      resolve({tempPath, tempFileName});
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
