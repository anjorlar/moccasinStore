const CartServices = require('../services/cartServices');
const ProductServices = require('../services/productServices');


exports.resetCartStatus = async () => {
    try {
        // get all carts withing the last 24 hours with cart status of notcheckedout
        const getOldNotCheckedOutCart = await CartServices.getAllCartsNotCheckedOutCartOlderThan24Hrs()

        // update them all to abandoned and also add the quantity back to the product stock
        await Promise.all(getOldNotCheckedOutCart.map(each => ProductServices.updateProductQty(each, 'add')))
        await Promise.all(getOldNotCheckedOutCart.map(each => CartServices.updateCartStatus(each, 'abandoned')))
    } catch (error) {
        console.error('error with resetCartStatus', error)
    }
}