import _Videos from './videos.model.js';

const initModel = (sequelize, DataTypes) => {
  const Videos = _Videos(sequelize, DataTypes);

  // Users.hasMany(PurchasedItems, {foreignKey: 'user_id', sourceKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
  // PurchasedItems.belongsTo(Users, {foreignKey: 'user_id', sourceKey: 'id'});

  return {sequelize, Videos};
};

export default initModel;
