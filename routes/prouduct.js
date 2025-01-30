const { Router } = require("express");
const productController = require("../controlers/product");
const authorization = require("../middleware's/authorization");
const router = Router();
const uploader = require('../utilies/multer')
const cloudinary = require("../utilies/cloudinary");

router.post("/add", uploader.fields(
    [{ name: 'images', maxCount: 10 }]), productController.createProduct);
router.get("/:id", productController.getProductById);   
router.post("/:id/discount", productController.addDiscountToProduct);

router.get("/category/:categoryId", productController.getProductsByCatId);
router.get("/", productController.getAllProducts);
router.get("/all/discounted", productController.getDiscountedProducts);

module.exports = router