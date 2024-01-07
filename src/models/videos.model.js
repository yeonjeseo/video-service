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
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    },
    {
      sequelize,
      tableName: 'tbl_videos',
      timestamps: true,
      charset: 'utf8',
      collation: 'utf8_general_ci',
      indexes: [
        {
          unique: true,
          fields: ['identifier']
        }
      ]
    }
  );