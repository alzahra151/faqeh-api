// const uploadFile=require('../services/uploadFile')
const db = require("../models")
const cloudinary = require('../utilies/cloudinary')

db.Product.prototype.getDiscountedPrice = function () {
    const discountFactor = 1 - this.discount / 100;
    return parseFloat((this.price * discountFactor).toFixed(2));
};


async function createProduct(req, res, next) {
    try {
        const uploadedFiles = req.files;
        const data = req.body
        console.log(data)

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).send('No files uploaded.');
        }
        console.log(req.files['images'])
        // Process attachments upload (if any)
        if (req.files['images']) {
            const attachmentUploads = await Promise.all(
                req.files['images'].map(async (file) => {
                    try {
                        const result = await cloudinary.uploader.upload(file.path);
                        console.log(result.secure_url)
                        return result.secure_url

                    } catch (error) {
                        console.error('Error uploading attachment to Cloudinary:', error);
                        throw error;
                    }
                })
            );
            console.log(attachmentUploads)
            data.images = attachmentUploads;

        }
        const product = await db.Product.create(
            data
        );
        const images = data.images; // Extract images from the input data
        console.log(data.images)
        if (images && images.length > 0) {
            const imagePromises = images.map((image) =>
                db.Image.create({
                    productId: product.id, // Set productId from the created product
                    url: image,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            );
            await Promise.all(imagePromises);
        }
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error uploading image" });
    }
}
async function addDiscountToProduct(req, res, next) {
    try {
        const { id } = req.params;
        const { discount } = req.body;

        const product = await db.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.discount = discount;
        await product.save();

        res.json({ message: 'Discount updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error updating discount', error });
    }
}
async function getProductById(req, res, next) {
    console.log(req.params.id)
    try {
        const product = await db.Product.findByPk(req.params.id,
            {
                include: [
                    {
                        model: db.Image,
                        as: "images"
                    }
                ]
            }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const discountedPrice = product.getDiscountedPrice();
        res.json({ items: product, discountedPrice });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
}
async function getDiscountedProducts(req, res, next) {
    try {
        const products = await db.Product.findAll({
            where: {
                discount: { [db.Sequelize.Op.gt]: 0 },
            },
            include: [
                {
                    model: db.Image,
                    as: "images"
                }
            ]
        });
        const productsWithDiscounts = products.map(product => {
            const productData = product.get({ plain: true });
            return {
                ...productData,
                discount: product.discount,
                discountedPrice: product.getDiscountedPrice()
            };
        });

        res.status(200).json({ success: true, items: productsWithDiscounts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching products', error });
    }
};
async function getAllProducts(req, res, next) {
    try {
        const data = await db.Product.findAll({
            include: [
                {
                    model: db.Image,
                    as: "images"
                }
            ]
        });

        const products = data.map(product => {
            const productData = product.get({ plain: true });
            return {
                ...productData,
                discount: product.discount,
                discountedPrice: product.getDiscountedPrice()
            };
        });

        res.status(200).json({ success: true, items: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching products', error });
    }
};
async function getProductsByCatId(req, res, next) {
    try {
        const { categoryId } = req.params; // Extract categoryId from request parameters
        console.log(categoryId)
        // Find products by category ID
        const data = await db.Product.findAll({
            where: {
                categoryId, // Filter by categoryId
            },
            include: [
                {
                    model: db.Category,
                    as: 'category', // Assuming you have an alias for the category model
                    attributes: ['id', 'name'], // Select fields to return for the category
                },
                {
                    model: db.Image,
                    as: 'images', // Assuming you have an alias for the category model

                },
            ],
        });

        // Check if no products found
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for this category' });
        }
        const products = data.map(product => {
            const productData = product.get({ plain: true });
            return {
                ...productData,
                discount: product.discount,
                discountedPrice: product.getDiscountedPrice()
            };
        });
        // Structure the response
        res.status(200).json({ success: true, items: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching products by category', error });
    }
}



module.exports = {
    createProduct,
    addDiscountToProduct,
    getProductById,
    getDiscountedProducts,
    getProductsByCatId,
    getAllProducts
}
