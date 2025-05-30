'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' })
    }
  }
  Order.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    
    status: {
      type: DataTypes.ENUM("Pending", "Paid", 'Shipped'),
      defaultValue: 'Pending', // Use 'Pending', 'Paid', 'Shipped' etc.
    },
    paypalOrderId: { type: DataTypes.STRING, allowNull: false }, 
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};