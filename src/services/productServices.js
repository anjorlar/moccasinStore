const models = require("../models");
const { Op } = require("sequelize");

const ProductServices = {

    async getAllProducts(filter, sort) {
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

    async getAllProductsByCategory(filter, sort, category) {
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

    async findProductById(id) {
        return models.products.findByPk(id, {
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
    
}

module.exports = ProductServices;