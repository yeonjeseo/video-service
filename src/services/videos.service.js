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
      streams: [videoStream, audioStream, ...additionalStreams],
      format
    } = videoMeta;

    const {
      codec_name, // 코덱 이름
      profile,
      width,    // 비디오 프레임 폭
      height,   // 비디오 프레임 높이
      bit_rate, // 비트레이트
      nb_frames, // 전체 프레임 수
      r_frame_rate, avg_frame_rate // 프레임 레이트 정보
    } = videoStream;

    const {
      filename,   //비디오 파일 경로
      nb_streams, // 비디오 파일에 있는 총 스트림 수 = streams.length
      duration,
      size, // 비디오 파일 크기

    } = format;

    /**
     * 비디오 해상도는 프레임 크기로 결정된다. -> w * h = 2048 * 854
     * h264 비디오 스트림의 크기 결정
     * 비트레이트 : 비디오 스트림이 초당 전송되는 비트 수, 20149278
     * 프레임 레이트 : 초당 프레임 수, r_frame_rate = 24000/1001; avg_frame_rate: 21150000/881881
     * 비디오 스트림 파일 사이즈 = 비트레이트 * 비디오 길이 / 8 => 20149278 * 146.98 / 8 (bytes) = 355.2 MB
     */

    // const videoMeta = await ffmpeg.getVideoMetaFromBuffer(videoStream);
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