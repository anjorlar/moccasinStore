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
    },

    getASingleUsersCart(filter, userId) {
        return models.cartProducts.findAndCountAll({
            //     include: [{
            //         model: models.products,
            //         through: {
            //             model: models.cartProducts
            //         }
            //     }], 
            //        include: [{
            //         model: models.users,
            //     }],
            //     where: {
            //         cartStatus: 'notcheckedout',
            //         userId,
            //     },
            //     offset: filter.offSet,
            //     limit: filter.limit,

            include: [{
                model: models.carts,
                // where: {
                //     cartStatus: 'notcheckedout',
                //     userId,
                // },
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
