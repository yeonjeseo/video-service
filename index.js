import app from "./src/app.js";
import config from './src/config/config.js';
import fs from 'fs';
import db from './src/models/index.js';
const NODE_PORT = config.NODE_PORT || 8081;

const uploadsDirectory = './uploads';
const tempDirectory = './temp'

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory);
  console.log('uploads directory created.');
}
if (!fs.existsSync(tempDirectory)) {
  fs.mkdirSync(tempDirectory);
  console.log('temp directory created.');
}

app.listen(NODE_PORT, () => {
  console.log(`Express WAS is listening to port ${NODE_PORT}!! 👂`);
  db.sequelize.sync({alter: true}).then(() => console.log('MARIA DB connected! 🐬'));
});
