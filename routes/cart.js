const { Router } = require("express");
const cartController = require("../controlers/cart");
const authorization = require("../middleware's/authorization");
const router = Router();
const uploader = require('../utilies/multer')
const cloudinary = require("../utilies/cloudinary");

router.post("/add",authorization,cartController.addToCart);
router.get("/details", authorization, cartController.getCartDetails);
router.delete("/item/delete/:productId", authorization, cartController.removeCartItem);
router.post("/item/increment", authorization, cartController.incrementItemQuentity);
router.post("/item/decrement", authorization, cartController.decrementItemQuentity);
router.delete("/clear", authorization,cartController.clearCart);
router.get("/items/total", cartController.getTotalQuantity);
// router.post("/register", authController.register);

module.exports = router