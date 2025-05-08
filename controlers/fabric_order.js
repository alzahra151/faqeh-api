const db = require('../models'); // Adjust based on your setup
const FabricOrder = db.FabricOrder;
const cloudinary = require('../utilies/cloudinary')

module.exports = {
    // Create a new FabricOrder
    async createFabricOrder(req, res, next) {
        try {
            const data = {
                user_name,
                user_mobile,
                user_address,
                fabric_season,
                fabric_color,
                fabric_image,
                fabric_description,
                price,
                model,
                neck_model,
                neck_padding,
                buttons,
                sleeves_padding,
                pen_model,
                gapzor_padding,
            } = req.body;
            console.log(data)
            const fabricOrder = await FabricOrder.create(data);
            res.status(200).json(fabricOrder);
        } catch (error) {
            next(error);
        }
    },

    // Get all categories
    async getAllFabricOrders(req, res, next) {
        try {
            const fabricOrders = await FabricOrder.findAll();
            res.status(200).json(fabricOrders);
        } catch (error) {
            next(error);
        }
    },

    // Get a FabricOrder by ID
    async getFabricOrderById(req, res, next) {
        try {
            const { id } = req.params;
            const fabricOrder = await FabricOrder.findByPk(id);
            if (!fabricOrder) return res.status(404).json({ message: 'FabricOrder not found' });
            res.status(200).json(fabricOrder);
        } catch (error) {
            next(error);
        }
    },

    // // Update a FabricOrder
    // async updateFabricOrder(req, res, next) {
    //     try {
    //         const { id } = req.params;
    //         const { name, description } = req.body;
    //         const FabricOrder = await FabricOrder.findByPk(id);
    //         if (!FabricOrder) return res.status(404).json({ message: 'FabricOrder not found' });

    //         FabricOrder.name = name || FabricOrder.name;
    //         FabricOrder.description = description || FabricOrder.description;

    //         await FabricOrder.save();
    //         res.status(200).json(FabricOrder);
    //     } catch (error) {
    //         next(error);
    //     }
    // },


};
