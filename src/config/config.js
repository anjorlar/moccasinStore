require("dotenv").config();
const appName = "moccasin-store";

module.exports = {
  appName: appName,
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT,

  development: {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },

  test: {
    database: process.env.TEST_DB_NAME,
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    host: process.env.TEST_DB_HOST,
    dialect: process.env.DB_DIALECT,
  },

  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },

  salt: process.env.SALT_ROUND,
  jwt: {
    SECRETKEY: process.env.JWT_SECRET_KEY,
    expires: process.env.JWT_EXPIRY,
    issuer: process.env.ISSUER,
    alg: process.env.JWT_ALG,
  },
};
