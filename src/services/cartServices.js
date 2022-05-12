const models = require("../models");
const { Op } = require("sequelize");
const moment = require('moment')

const CartServices = {
    async createCart(cartData) {
        return models.carts.bulkCreate(cartData)
    },

    async getCart(userId) {
        return models.carts.findAll({
            where: {
                userId,
                cartStatus: 'notcheckedout'
            },
            // attributes:['']
        })
    },

    async updateCartStatus(each, flag) {
        try {
            let val = await models.carts.findByPk(each.id, {
                attributes: ['id', 'cartStatus']
            })
            let status = flag == 'abandoned'
                ? 'abandoned'
                : 'checkedout'
            return models.carts.update(
                { cartStatus: status },
                { where: { id: each.id } }
            )
        } catch (error) {
            throw new Error(error)
        }
    },

    

    getASingleUsersCart(filter, userId) {
        return models.carts.findAll({
            include: [{
                model: models.products,
                attributes: ['id', 'productName', 'imageThumbnail', 'price', 'size', 'productDetails'],
                through: {
                    attributes: []
                }
            }],
            where: {
                cartStatus: 'notcheckedout',
                userId,
            },

            offset: filter.offSet,
            limit: filter.limit,
        });
    },

    countToGetASingleUsersCart(filter, userId) {
        return models.carts.count({
            include: [{
                model: models.products,
                through: {
                    attributes: []
                }
            }],
            where: {
                cartStatus: 'notcheckedout',
                userId,
            },

        });
    },

    getAllCartsNotCheckedOutCartOlderThan24Hrs() {
        return models.carts.findAll({
            where: {
                createdAt: {
                    [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                },
                cartStatus: 'notcheckedout',
            }
        })
    }
}

module.exports = CartServices;