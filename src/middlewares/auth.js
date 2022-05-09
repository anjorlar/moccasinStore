const { StatusCodes } = require("http-status-codes");
const httpResponder = require("../utils/httpResponse");
const { verifyToken } = require("../utils/utils");
const UserService = require("../services/userServices");

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
        // const decoded = await jwt.verify(token, config.jwt.SECRETKEY);
        const decoded = await verifyToken(token);
        console.error('>>>>> decoded',decoded);

        if (!decoded)
            return httpResponder.errorResponse(
                res,
                "Invalid request or token expire",
                StatusCodes.UNAUTHORIZED
            );
        // req.decodedUserData = decoded
        req.id = decoded.id
        next();
    } catch (error) {
        console.error('>>>>> error',error);

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
        console.error('LLLLL',err);
		return httpResponder.errorResponse(res, "Invalid token. Please login", StatusCodes.UNAUTHORIZED);
	}
};

module.exports = { authToken, authUser }