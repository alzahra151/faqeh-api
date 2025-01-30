const { Router } = require("express");
const wishListController = require("../controlers/wish_list");
const authorization = require("../middleware's/authorization");
const router = Router();

router.post("/add", authorization, wishListController.addToWishlist);
router.get("/details", authorization, wishListController.getUserWishlist);

module.exports = router