const models = require("../models");

const OrderServices = {
    createCartProduct(orderDataVal) {
        return models.orders.create({
            orderId: orderDataVal.id,
            productId: orderDataVal.productId
        })
    },

    async createOrder(orderData) {
        return models.orders.bulkCreate(orderData)
    },

    getASingleUsersOrder(filter, userId) {
        return models.orders.findAll({
            include: [{
                model: models.products,
                through: {
                    attributes: []
                }
            }],
            where: {
                userId,
            },

            offset: filter.offSet,
            limit: filter.limit,
        });
    },

    countToGetASingleUsersOrder(filter, userId) {
        return models.orders.count({
            include: [{
                model: models.products,
                through: {
                    attributes: []
                }
            }],
            where: {
                userId,
            },
        });
    },

}
module.exports = OrderServices
