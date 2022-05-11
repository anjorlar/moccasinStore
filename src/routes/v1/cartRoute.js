const { Router } = require("express");
const CartController = require("../../controllers/cartController");
const { authToken, authUser } = require("../../middlewares/auth");

const router = Router();

router.post("/create-cart", authToken, authUser, CartController.createCart);
router.get("/individual-users-cart", authToken, authUser, CartController.getAUsersCart)
router.delete("/clear-cart", authToken, authUser, CartController.deleteCart)
router.patch("/update-cart", authToken, authUser, CartController.updateCart)
router.post("/checkout", authToken, authUser, CartController.cartCheckout)

module.exports = router;
