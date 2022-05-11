const logger = require("../config/logger");
const httpResponder = require("../utils/httpResponse");
const { StatusCodes } = require("http-status-codes");
const { cartSchema, } = require("../utils/schemaDefination");
const CartServices = require('../services/cartServices');
const ProductServices = require('../services/productServices');
const CartProductServices = require('../services/cartProductServices');
const OrderServices = require('../services/orderService')
const OrderProductServices = require('../services/orderProductServices')
const { meta } = require("../utils/utils");
const { v4: uuidv4 } = require('uuid');


exports.getAUsersCart = async (req, res) => {
    try { // do pagination then do get all by cart status note youre getting by userId ( youre getting not checked out)
        const { limit, page } = req.query
        const { id } = req.user

        const filter = {};
        filter.limit = parseInt(limit)
            ? parseInt(limit)
            : 10;
        const pages = parseInt(page)
            ? parseInt(page)
            : 1;
        filter.offSet = (pages - 1) * filter.limit;
        let cart = await CartServices.getASingleUsersCart(filter, id)
        let cartCount = await CartServices.countToGetASingleUsersCart(filter, id)

        if (!cart.length < 0) {
            return httpResponder.errorResponse(res, 'This user does not have an active cart',
                StatusCodes.BAD_REQUEST);
        }
        return httpResponder.successResponse(res, cart, "cart gotten successfully",
            StatusCodes.OK,
            meta(cartCount, filter.limit, pages)
        );
    } catch (error) {
        logger.error(error);
        console.error(error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);

    }
}

