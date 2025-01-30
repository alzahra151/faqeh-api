const { Router } = require("express");
const authController = require("../controlers/auth") ;
const authorization = require("../middleware's/authorization");
const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/", authController.getAllUsers);

module.exports = router