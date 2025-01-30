const db = require('../models')

async function addOrder(req, res, next) {
    try {
        const userId = req.user.id
        // const userId = 1
        const { orderId } = req.body;
        // const { userId }=req.bpdy
        console.log(userId)
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
                        },
                    ],
                },
            ],
        });

        if (!cart) throw new Error('Cart not found');

        // Calculate total
        const totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

        // Create order
        const order = await db.Order.create({
            userId,
            totalPrice,
            status: 'Paid',
            paypalOrderId: orderId,
        });

        // Map items to OrderItem
        const orderItems = cart.items.map(item => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.quantity * item.product.price
        }));

        await db.OrderItem.bulkCreate(orderItems);

        // Clear the user's cart
        await db.CartItem.destroy({ where: { cartId: cart.id } });
        // await Cart.destroy({ where: { id: cart.id } });

        console.log('Order completed and cart cleared');
        res.status(200).json(order)
    } catch (erro) {
        next(erro)
    }
}
async function getOrders(req ,res ,next) {
    try { 
        const orders = await db.Order.findAll({
            include: [{
                model: db.OrderItem,
                as:"items",
            }, {
                model: db.User,
                as:"user"
            }
            ]
        })
        res.status(200).json(orders)
        
    } catch (erro) {
        
    }
}

module.exports = {
    addOrder,
    getOrders
}