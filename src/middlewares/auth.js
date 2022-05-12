const { StatusCodes } = require("http-status-codes");
const httpResponder = require("../utils/httpResponse");
const { verifyToken } = require("../utils/utils");
const UserService = require("../services/userServices");
const connectRedis = require("../config/redis");
const moment = require('moment')
const config = require('../config/config')

/**
 * authToken
 * @desc A middleware to authenticate users token on login 
 * @param {Object} req request any
 * @param {Object} res response any
 * @param {Function} next nextfunction middleware
 * @returns {void|Object} object
 */
const authToken = async (req, res, next) => {
    try {
        let token =
            req.headers.authorization === undefined ? "" : req.headers.authorization;

        if (token.includes("Bearer")) {
            const checkBearer = req.headers.authorization.split(" ");
            token = checkBearer[1];
        } else {
            token = req.headers.authorization;
        }
        if (!token)
            return httpResponder.errorResponse(
                res,
                "Unauthorised access",
                StatusCodes.UNAUTHORIZED
            );
        const decoded = await verifyToken(token);

        if (!decoded)
            return httpResponder.errorResponse(
                res,
                "Invalid request or token expire",
                StatusCodes.UNAUTHORIZED
            );
        req.id = decoded.id
        next();
    } catch (error) {
        console.error('error with auth token', error);

        if (error.message === "jwt expired")
            return httpResponder.errorResponse(
                res, "token expired", StatusCodes.UNAUTHORIZED
            );
        if (error.message)
            return httpResponder.errorResponse(
                res, error.message, StatusCodes.UNAUTHORIZED
            );
        if (error)
            return httpResponder.errorResponse(
                res, "Something went wrong with user login token", StatusCodes.BAD_REQUEST
            );
    }
};

/**
  * authUser
  * @desc A middleware to authenticate users
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next nextFunction middleware
  * @returns {void|Object} object
  */
const authUser = async (req, res, next) => {
    try {
        const user = await UserService.findUserById(req.id);
        if (!user || user.dataValues.isDeleted) {
            return httpResponder.errorResponse(res, "User does Not exist", StatusCodes.UNAUTHORIZED);
        }
        req.user = user.dataValues;
        next();
    } catch (err) {
        console.error('error with auth user', err);
        return httpResponder.errorResponse(res, "Invalid token. Please login", StatusCodes.UNAUTHORIZED);
    }
};


/**
 * rateLimiter
 * @desc A middleware that uses redis to implement rate limiting per ip address
 * @param req {Object} req request any
 * @param res {Object} res response object
 * @param next {Function} next nextFunction middleware
 * @returns {void|Object} object
 */
const rateLimiter = async (req, res, next) => {
    try {
        const urlVal = req.get('host')
        // * fetch records of current user using user ip address, returns null when no record is found
        connectRedis.get(urlVal, (err, record) => {
            if (err) {
                return httpResponder.errorResponse(
                    res,
                    err.message,
                    httpCodes.UNPROCESSABLE_ENTITY
                );
            }
            const currentRequestTime = moment();
            // *  if no record is found , create a new record for user and store to redis
            if (record == null) {
                const newRecord = [];
                const requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1,
                };
                newRecord.push(requestLog);
                connectRedis.set(urlVal, JSON.stringify(newRecord));
                return next();
            }
            // * if record is found, parse it's value and calculate number of requests users has made within the last window
            const data = JSON.parse(record);
            const windowStartTimestamp = moment()
                .subtract(config.windowSizeInHours, "hours")
                .unix();
            const requestsWithinWindow = data.filter((entry) => {
                return entry.requestTimeStamp > windowStartTimestamp;
            });
            const totalWindowRequestsCount = requestsWithinWindow.reduce(
                (accumulator, entry) => {
                    return accumulator + entry.requestCount;
                },
                0
            );
            // * if number of requests made is greater than or equal to the desired maximum, return error
            if (totalWindowRequestsCount >= config.maxWindowRequestCount) {
                const errMessage = `You have exceeded the ${config.maxWindowRequestCount} requests in ${config.windowSizeInHours} hours limit!`;
                return httpResponder.errorResponse(
                    res,
                    errMessage,
                    httpCodes.TOO_MANY_REQUESTS
                );
            } else {
                // * if number of requests made is less than allowed maximum, log new entry
                const lastRequestLog = data[data.length - 1];
                const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
                    .subtract(config.windowLoginInterval, "hours")
                    .unix();
                // *  if interval has not passed since last request log, increment counter
                if (
                    lastRequestLog.requestTimeStamp >
                    potentialCurrentWindowIntervalStartTimeStamp
                ) {
                    lastRequestLog.requestCount++;
                    data[data.length - 1] = lastRequestLog;
                } else {
                    // *  if interval has passed, log new entry for current user and timestamp
                    data.push({
                        requestTimeStamp: currentRequestTime.unix(),
                        requestCount: 1,
                    });
                }
                connectRedis.set(urlVal, JSON.stringify(data));
                next();
            }
        });
    } catch (error) {
        return httpResponder.errorResponse(res, "server error", httpCodes.INTERNAL_SERVER_ERROR);
    }
};

module.exports = { authToken, authUser, rateLimiter }