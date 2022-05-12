const logger = require("../config/logger");
const httpResponder = require("../utils/httpResponse");
const { StatusCodes } = require("http-status-codes");
const { validateRequest, hashPassword, createToken, validatePassword } = require("../utils/utils");
const { CreateUserSchema, CredentialSchema } = require("../utils/schemaDefination");
const UserService = require("../services/UserServices");


/**
 * @description A user signs up when the required data is passed in the body
 * @param {Object} req  req - Http Request object
 * @param {Object} res  res - Http Response object
 * @returns {Object} returns json
 */
exports.register = async (req, res) => {
    try {
        // validate request object
        const errors = await validateRequest(req.body, CreateUserSchema);
        if (errors) {
            return httpResponder.errorResponse(res, errors, StatusCodes.BAD_REQUEST);
        }
        const { name, email, address, password } = req.body;

        // check if user exists
        const existingUser = await UserService.findUserByEmail(email);
        if (existingUser) {
            return httpResponder.errorResponse(res, "user already exists", StatusCodes.BAD_REQUEST);
        }

        const hashedPassword = await hashPassword(password)

        const userObject = {
            name: name,
            email: email,
            address,
            password: hashedPassword
        }

        // create user
        const user = await UserService.createUser(userObject);
        const { dataValues } = user;
        delete dataValues.password;

        // * create token
        const token = await createToken({ id: dataValues.id });

        // * return newly created user
        return httpResponder.successResponse(res, { user: { ...dataValues }, token }, "user created successfully", StatusCodes.CREATED);
    } catch (error) {
        logger.error(error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


/**
* @description A user logs in when the required data is passed in the body
* @param {Object} req  req - Http Request object
* @param {Object} res  res - Http Response object
* @returns {Object} returns json
*/
exports.login = async (req, res) => {
    try {
        const errors = await validateRequest(req.body, CredentialSchema);
        if (errors) {
            return httpResponder.errorResponse(
                res,
                errors,
                StatusCodes.BAD_REQUEST
            );
        }

        // check if user exists
        const email = req.body.email;

        const user = await UserService.findUserByEmail(email);
        if (!user) {
            return httpResponder.errorResponse(
                res,
                "invalid login credentials",
                StatusCodes.NOT_FOUND
            );
        }

        // verify password and generate token
        const passwordMatch = await validatePassword(
            req.body.password,
            user.password
        );
        if (!passwordMatch) {
            return httpResponder.errorResponse(
                res,
                "invalid login credentials",
                StatusCodes.UNAUTHORIZED
            );
        }

        const { dataValues } = user;
        delete dataValues.password;
        const token = await createToken({ id: dataValues.id });

        return httpResponder.successResponse(
            res,
            { user: { ...dataValues }, token },
            "user login successful",
            StatusCodes.OK
        );
    } catch (error) {
        logger.error(error);
        return httpResponder.errorResponse(
            res,
            "Internal Server Error",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}