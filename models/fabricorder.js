'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FabricOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FabricOrder.init({
    user_name: DataTypes.STRING,
    user_mobile: DataTypes.STRING,
    user_address: DataTypes.STRING,
    fabric_season: DataTypes.STRING,
    fabric_color: DataTypes.STRING,
    fabric_image: DataTypes.STRING,
    fabric_description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    model: DataTypes.STRING,
    neck_model: DataTypes.STRING,
    neck_padding: DataTypes.STRING,
    buttons: DataTypes.STRING,
    sleeves_padding: DataTypes.STRING,
    pen_model: DataTypes.STRING,
    gapzor_padding: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'FabricOrder',
  });
  return FabricOrder;
};