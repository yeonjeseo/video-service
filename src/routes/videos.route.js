import express from "express";
import {videosController} from '../controllers/index.js'
import {singleFile, memoryUsage} from "../middlewares/multer.js";

const videosRoute = express.Router();

videosRoute.route('/')
  .post(memoryUsage.single('video'), videosController.saveVideo);
videosRoute.route('/:videoIdentifier')
  .get(videosController.getVideo);
export default videosRoute;