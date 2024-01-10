import { httpStatus } from '../utils/index.js'
import {videosServices} from '../services/index.js'
import fs from 'fs';
export const saveVideo = async (req, res, next) => {
  try {
    const {file, fileUuid} = req;
    const result = await videosServices.splitAndSaveVideoInfos({file, fileUuid});
    return res.status(httpStatus.OK).json(result);
  }catch (e) {
    next(e);
  }
}

export const getVideo = async (req, res, next) => {
  try {
    const {
      params: {
        videoId
      },
      query: {
        start = 0,
        end = 10
      }
    } = req;

    if(!Number(start) || !Number(end) || Number(start) >= Number(end)) {
      throw new Error("입력 값이 유효하지 않습니다.");
    }

    // 세그먼트 범위 결정
    const {
      startSegment, endSegment, originalName, fileUuid
    } = await videosServices.determineSegments({ videoId, start, end});

    const foundSegmentList = await videosServices.findSegmentsBySegmentIndex({videoId, startSegment, endSegment});

    const segmentUidList = foundSegmentList.map(segment => segment.segmentUuid);
    // 비디오 합치기


    const { tempPath, tempFileName} = await videosServices.mergeVideo({ fileUuid, originalName, segmentUidList });
    // 비디오 다시 트림하기
    const trimmedTempPath = await videosServices.trimVideo({ tempPath, tempFileName, start, end});
    // 응답하기
    console.log(trimmedTempPath);
    const fileStream = fs.createReadStream(trimmedTempPath);
    res.attachment(trimmedTempPath);
    fileStream.pipe(res);
  }catch (e) {
    next(e);
  }
}