const models = require("../models");

const OrderProductServices = {
    createOrderProduct(orderDataVal) {
        return models.orderProducts.create({
            orderId: orderDataVal.id,
            productId: orderDataVal.productId
        })
    }
}
module.exports = OrderProductServices
