const { Router } = require("express");
const OrderController = require("../../controllers/orderController");
const { authToken, authUser } = require("../../middlewares/auth");

const router = Router();
router.get("/individual-users-order", authToken, authUser, OrderController.viewOrders)


module.exports = router;
