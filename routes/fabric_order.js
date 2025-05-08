const express = require('express');
const router = express.Router();
const fabricOrderController = require('../controlers/fabric_order');

// Create a category
router.post('/add',fabricOrderController.createFabricOrder);
// Get all categories
router.get('/', fabricOrderController.getAllFabricOrders);
// Get a category by ID
router.get('/:id', fabricOrderController.getFabricOrderById);

module.exports = router;