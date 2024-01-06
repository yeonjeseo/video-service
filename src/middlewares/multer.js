import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const singleFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => callback(null, `${process.cwd()}/uploads`),
    filename: (req, file, callback) => {
      req.body = JSON.parse(JSON.stringify(req.body));
      callback(null, uuidv4());
    },
  }),
})