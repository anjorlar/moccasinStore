const { StatusCodes } = require("http-status-codes");
const httpResponder = require("../utils/httpResponse");
const connectRedis = require("../config/redis");



/**
 * cachedSearch
 * @desc A middleware to cache search query
 * @param {Object} req request any
 * @param {Object} res response object
 * @param {Function} next nextFunction middleware
 * @returns {void|Object} object
 */
exports.cachedSearch = async (req, res, next) => {
    console.log('>>>>> got here')
    try {
        const search = req.query.search;
        console.log('>>>>> got here', search)
        connectRedis.get(`${search}`, (err, data) => {
            if (err) throw err;
            if (data) {
                const result = JSON.parse(data);
                return httpResponder.successResponse(
                    res,
                    result,
                    "search results returned",
                    StatusCodes.OK
                );
            }
            next();
        });
    } catch (err) {
        console.error('err >>>>', err)
        return httpResponder.errorResponse(
            res,
            'Internal server error',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
};