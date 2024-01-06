import express from "express";
import videosRoute from "./videos.route.js";

const rootRoute = express.Router();

rootRoute.use('/videos', videosRoute);

export default rootRoute;