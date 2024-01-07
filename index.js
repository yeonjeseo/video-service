import app from "./src/app.js";
import config from './src/config/config.js';
import fs from 'fs';
import db from './src/models/index.js';
const {NODE_PORT} = config;

const uploadsDirectory = './uploads';
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory);
  console.log('uploads directory created.');
}

app.listen(NODE_PORT, () => {
  console.log(`Express WAS is listening to port ${NODE_PORT}!! 👂`);
  // db.sequelize.sync({alter: true}).then(() => console.log('MARIA DB connected! 🐬'));
});
