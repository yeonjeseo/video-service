import { ffmpeg } from '../utils/index.js';
import config from '../config/config.js';
import {videosRepository} from '../repositories/index.js';
import fs from 'fs';

const UNIT_SEGMENT_DURATION = config.UNIT_SEGMENT_DURATION || 10;

export const splitAndSaveVideoInfos = async (videoInfo) => {
  const videoPath = videoInfo.path;
  const extension = videoInfo.originalname.split('.').pop();
  const identifier = videoInfo.filename;

  const videoMeta = await ffmpeg.getVideoMeta(videoPath);
  const {format : { duration }} = videoMeta;
  const totalSegmentOffset = Math.floor(duration / UNIT_SEGMENT_DURATION);
  let offset = 0;

  // const splitPromises = [];
  while(offset <= totalSegmentOffset) {
    await ffmpeg.splitVideo({identifier, videoPath, offset, extension});
    // splitPromises.push(ffmpeg.splitVideo({identifier, videoPath, offset, extension}));
    offset++;
  }
  // const result = await Promise.all(splitPromises);
  await videosRepository.insertVideo({
    identifier,
    original_name: videoInfo.originalname,
    net_segment_count: totalSegmentOffset + 1
  });

  return {videoIdentifier: identifier};
}


export const determineSegments = async ({ videoIdentifier, start, end}) => {
  // DB 조회
  const foundVideo = (await videosRepository.findVideoByUuid(videoIdentifier))[0];
  if(!foundVideo) throw new Error("비디오를 찾을 수 없습니다.");

  const {
    originalName, netSegmentCount
  } = foundVideo;

  const temp = `temp_${originalName}`;

  let startSegment = determineSegmentBySecond(start);
  const endSegment = determineSegmentBySecond(end);

  const searchList = [];
  while(startSegment <= endSegment) {
    searchList.push(`${videoIdentifier}_${startSegment}`);
    startSegment++;
  }

  const fileDir = `${process.cwd()}/uploads/${videoIdentifier}`
  const files = fs.readdirSync(fileDir);
  const segmentList = files.filter(file => searchList.some(fileName => file.includes(fileName)));

  return { segmentList, temp, dir: fileDir };
}

export const mergeVideo = ({ segmentList, temp, dir }) => ffmpeg.mergeSegments({ segmentList, temp, dir });

export const trimVideo = async ({tempPath, tempFileName, start, end}) => {
  const trimStart = start % UNIT_SEGMENT_DURATION;
  const duration = end - start;

  const trimmedVideoPath = await ffmpeg.trimTempVideo({tempPath, tempFileName, trimStart, duration});
  return trimmedVideoPath;
}

const determineSegmentBySecond = (second) => Math.floor(second / UNIT_SEGMENT_DURATION);