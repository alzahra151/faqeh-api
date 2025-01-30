const db = require("../models")
const ApiError = require("../helpers/apiError")
const ApiResponser = require("../helpers/apiResponser");


async function addToCart(req, res, next) {
    console.log(req.body)
    const userId = req.user.id
    const { productId, quantity, color, size } = req.body
    try {
        const cart = await db.Cart.findOne({ where: { userId } });
        if (!cart) {
            // If no cart exists, create one
            const newCart = await db.Cart.create({ userId, totalPrice: 0 });
            const item = await db.CartItem.create({
                cartId: newCart.id,
                productId,
                quantity,
                color,
                size
            });
            const totalPrice = item.price*item.quantity
            cart.totalPrice = totalPrice;
            await cart.save();
        } else {
            // If cart exists, check if the product already exists in CartItem
            const existingCartItem = await db.CartItem.findOne({
                where: { cartId: cart.id, productId },
            });

            if (existingCartItem) {
                existingCartItem.quantity = quantity; // Update the quantity
                existingCartItem.color = color
                existingCartItem.size = size
                await existingCartItem.save();
            } else {
                await db.CartItem.create({
                    cartId: cart.id,
                    productId,
                    quantity,
                    color,
                    size
                });
                // Recalculate totalPrice
                const updatedCartItems = await db.CartItem.findAll({
                    where: { cartId: cart.id },
                    include: [{ model: db.Product, as: 'product' }],
                });
                const totalPrice = updatedCartItems.reduce(
                    (sum, item) => sum + item.quantity * item.product.price,
                    0
                );
                cart.totalPrice = totalPrice;
                await cart.save();

            }
        }

        // console.log('Added to cart');
        // return new ApiResponser(res ,cartitem)
        res.status(200).json("Added to cart")


    } catch (error) {
        next(error)
    }

}
async function removeCartItem(req, res, next) {
    const userId = req.user.id
    const { productId } = req.params
    try {

        const cart = await db.Cart.findOne({ where: { userId } });

        if (cart) {
            await db.CartItem.destroy({
                where: { cartId: cart.id, productId },
            });
        }

        console.log('Removed from cart');
        res.status(200).json("done")

    } catch (erro) {
        next(erro)
    }
}
async function clearCart(req, res, next) {
    const userId = req.user.id

    try {

        const cart = await db.Cart.findOne({ where: { userId } });

        if (cart) {
            await db.CartItem.destroy({
                where: { cartId: cart.id },
            });
        }

        console.log('Removed from cart');
        res.status(200).json("done")

    } catch (erro) {
        next(erro)
    }
}
async function getCartDetails(req, res, next) {
    const userId = req.user.id
    console.log(userId)
    try {
        const cart = await db.Cart.findOne({
            where: { userId },
            include: [
                {
                    model: db.CartItem,
                    as: 'items',
                    include: [
                        {
                            model: db.Product,
                            as: 'product',
                            include: [
                                {
                                    model: db.Image,
                                    as: "images"
                                }
                            ]
                        },
                    ],
                },
            ],
        });
        // Calculate the total price

        if (cart) {
            const itemsWithDiscounts = cart.items?.map(item => {
                const { product, quantity } = item;
                const discount = product.discount || 0; // Get discount percentage
                const discountedPrice = product.price * (1 - discount / 100); // Apply discount
                const totalPriceForItem = discountedPrice * quantity; // Total price for this item
                return {
                    ...item.get({ plain: true }), // Get raw item data
                    discountedPrice,
                    totalPriceForItem,
                };
            });

            const totalPrice = itemsWithDiscounts.reduce((sum, item) => sum + item.totalPriceForItem, 0);
            cart.totalPrice = totalPrice
            cart.save()
        }

        res.status(200).json(cart)
    } catch (error) {
        next(error)
    }
}
async function decrementItemQuentity(req, res, next) {
    const userId = req.user.id
    // const userId = 1
    const { productId, quantity } = req.body;

    try {
        const cart = await db.Cart.findOne({ where: { userId } });

        if (cart) {
            const cartItem = await db.CartItem.findOne({
                where: { cartId: cart.id, productId },
            });

            if (cartItem) {
                cartItem.quantity += quantity;
                await cartItem.save();
                return res.status(200).json({ message: 'Cart quantity updated successfully' });
            }
        }
        res.status(404).json({ message: 'Cart item not found' });
    } catch (error) {
        next(error);
    }
}
async function incrementItemQuentity(req, res, next) {
    // const userId=req.user.id
    const userId = 1
    const { productId, quantity } = req.body;
    console.log(productId, quantity)
    console.log(userId)
    try {
        const cart = await db.Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const product = await db.Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await db.sequelize.transaction(async (transaction) => {
            const cartItem = await db.CartItem.findOne({ where: { cartId: cart.id, productId }, transaction });
            if (!cartItem) {
                return res.status(404).json({ message: "Cart item not found" });
            }
            console.log(cartItem.quantity)
            cartItem.quantity = quantity + 1;
            await cartItem.save({ transaction });
            console.log(cartItem.quantity)
        });

        res.status(200).json({

            message: "Cart updated successfully",
        });
    } catch (error) {
        next(error);
    }
}
async function getTotalQuantity(req, res, next) {
    const userId = req.user.id
    // const userId=1
    try {
        const totalQuantity = await db.Cart.findAll({

            where: { userId: userId },
            include: [
                {
                    model: db.CartItem,
                    as: "items",
                    attributes: [
                        [db.Sequelize.fn('SUM', db.Sequelize.col('quantity')), 'totalQuantity']
                    ], // No need to fetch extra fields from Product
                }
            ],

            raw: true
        });

        res.status(200).json(totalQuantity || 0)  // Return 0 if no items exist
    } catch (error) {
        console.error('Error calculating total quantity:', error);
        next(error);
    }
}
module.exports = {
    addToCart,
    removeCartItem,
    getCartDetails,
    incrementItemQuentity,
    decrementItemQuentity,
    clearCart,
    getTotalQuantity
}