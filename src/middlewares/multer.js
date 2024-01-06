import multer from 'multer';

export const singleFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => callback(null, `${process.cwd()}/uploads`),
    filename: (req, file, callback) => {
      req.body = JSON.parse(JSON.stringify(req.body));
      callback(null, file.originalname);
    },
  }),
})