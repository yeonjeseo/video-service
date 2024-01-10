import db from '../models/index.js';

const { VideoSegments, QueryTypes } = db;

export const insertVideoSegment = ({ videoId, uid, segmentIndex}, t) => VideoSegments.create({
  video_id: videoId,
  uid,
  segment_index: segmentIndex
}, {
  transaction: t
})

export const findSegmentsBySegmentIndexIn = ({videoId, startSegment, endSegment}) =>
  db.sequelize.query(`
    SELECT uid AS segmentUuid
    FROM tbl_video_segments
    WHERE
        video_id = ${videoId}
    AND
        segment_index BETWEEN ${startSegment} AND ${endSegment};
    ORDER BY segment_index ASC
  `, {
    type: QueryTypes.SELECT,
    raw: true
  })