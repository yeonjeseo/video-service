import Sequelize, {QueryTypes} from 'sequelize';
import config from '../config/config.js';
import initModel from './associations.js';

const env = config.NODE_ENV;
const sequelizeConfig = config.SEQUELIZE[env];
console.log(sequelizeConfig)

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  sequelizeConfig
);
const {DataTypes} = Sequelize;

const db = initModel(sequelize, DataTypes);

db.sequelize = sequelize;
db.QueryTypes = QueryTypes;

export default db;