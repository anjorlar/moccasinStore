const models = require("../models");
const { Op } = require("sequelize");

const CartProductServices = {
    createCartProduct(cartDataVal) {
        try {
            return models.cartProducts.create({
                cartId: cartDataVal.id,
                productId: cartDataVal.productId
            })
        } catch (error) {
            console.error('error createCartProduct', error);
        }
    },

    getASingleUsersCart(filter, userId) {
        return models.cartProducts.findAndCountAll({
            include: [{
                model: models.carts,
                include: [{
                    model: models.users,
                }],
            }, {
                model: models.products,
            }],
            offset: filter.offSet,
            limit: filter.limit,
        });
    },
}
module.exports = CartProductServices
