import { httpStatus } from '../utils/index.js'
export const saveVideo = async (req, res, next) => {
  try {
    const {file,body} = req;
    console.log(file);
    console.log(body);
    return res.status(httpStatus.OK).json("ok");
  }catch (e) {
    next(e);
  }
}