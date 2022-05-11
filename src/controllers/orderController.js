const logger = require("../config/logger");
const httpResponder = require("../utils/httpResponse");
const { StatusCodes } = require("http-status-codes");
const { meta } = require("../utils/utils");
const OrderService = require('../services/orderService');


exports.viewOrders = async (req, res) => {
    try {
        const { limit, page } = req.query
        const { id } = req.user

        const filter = {};
        filter.limit = parseInt(limit)
            ? parseInt(limit)
            : 10;
        const pages = parseInt(page)
            ? parseInt(page)
            : 1;
        filter.offSet = (pages - 1) * filter.limit;
        let order = await OrderService.getASingleUsersOrder(filter, id)
        let orderCount = await OrderService.countToGetASingleUsersOrder(filter, id)

        if (!order.length < 0) {
            return httpResponder.errorResponse(res, 'This user does not have an active cart',
                StatusCodes.BAD_REQUEST);
        }
        return httpResponder.successResponse(res, order, "order gotten successfully",
            StatusCodes.OK,
            meta(orderCount, filter.limit, pages)
        );
    } catch (error) {
        logger.error('error with view orders', error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);

    }
}