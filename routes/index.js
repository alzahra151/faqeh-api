const { Router } = require("express");
const routes = Router();
const authRoutes = require('../routes/auth')
const productRoutes = require('./prouduct')
const cartRoutes=require('./cart')
const orderRoutes = require('./order')
const wishListRoutes = require('./wish_list')
const categoryRoutes = require('./category')
const paypalRoutes = require('./paypal')

routes.use("/api/v1/product", productRoutes);
routes.use("/api/v1/user", authRoutes);
routes.use("/api/v1/cart", cartRoutes);
routes.use("/api/v1/order", orderRoutes);
routes.use("/api/v1/wish-list", wishListRoutes);
routes.use("/api/v1/category", categoryRoutes);
routes.use("/api/v1", paypalRoutes);

module.exports=routes