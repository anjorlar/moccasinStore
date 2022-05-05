'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cartProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cartProducts.init({
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ProductId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    timestamps: false,
    sequelize,
    modelName: 'cartProducts',
  });
  return cartProducts;
};