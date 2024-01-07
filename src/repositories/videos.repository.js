import db from '../models/index.js';

const { Videos } = db;

export const insertVideo = ({ identifier, original_name, net_segment_count}) =>
  Videos.create({
    identifier,
    original_name,
    net_segment_count
  })

export const findVideoByUuid = (videoIdentifier) => db.sequelize.query(`
  SELECT 
       original_name AS originalName,
       net_segment_count AS netSegmentCount
  FROM tbl_videos
  WHERE 
      identifier = '${videoIdentifier}';
`, {
  type: db.QueryTypes.SELECT,
  raw: true
})