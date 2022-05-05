/**
 * httpResponder object.
 * to manage reponse for all incoming request
 *
 */
 const { StatusCodes } = require("http-status-codes");

 const httpResponse = {
     async errorResponse(
         res,
         message,
         statusCode = StatusCodes.INTERNAL_SERVER_ERROR
     ) {
         return res.status(statusCode).send({
             error: true,
             code: statusCode,
             message,
         });
     },
 
     async successResponse(
         res,
         data,
         message,
         statusCode = StatusCodes.OK,
         meta = {}
     ) {
         return res.status(statusCode).send({
             error: false,
             code: statusCode,
             message,
             data,
             meta,
         });
     },
 };
 
 module.exports = httpResponse;
 