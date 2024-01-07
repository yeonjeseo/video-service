import { ffmpeg } from '../utils/index.js';
import config from '../config/config.js';
import {videosRepository} from '../repositories/index.js';
import fs from 'fs';
const {UNIT_SEGMENT_DURATION} = config;

export const splitAndSaveVideoInfos = async (videoInfo) => {
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

const determineSegmentBySecond = (second) => Math.ceil(second / UNIT_SEGMENT_DURATION);