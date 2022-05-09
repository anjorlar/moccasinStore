const models = require("../models");
const { Op } = require("sequelize");

const CartServices = {

 async createCart(cartData) {
    // return models.carts.create(cartData)
    return models.carts.bulkCreate(cartData)
 },

async getCart (userId) {
    return models.carts.findOne({
        where: {
            userId,
            cartStatus: 'notcheckedout'
        },
        // attributes:['']
    })
}

}

module.exports = CartServices;