exports.createCart = async (req, res) => {
    try {
        const { products } = req.body

        const { id } = req.user
        let productArr = []
        if (!products) {
            return httpResponder.errorResponse(res, 'Please pass the products field',
                StatusCodes.BAD_REQUEST);
        }

        if (!Array.isArray(products)) {
            return httpResponder.errorResponse(res, 'Products should be an array',
                StatusCodes.BAD_REQUEST);
        }
        let cartDetails = await CartServices.getCart(id);


        if (cartDetails.length > 0) {
            return httpResponder.errorResponse(res,
                'This user already has a cart, Please use the update cart endpoint to update your cart',
                StatusCodes.BAD_REQUEST);
        }

        for (let each of products) {

            if (!each.productId || !each.quantity) {
                return httpResponder.errorResponse(res, 'Products must be an array which contains an object with the keys productId ,quantity',
                    StatusCodes.BAD_REQUEST);
            }

            const { dataValues } = await ProductServices.validateProductDetails(each.productId)
            if (!dataValues.id) {
                return httpResponder.errorResponse(res, 'Invalid ProductId Passed',
                    StatusCodes.BAD_REQUEST);
            }

            if (dataValues.quantity < 1) {
                return httpResponder.errorResponse(res, 'Product is currently out of stock',
                    StatusCodes.BAD_REQUEST);
            }
            productArr.push({
                quantity: each.quantity,
                productId: each.productId,
                userId: id,
                cartStatus: 'notcheckedout',
                totalPrice: Number(each.quantity) * Number(dataValues.price),
                pricePerUnit: Number(dataValues.price)
            })
        }

        const createCartRes = await CartServices.createCart(productArr)
        if (createCartRes) {
            const createCartProduct = await Promise.all(createCartRes.map(each => CartProductServices.createCartProduct(each)))
            const updateProductQty = await Promise.all(createCartRes.map(each => ProductServices.updateProductQty(each, 'subtract')))

        }
        return httpResponder.successResponse(res,
            createCartRes,
            "cart created successfully", StatusCodes.CREATED);

    } catch (error) {
        logger.error(error);
        console.error(error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

exports.cartCheckout = async (req, res) => {
    try {
        const { id } = req.user
        const { address } = req.body

        if (!address) {
            return httpResponder.errorResponse(res, 'Please Pass the delivery address',
                StatusCodes.BAD_REQUEST);
        }
        let OrderArr = []
        let cartDetails = await CartServices.getCart(id);
        if (cartDetails.length == 0) {
            return httpResponder.errorResponse(res, `This user does not have an active cart`,
                StatusCodes.BAD_REQUEST)
        }

        for (let each of cartDetails) {

            const { dataValues } = await ProductServices.validateProductDetails(each.productId)
            if (!dataValues.id) {
                return httpResponder.errorResponse(res, 'Invalid ProductId Passed',
                    StatusCodes.BAD_REQUEST);
            }

            if (dataValues.quantity < 1) {
                return httpResponder.errorResponse(res, `${dataValues.productName} is out of stock`,
                    StatusCodes.BAD_REQUEST)
            };
        }
        const moveCartStatusToCheckedout = await Promise.all(cartDetails.map(each => CartServices.updateCartStatus(each, 'checkedout')))
        if (moveCartStatusToCheckedout) {
            for (let each of cartDetails) {
                OrderArr.push({
                    transactionId: uuidv4(),
                    userId: id,
                    cartId: each['id'],
                    productId: each.productId,
                    address
                })
            }
            const updateProductQty = await Promise.all(cartDetails.map(each => ProductServices.updateProductQty(each, 'subtract')))
            // create order on checkout
            const createOrder = await OrderServices.createOrder(OrderArr)
            // create order product
            const createOrderProduct = await Promise.all(createOrder.map(each => OrderProductServices.createOrderProduct(each)))

        }

        return httpResponder.successResponse(res,
            cartDetails,
            "cart checkedout successfully", StatusCodes.OK)
    } catch (error) {
        logger.error('Error with cart checkout', error);
        console.error('Error with cart checkout', error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);

    }
};

exports.updateCart = async (req, res) => {
    try {
        const { products } = req.body

        const { id } = req.user
        let productArr = []
        if (!products) {
            return httpResponder.errorResponse(res, 'Please pass the products field',
                StatusCodes.BAD_REQUEST);
        }

        if (!Array.isArray(products)) {
            return httpResponder.errorResponse(res, 'Products should be an array',
                StatusCodes.BAD_REQUEST);
        }
        let cartDetails = await CartServices.getCart(id);
        if (cartDetails.length < 0) {
            return httpResponder.errorResponse(res,
                'This user does not have a cart to update, Please use the create cart endpoint',
                StatusCodes.BAD_REQUEST);
        }
        // set all products in carts to abandoned and increase the quantity in the product table back
        const productQtyUpdateAdd = await Promise.all(cartDetails.map(each => ProductServices.updateProductQty(each, 'add')))

        const moveCartStatusToAbandoned = await Promise.all(cartDetails.map(each => CartServices.updateCartStatus(each, 'abandoned')))

        for (let each of products) {

            if (!each.productId || !each.quantity) {
                return httpResponder.errorResponse(res, 'Products must be an array which contains an object with the keys productId ,quantity',
                    StatusCodes.BAD_REQUEST);
            }

            const { dataValues } = await ProductServices.validateProductDetails(each.productId)
            if (!dataValues.id) {
                return httpResponder.errorResponse(res, 'Invalid ProductId Passed',
                    StatusCodes.BAD_REQUEST);
            }

            if (dataValues.quantity < 1) {
                return httpResponder.errorResponse(res, 'Product is currently out of stock',
                    StatusCodes.BAD_REQUEST);
            }
            const cartDetailsProductIndexFound = cartDetails.findIndex(item => {
                return item.productId == each.productId
            });

            //Check if product exist, just add the previous quantity with the new quantity and update the total price
            if (cartDetailsProductIndexFound !== -1) {

                productArr.push({
                    quantity: Number(cartDetails[cartDetailsProductIndexFound].quantity) + Number(each.quantity),
                    productId: each.productId,
                    userId: id,
                    cartStatus: 'notcheckedout',
                    totalPrice: Number(cartDetails[cartDetailsProductIndexFound].quantity) + Number(each.quantity) * Number(dataValues.price),
                    pricePerUnit: Number(dataValues.price)
                })
            } else if (cartDetailsProductIndexFound === -1) {
                productArr.push({
                    quantity: each.quantity,
                    productId: each.productId,
                    userId: id,
                    cartStatus: 'notcheckedout',
                    totalPrice: Number(each.quantity) * Number(dataValues.price),
                    pricePerUnit: Number(dataValues.price)
                })
            }

        }
        const createCartRes = await CartServices.createCart(productArr)
        if (createCartRes) {
            const createCartProduct = await Promise.all(createCartRes.map(each => CartProductServices.createCartProduct(each)))
            const updateProductQty = await Promise.all(createCartRes.map(each => ProductServices.updateProductQty(each, 'subtract')))

        }
        return httpResponder.successResponse(res,
            createCartRes,
            "cart updated successfully", StatusCodes.OK)


    } catch (error) {
        logger.error('Error updating cart', error);
        console.error('Error updating cart', error);
        return httpResponder.errorResponse(res,
            'Internal server Error',
            StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { id } = req.user

        let cartDetails = await CartServices.getCart(id);
        if (cartDetails === null || cartDetails.length === 0) {
            return Response.failure(res, 'There are no carts to delete',
                StatusCodes.BAD_REQUEST);
        };
        // changes the cart status to abandoned (soft delete)
        const updatedCart = await Promise.all(cartDetails.map(each => CartServices.updateCartStatus(each, 'abandoned')));
        return httpResponder.successResponse(res,
            [],
            'Cart deleted successfully',
            StatusCodes.OK);
    } catch (error) {
        logger.error('Error deleting cart', error);
        console.error('Error deleting cart', error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
    }
};