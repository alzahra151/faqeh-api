const db = require('../models'); // Adjust based on your setup
const Category = db.Category;
const cloudinary = require('../utilies/cloudinary')

module.exports = {
    // Create a new category
    async createCategory(req, res, next) {
        try {
            const data= { name, description } = req.body;
            if (req.file) {
                const Image = await cloudinary.uploader.upload(req.file.path)
                data.img = Image.secure_url
              
            }
            console.log(data)
            const category = await Category.create(data);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    },

    // Get all categories
    async getAllCategories(req, res, next) {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    },

    // Get a category by ID
    async getCategoryById(req, res, next) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            if (!category) return res.status(404).json({ message: 'Category not found' });
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    },

    // Update a category
    async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const category = await Category.findByPk(id);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            category.name = name || category.name;
            category.description = description || category.description;

            await category.save();
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    },

    // Delete a category
    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            await category.destroy();
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
        }
    },
};
