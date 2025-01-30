const { Router } = require("express");
const router = Router();
var paypalCtrl = require('../controlers/payPal');
const orderController = require("../controlers/order");

router.post("/buy", paypalCtrl.createPayment);
// router.get("/", orderController.getOrders);

module.exports = router