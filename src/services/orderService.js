const models = require("../models");

const OrderServices = {
    createCartProduct(orderDataVal) {
        console.log('>>>>>> cartDataVal', orderDataVal)
        return models.orders.create({
            orderId: orderDataVal.id,
            productId: orderDataVal.productId
        })
    },

    async createOrder(orderData) {
        return models.orders.bulkCreate(orderData)
    },

    getASingleUsersOrder(filter, userId) {
        console.log('>>>> filter', filter)
        return models.orders.findAll({
            include: [{
                model: models.products,
                // attributes: ['id','productName','imageThumbnail', 'price', 'size','productDetails'],
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
        console.log('>>>> filter', filter)
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
