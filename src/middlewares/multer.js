import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const singleFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const videoUuid = uuidv4();
      const uploadPath = `${process.cwd()}/uploads/${videoUuid}`;

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      req.fileUuid = videoUuid;
      callback(null, uploadPath)
    },
    filename: (req, file, callback) => {
      const originalName = file.originalname;
      req.body = JSON.parse(JSON.stringify(req.body));
      callback(null, originalName);
    },
  }),
});

export const memoryUsage =  multer({
  storage: multer.memoryStorage()
})
