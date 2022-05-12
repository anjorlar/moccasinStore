const { Router } = require("express");
const OrderController = require("../../controllers/orderController");
const { authToken, authUser, rateLimiter } = require("../../middlewares/auth");

const router = Router();
router.get("/individual-users-order", authToken, authUser, rateLimiter, OrderController.viewOrders)


module.exports = router;
