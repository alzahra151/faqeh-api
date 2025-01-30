'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Image, { as: 'images', foreignKey: 'productId' });
      Product.belongsTo(models.Category, { as:"category", foreignKey: 'categoryId' });
      Product.belongsToMany(models.User, { through: 'WishList', foreignKey: 'productId', as: 'users' });
      Product.hasMany(models.CartItem, { as: 'cartItems', foreignKey: 'productId' });
      Product.hasMany(models.OrderItem, { as: 'orderItems', foreignKey: 'productId' });
      
      // Product.belongsTo(models.Category, { foreignKey: 'categoryId'});
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // field: "category_id",
    },
    description: {
      type: DataTypes.TEXT,
      // allowNull: false,
    },
    colors: {
      type: DataTypes.JSON, // Store as ["red", "blue", "green"]
      allowNull: true,
    },
    sizes: {
      type: DataTypes.JSON, // Store as ["red", "blue", "green"]
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      // allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0, // No discount by default
    },
   
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};