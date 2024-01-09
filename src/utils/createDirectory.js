import fs from "fs";

const createUploadDirectory = (path) => {
  const uploadPath = `${process.cwd()}/uploads/${path}`;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
}

export default createUploadDirectory;

