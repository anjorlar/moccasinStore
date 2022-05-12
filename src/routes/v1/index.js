const { Router } = require("express");
const AuthController = require("../../controllers/AuthController");
const cartRoute = require("./cartRoute");
const product = require("./productRoute");
const order = require("./orderRoute");
const productController = require("../../controllers/productController");
const { cachedSearch } = require('../../middlewares/cache')
const { rateLimiter } = require("../../middlewares/auth");

const router = Router();

router.use("/order", order);
router.use("/product", product);
router.use("/cart", cartRoute);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/search", rateLimiter, cachedSearch, productController.search);

module.exports = router;