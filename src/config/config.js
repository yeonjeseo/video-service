import 'dotenv/config';

const envVars = process.env;

const config = {
  NODE_ENV: envVars.NODE_ENV,
  NODE_PORT: envVars.NODE_PORT,
  SEQUELIZE: {
    development: {
      host: envVars.MARIADB_HOST,
      database: envVars.MARIADB_DATABASE,
      username: envVars.MARIADB_USER,
      password: envVars.MARIADB_PASSWORD,
      dialect: 'mariadb',
      logging: true,
      timezone: '+09:00',
    }
  },
  UNIT_SEGMENT_DURATION: envVars.UNIT_SEGMENT_DURATION
}

export default config;