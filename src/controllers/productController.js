const logger = require("../config/logger");
const httpResponder = require("../utils/httpResponse");
const { StatusCodes } = require("http-status-codes");
const { meta } = require("../utils/utils");
const ProductServices = require('../services/productServices');


/**
* @description A views all active product
* @param {Object} req  req - Http Request object
* @param {Object} res  res - Http Response object
 * @returns  {json} json
*/
exports.viewAllActiveProducts = async (req, res) => {
    try {
        const { limit, page, sortValue, sortPrice, categoryIdFilter } = req.query
        const filter = {};
        const sort = {};
        const category = {}

        filter.limit = parseInt(limit)
            ? parseInt(limit)
            : 10;
        const pages = parseInt(page)
            ? parseInt(page)
            : 1;
        filter.offSet = (pages - 1) * filter.limit;
        sort.value = sortValue == undefined ? "productName" : "size";
        sort.price = sortPrice == "asc" ? "ASC" : "DESC";
        category.categoryId = categoryIdFilter == undefined ? undefined : parseInt(categoryIdFilter)
        let dataVal;
        if (categoryIdFilter) {
            dataVal = await ProductServices.getAllProductsByCategory(filter, sort, category);
        } else {
            dataVal = await ProductServices.getAllProducts(filter, sort);
        }
        return httpResponder.successResponse(
            res,
            { result: dataVal.rows },
            "products returned successfully",
            StatusCodes.OK,
            meta(dataVal.count, filter.limit, pages)
        );
    } catch (error) {
        logger.error('error with view all active products', error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



exports.viewOneProduct = async (req, res) => {
    try {
        const { id } = req.params

        const { dataValues } = await ProductServices.findProductById(id);
        return httpResponder.successResponse(
            res,
            { result: dataValues },
            "individual product returned successfully",
            StatusCodes.OK,
        );
    } catch (error) {
        logger.error('error with view one product', error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * @name search
 * @desc searchs all products
 * Route: GET: '/api/v1/search'
* @param {Object} req  req - Http Request object
* @param {Object} res  res - Http Response object
 * @returns {json} json
 */
exports.search = async (req, res) => {
    try {
        const { q, limit, page } = req.query;
        const filter = {};
        filter.limit = parseInt(limit)
            ? parseInt(limit)
            : 10;
        const pages = parseInt(page)
            ? parseInt(page)
            : 1;
        filter.offSet = (pages - 1) * filter.limit;
        const { count, rows } = await ProductServices.searchProduct(filter, q);
        const result = [];
        if (rows.length > 0) {
            for (const element of rows) {
                result.push(element);
            }
        }
        return httpResponder.successResponse(
            res,
            { result },
            "result returned successfully",
            StatusCodes.OK,
            meta(count, filter.limit, pages)
        );
    } catch (error) {
        logger.error('error with search', error);
        return httpResponder.errorResponse(
            res,
            "internal_server_error",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
};