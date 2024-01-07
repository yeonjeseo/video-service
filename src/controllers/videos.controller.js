import { httpStatus } from '../utils/index.js'
import {videosServices} from '../services/index.js'
import fs from 'fs';
import {mergeVideo} from "../services/videos.service.js";
export const saveVideo = async (req, res, next) => {
  try {
    const {file} = req;
    await videosServices.splitAndSaveVideoInfos(file);
    return res.status(httpStatus.OK).json("ok");
  }catch (e) {
    next(e);
  }
}

export const getVideo = async (req, res, next) => {
  try {
    const {
      params: {
        videoIdentifier
      },
      query: {
        start = 0,
        end = 10
      }
    } = req;

    // 세그먼트 범위 결정 후 경로들 읽어오기
    const {
      segmentList, temp, dir
    } = await videosServices.determineSegments({ videoIdentifier, start, end});

    // 비디오 합치기
    const tempPath = await videosServices.mergeVideo({  segmentList, temp, dir });

    // 비디오 다시 트림하기

    // 응답하기
    const fileStream = fs.createReadStream(tempPath);
    res.attachment(tempPath);
    fileStream.pipe(res);
  }catch (e) {
    next(e);
  }
}