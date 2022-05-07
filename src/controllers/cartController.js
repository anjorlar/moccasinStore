const logger = require("../config/logger");
const httpResponder = require("../utils/httpResponse");
const { StatusCodes } = require("http-status-codes");
const { cartSchema, } = require("../utils/schemaDefination");
const { validateRequest } = require("../utils/utils")
const CartServices = require('../services/cartServices');
const ProductServices = require('../services/productServices');
const CartProductServices = require('../services/cartProductServices');


exports.addItemToCart = async (req, res) => {
    try {
        const { id, name, email } = req.user
        // const buyerId = this.getUserId(token, res);

        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return httpResponder.errorResponse(res, { message: 'Please fill in all required fields including,productId, quantity' },
                StatusCodes.BAD_REQUEST);
        };
        const products = [{
            productId,
            quantity
        }]
        const body = {
            userId: id,
            // cart: products
            quantity
        };
        // bulk create in sequelize
        // check if cart exist
        const record = await this.cartService.getIfCartIdExist({ buyerId }); // if cart does not yet have orders ie it is null or orders is unfulfilled then 
        if (record) {
            const checkAndAdd = this.checkIfProductIdExistAndIncrement({
                productId,
                quantity
            }, record.cart);
            let cartData;
            if (checkAndAdd.changed) {
                cartData = checkAndAdd.respArray;
            } else {
                cartData = record.cart;
                cartData.push({
                    productId,
                    quantity
                })
            }


            const updatedData = await this.cartService.updateCartBybuyerId({ buyerId }, cartData);
            logger.info('cart updated successfully', updatedData);
            return httpResponder.successResponse(res, {
                message: 'Cart created successfully',
                response: updatedData,
            }, StatusCodes.CREATED);
        } else {
            const data = await this.cartService.addNewCart(body);
            logger.info('cart created successfully', data)
            return Response.success(res, {
                message: 'Cart created successfully',
                response: data,
            }, HttpStatus.CREATED);
        }

    } catch (error) {
        logger.error('Error creating cart', error);
        console.error('Error creating cart', error);
        return Response.failure(res, {
            message: 'Internal server Error',
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

exports.addToCart = async (req, res) => {
    // validate request object
    const errors = await validateRequest(req.body, cartSchema);
    if (errors) {
        return httpResponder.errorResponse(res, errors, StatusCodes.BAD_REQUEST);
    }
    const { id } = req.user
    const { productId, quantity } = req.body;
    console.log('>>>> req.user', req.user)

    try {
        let cartDetails = await CartServices.getCart(id);
        console.log('>>>> cartDetails', cartDetails)
        let productDetails = await ProductServices.findProductById(productId);

        if (!productDetails) {
            return httpResponder.errorResponse(res,
                `Product Id passed does not exist please pass a valid Id`,
                StatusCodes.BAD_REQUEST);
        }
        // If Cart Exists
        if (cartDetails.length < 0) {
            //---- Check if index exists ----
            const indexFound = cartDetails.findIndex(item => item.id == productId);
            //------This removes an item from the the cart if the quantity is set to zero, We can use this method to remove an item from the list  -------
            if (indexFound !== -1 && quantity <= 0) {
                cartDetails.splice(indexFound, 1);
                if (cartDetails.length == 0) {
                    cartDetails.subTotal = 0;
                } else {
                    cartDetails.subTotal = cart.map(item => item.total).reduce((acc, next) => acc + next);
                }
            }
            //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
            else if (indexFound !== -1) {
                cartDetails.items[indexFound].quantity = cartDetails.items[indexFound].quantity + quantity;
                cartDetails.items[indexFound].total = cartDetails.items[indexFound].quantity * productDetails.price;
                cartDetails.items[indexFound].price = productDetails.price
                cartDetails.subTotal = cartDetails.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----Check if quantity is greater than 0 then add product to cart array ----
            else if (quantity > 0) {
                cartDetails.push({
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.price,
                    total: parseInt(productDetails.price * quantity)
                })
                cartDetails.subTotal = cartDetails.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----If quantity of price is 0 throw the error -------
            else {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Invalid request"
                })
            }
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process successful",
                data: data
            })
        }
        //------------ This creates a new cart and then adds the item to the cart that has been created------------
        else {
            console.log('>>>> got here')
            const cartData = [{
                productId: productId,
                quantity: quantity,
                price: parseInt(productDetails.dataValues.price * quantity),
                userId: id,
                cartStatus: 'notcheckedout'
            }]
            let cartDataVal = await CartServices.createCart(cartData)
            if (cartDataVal) {
                console.error('>>>> cartDataVal ????', cartDataVal);
                let data = await CartProductServices.createCartProduct(cartDataVal);
                // let data = await CartProductServices.createCart.map( each => each.productId, each.cartDataVal.dataValues.id);
            }
            return httpResponder.successResponse(res, cartDataVal, "cart created successfully", StatusCodes.CREATED);
        }
    } catch (err) {
        logger.error(err);
        console.error(err);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

exports.getCart = async (req, res) => {
    try {
        let cart = await CartServices.cart()
        if (!cart) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart not Found",
            })
        }
        res.status(200).json({
            status: true,
            data: cart
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
}

exports.createCart = async (req, res) => {
    try {
        const { products } = req.body

        const { id } = req.user
        console.log('>>>> req.user', req.user)
        let productArr = []
        if (!products) {
            return httpResponder.errorResponse(res, { message: 'Please pass the products field' },
                StatusCodes.BAD_REQUEST);
        }

        if (!Array.isArray(products)) {
            return httpResponder.errorResponse(res, { message: 'Products should be an array' },
                StatusCodes.BAD_REQUEST);
        }
        console.log('>>>> products', products)
        let cartDetails = await CartServices.getCart(id);
        console.log('>>>> products', cartDetails)

        if (cartDetails.length > 0) {
            console.log('>>>> products got here')

        } else {
            for (let each of products) {
                console.log('>>>> each', each)

                if (!each.productId || !each.quantity) {
                    return httpResponder.errorResponse(res, { message: 'Products must be an array which contains an object with the keys productId ,quantity' },
                        StatusCodes.BAD_REQUEST);
                }

                const { dataValues } = await ProductServices.validateProductDetails(each.productId)
                if (!dataValues.id) {
                    return httpResponder.errorResponse(res, { message: 'Invalid ProductId Passed' },
                        StatusCodes.BAD_REQUEST);
                }

                if (!dataValues.quantity) {
                    return httpResponder.errorResponse(res, { message: 'Product is currently outOfstock' },
                        StatusCodes.BAD_REQUEST);
                }
                productArr.push({
                    quantity: each.quantity,
                    productId: each.productId,
                    userId: id,
                    cartStatus: 'notcheckedout',
                    price: Number(each.quantity) * Number(dataValues.price),
                })
            }

            const createCart = await CartServices.createCart(productArr)
            if (createCart) {
                const createCartProduct = await
                    Promise.all(createCart.map(each => CartProductServices.createCartProduct(each)))
            }
            return httpResponder.successResponse(res,
                createCart,
                "cart created successfully", StatusCodes.CREATED);
        }
    } catch (error) {
        logger.error(error);
        console.error(error);
        return httpResponder.errorResponse(res, "Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}