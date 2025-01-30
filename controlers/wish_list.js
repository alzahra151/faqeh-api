const db = require('../models'); // Assuming Sequelize models are in `models`

// Add item to Wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const userId=req.user.id
        const {  productId } = req.body;

        // Check if product already exists in wishlist for this user
        const existingItem = await db.WishList.findOne({
            where: { userId, productId },
        });

        if (existingItem) {
            return res.status(400).json({ message: 'Product is already in the wishlist' });
        }

        const wishlistItem = await db.WishList.create({ userId, productId });
        res.status(201).json({ success: true, data: wishlistItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding to wishlist', error });
    }
};

// Get Wishlist for a User
exports.getUserWishlist = async (req, res) => {
    try {
        const  userId  = req.user.id;

        const wishlist = await db.WishList.findAll({
            where: { userId },
            include: [
                {
                    model: db.Product,
                    as: 'product',
                    include: [{
                        model: db.Image,
                        as:"images"
                    }]
                }, // Include product details
            ],
        });

        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching wishlist', error });
    }
};

// Update Wishlist Item (Optional)
exports.updateWishlistItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;

        const updated = await db.Wishlist.update(
            { productId },
            { where: { id } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.status(200).json({ success: true, message: 'Wishlist item updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating wishlist item', error });
    }
};

// Remove item from Wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await db.Wishlist.destroy({
            where: { id },
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.status(200).json({ success: true, message: 'Wishlist item removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error removing from wishlist', error });
    }
};
