'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Cart.hasMany(models.CartItem, { as: 'items', foreignKey: 'cartId' });
    }
  }
  Cart.init({

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Refers to the Users table
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};