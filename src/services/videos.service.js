import { ffmpeg } from '../utils/index.js';
import config from '../config/config.js';
import {videosRepository} from '../repositories/index.js';

const {UNIT_SEGMENT_DURATION} = config;

export const splitAndSaveVideoInfos = async (videoInfo) => {
  console.log(videoInfo);
  const videoPath = videoInfo.path;
  const extension = videoInfo.originalname.split('.').pop();
  const identifier = videoInfo.filename;
  const { format: { duration }} = await ffmpeg.getVideoMeta(videoPath);

  const totalSegmentOffset = Math.ceil(duration / UNIT_SEGMENT_DURATION) - 1;

  let offset = 0;

  const splitPromises = [];
  while(offset <= totalSegmentOffset) {
    splitPromises.push(ffmpeg.splitVideo({identifier, videoPath, offset, extension}));
    offset++;
  }
  await Promise.all(splitPromises);

  await videosRepository.insertVideo({
    identifier,
    original_name: videoInfo.originalname,
    net_segment_count: totalSegmentOffset + 1
  });

  return;
}

