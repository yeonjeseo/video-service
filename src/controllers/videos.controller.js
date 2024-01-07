import { httpStatus } from '../utils/index.js'
import {videosServices} from '../services/index.js'
export const saveVideo = async (req, res, next) => {
  try {
    const {file,body} = req;
    await videosServices.splitAndSaveVideoInfos(file);
    return res.status(httpStatus.OK).json("ok");
  }catch (e) {
    next(e);
  }
}
