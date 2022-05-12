/*** Set's up redis connection  */
const redis = require('redis');
const logger = require("./logger");
const config = require("./config");

const connectRedis = redis.createClient(
    config.redis.url
)
//
connectRedis.on('connect', function () {
    logger.info(`connection to redis Db successful`)
});

connectRedis.on('error', function (err) {
    logger.error(`Unable to connect to the redis instance with error: ${err}`);
    process.exit(1);
});

module.exports = connectRedis
