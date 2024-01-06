import express from "express";
import {videosController} from '../controllers/index.js'
import {singleFile} from "../middlewares/multer.js";

const videosRoute = express.Router();

videosRoute.route('/')
  .post(singleFile.single('video'), videosController.saveVideo);

export default videosRoute;