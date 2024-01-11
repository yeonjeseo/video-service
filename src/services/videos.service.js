import { ffmpeg } from '../utils/index.js';
import config from '../config/config.js';
import {videoSegmentsRepository, videosRepository,} from '../repositories/index.js';
import { v4 as uuidV4 } from 'uuid'
import db from '../models/index.js';
// import fs from 'fs';
// import { createUploadDirectory } from '../utils/index.js'
// import stream from 'stream';

const UNIT_SEGMENT_DURATION = config.UNIT_SEGMENT_DURATION || 10;

export const splitAndSaveVideoInfos = async ({file, fileUuid}) => {
  const t = await db.sequelize.transaction();
  try {
    // const videoBuffer = file.buffer;
    const videoPath = file.path;
    const videoMeta = await ffmpeg.getVideoMetaFromFile(videoPath);

    const {
      streams: [videoStream],
      format
    } = videoMeta;

    console.log(videoStream, format);

    // const videoMeta = await ffmpeg.getVideoMetaFromBuffer(videoStream);
    const  { duration } = format;
    const totalSegmentOffset = Math.floor(duration / UNIT_SEGMENT_DURATION);

    const createdVideo = await videosRepository.insertVideo({
      original_name: file.originalname,
      file_uuid: fileUuid,
      net_segment_count: totalSegmentOffset + 1,
      duration,
    }, t)
    const videoId = createdVideo.id;
    // createUploadDirectory(videoId);
    // const extension = file.originalname.split('.').pop();

    let offset = 0;

    const insertSegmentPromises = [];
    // await ffmpeg.splitVideoIntoSegment({identifier, videoStream: tempStream});

    while(offset <= totalSegmentOffset) {
      const uuid = uuidV4();
      // const tempStream = new stream.PassThrough();
      // tempStream.end(videoBuffer);
      // await ffmpeg.splitVideoIntoSegment({videoId,uuid, videoStream: tempStream, offset, extension});
      await ffmpeg.splitVideoFromFile({videoPath, videoUuid: fileUuid, segmentUuid: uuid, offset});
      insertSegmentPromises.push(videoSegmentsRepository.insertVideoSegment({videoId, segmentIndex: offset, uid: uuid}, t));
      offset++;
    }
    await Promise.all(insertSegmentPromises);

    await t.commit();
    return {videoId};
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

export const determineSegments = async ({ videoId, start, end}) => {
  // DB 조회
  const foundVideo = (await videosRepository.findVideoById(videoId))[0];
  if(!foundVideo) throw new Error("비디오를 찾을 수 없습니다.");

  const startSegment = determineSegmentBySecond(start);
  const endSegment = determineSegmentBySecond(end);

  return { startSegment, endSegment, originalName: foundVideo.originalName, fileUuid: foundVideo.fileUuid};
}

export const mergeVideo = ({ fileUuid, originalName, segmentUidList }) => ffmpeg.mergeSegments({ fileUuid, originalName, segmentUidList });

export const trimVideo = async ({tempPath, tempFileName, start, end}) => {
  const trimStart = start % UNIT_SEGMENT_DURATION;
  const duration = end - start;

  const trimmedVideoPath = await ffmpeg.trimTempVideo({tempPath, tempFileName, trimStart, duration});
  return trimmedVideoPath;
}

export const findSegmentsBySegmentIndex = ({ videoId, startSegment, endSegment}) => videoSegmentsRepository.findSegmentsBySegmentIndexIn({videoId, startSegment, endSegment});

const determineSegmentBySecond = (second) => Math.floor(second / UNIT_SEGMENT_DURATION);