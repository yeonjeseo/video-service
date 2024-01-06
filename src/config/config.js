import 'dotenv/config';

const envVars = process.env;

const config = {
  NODE_ENV: envVars.NODE_ENV,
  NODE_PORT: envVars.NODE_PORT
}

export default config;