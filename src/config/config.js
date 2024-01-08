import 'dotenv/config';

const envVars = process.env;

const config = {
  NODE_ENV: 'development',
  NODE_PORT: 8081,
  SEQUELIZE: {
    development: {
      host: envVars.MARIADB_HOST || 'mariadb',
      database: envVars.MARIADB_DATABASE || 'mydatabase',
      username: envVars.MARIADB_USER || 'myuser',
      password: envVars.MARIADB_PASSWORD || 'mypassword',
      dialect: 'mariadb',
      logging: true,
      timezone: '+09:00',
    }
  },
  UNIT_SEGMENT_DURATION: envVars.UNIT_SEGMENT_DURATION
}

export default config;