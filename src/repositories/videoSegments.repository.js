import db from '../models/index.js';

const { VideoSegments } = db;

export const insertVideoSegment = ({ videoId, uid, segmentIndex}, t) => db.VideoSegments.create({
  video_id: videoId,
  uid,
  segment_index: segmentIndex
}, {
  transaction: t
})