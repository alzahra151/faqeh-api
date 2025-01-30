const express = require('express');
const router = express.Router();
const categoryController = require('../controlers/category');
const upload=require('../utilies/multer')
// Create a category
router.post('/add', upload.single("img") ,categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get a category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category
router.put('/:id', categoryController.updateCategory);

// Delete a category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;