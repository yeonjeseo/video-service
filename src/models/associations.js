import _Videos from './videos.model.js';
import _VideoSegments from './video_segments.model.js'
const initModel = (sequelize, DataTypes) => {
  const Videos = _Videos(sequelize, DataTypes);
  const VideoSegments = _VideoSegments(sequelize, DataTypes);

  return {sequelize, Videos, VideoSegments};
};

export default initModel;
