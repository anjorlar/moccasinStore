const { Router } = require("express");
const CartController = require("../../controllers/cartController");
const { authToken, authUser } = require("../../middlewares/auth");

const router = Router();

router.post("/create-cart", authToken, authUser, CartController.createCart);

module.exports = router;
