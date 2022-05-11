const models = require("../models");
const { Op } = require("sequelize");

const ProductServices = {

    getAllProducts(filter, sort) {
        return models.products.findAndCountAll({
            include: [{
                model: models.categories,
                attributes: ['categoryName',]
            }],
            offset: filter.offSet,
            limit: filter.limit,
            order: [[`${sort.value}`, `${sort.price}`]],
            productStatus: true,
            attributes: ['id', 'productName', 'sku', 'quantity', 'productDetails', 'size', 'price', 'imageThumbnail']
        });
    },

    getAllProductsByCategory(filter, sort, category) {
        return models.products.findAndCountAll({
            include: [{
                model: models.categories,
                attributes: ['categoryName',]
            }],
            where: {
                categoryId: category.categoryId,
            },
            offset: filter.offSet,
            limit: filter.limit,
            order: [[`${sort.value}`, `${sort.price}`]],
            productStatus: true,
            attributes: ['productName', 'sku', 'quantity', 'productDetails', 'size', 'price', 'imageThumbnail']
        });
    },

    findProductById(id) {
        return models.products.findByPk(id, {
            productStatus: true,
            include: [{
                model: models.categories,
                // required: false,
                // where: {
                //     Time: { [op.eq]:null }
                // },
            }]
        });
    },

    searchProduct(filter, q) {
        return models.products.findAndCountAll({
            where: {
                [Op.or]: [
                    { productName: { [Op.like]: "%" + q + "%" } },
                    { productDetails: { [Op.like]: "%" + q + "%" } },
                ],
            },
            productStatus: true,
            include: [
                {
                    model: models.categories,
                    required: true,
                    // include: {
                    // 	model: models.cart,
                    // },
                },
            ],
            offset: filter.offSet,
            limit: filter.limit,
        });
    },

    validateProductDetails(id) {
        return models.products.findByPk(id, {
            productStatus: true,
            attributes: ['id', 'quantity', 'price', 'productName']
        })
    },

    async updateProductQty(each, flag) {
        try {
            let val = await models.products.findByPk(each.productId, {
                attributes: ['id', 'quantity']
            })
            let newQty = flag == 'subtract'
            ? Number(val.quantity) - Number(each.quantity)
            : Number(val.quantity) +  Number(each.quantity)
            return models.products.update(
                { quantity: newQty },
                { where: { id: each.productId } }
            )
        } catch (error) {
            throw new Error(error)
        }
    },
}

module.exports = ProductServices;