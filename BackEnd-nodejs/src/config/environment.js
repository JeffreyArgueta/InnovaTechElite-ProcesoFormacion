const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = [
  'DB_URI',
  'DB_DIALECT',
];

const missingEnvVar = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVar.length > 0) {
  throw new Error(`Variables de entorno requeridas no encontradas: ${missingEnvVar.join(', ')}`);
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DB_URI: process.env.DB_URI,
  DB_DIALECT: process.env.DB_DIALECT
}
