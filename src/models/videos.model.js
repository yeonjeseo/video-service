export default (sequelize, DataTypes) =>
  sequelize.define(
    'tbl_videos',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '주 식별자',
      },
      original_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '원래 이름'
      },
      net_segment_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "세그먼트 갯수"
      },
      file_uuid: {
        type: DataTypes.STRING(),
        allowNull: false,
        comment: "파일 uuid"
      },
      duration: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        default: 0,
        comment: '영상 길이'
      }
    },
    {
      sequelize,
      tableName: 'tbl_videos',
      timestamps: true,
      charset: 'utf8',
      collation: 'utf8_general_ci',
    }
  );