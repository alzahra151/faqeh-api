
const orderController = require("../controlers/order");
const authorization = require("../middleware's/authorization");
const { Router } = require("express");
const router = Router();

router.post("/add" ,orderController.addOrder);
router.get("/", orderController.getOrders);

module.exports = router