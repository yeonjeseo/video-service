import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const singleFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const dir = uuidv4();
      const uploadPath = `${process.cwd()}/uploads/${dir}`;

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      req.diretoryName = dir;
      callback(null, uploadPath)
    },
    filename: (req, file, callback) => {
      req.body = JSON.parse(JSON.stringify(req.body));
      callback(null, req.diretoryName);
    },
  }),
});