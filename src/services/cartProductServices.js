const models = require("../models");
const { Op } = require("sequelize");

const CartProductServices = {
    createCartProduct(cartDataVal) {
        try {
            console.log('>>>>>> cartDataVal', cartDataVal)
            return models.cartProducts.create({
                cartId: cartDataVal.id,
                productId: cartDataVal.productId
            })
        } catch (error) {
            console.error('error >>error ', error);
        }
    }
}
module.exports = CartProductServices
