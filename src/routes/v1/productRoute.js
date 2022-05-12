const { Router } = require("express");
const productController = require("../../controllers/productController");
const { authToken, authUser, rateLimiter } = require("../../middlewares/auth");

const router = Router();

router.get("/view-active-product", authToken, authUser, rateLimiter, productController.viewAllActiveProducts);
router.get("/view-active-product/:id", authToken, authUser, productController.viewOneProduct);

module.exports = router;