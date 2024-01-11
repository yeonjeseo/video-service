export default (sequelize, DataTypes) =>
  sequelize.define(
    'tbl_video_segments',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '주 식별자',
      },
      uid: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: "uuid"
      },
      video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '비디오 ID FK'
      },
      segment_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "세그먼트 인덱스, 0 based"
      }
    },
    {
      sequelize,
      tableName: 'tbl_video_segments',
      timestamps: true,
      charset: 'utf8',
      collation: 'utf8_general_ci',
      indexes: [
        {
          name: 'idx_segment_video_id',
          fields: ['video_id'],
        },
      ],
    }
  );