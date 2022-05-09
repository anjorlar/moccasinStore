const { Router } = require("express");
const productController = require("../../controllers/productController");
const { authToken, authUser } = require("../../middlewares/auth");

const router = Router();

router.get("/view-active-product",authToken, authUser, productController.viewAllActiveProducts);
router.get("/view-active-product/:id",authToken, authUser, productController.viewOneProduct);

module.exports = router;