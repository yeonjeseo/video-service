import db from '../models/index.js';

const { Videos } = db;

export const insertVideo = ({original_name, net_segment_count, file_uuid, duration}, t) =>
  Videos.create({
    original_name,
    net_segment_count,
    file_uuid,
    duration
  }, { transaction: t })

export const findVideoById = (videoIdentifier) => db.sequelize.query(`
  SELECT 
       original_name AS originalName,
       net_segment_count AS netSegmentCount
  FROM tbl_videos
  WHERE 
      id = ${videoIdentifier};
`, {
  type: db.QueryTypes.SELECT,
  raw: true
})