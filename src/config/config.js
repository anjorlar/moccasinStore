require("dotenv").config();
const appName = "moccasin-store";

module.exports = {
  appName: appName,
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT,

  development: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    url: process.env.DATABASE_URL,
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
