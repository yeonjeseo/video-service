import db from '../models/index.js';

const { Videos } = db;

export const insertVideo = ({ identifier, original_name, net_segment_count}) =>
  Videos.create({
    identifier,
    original_name,
    net_segment_count
  })