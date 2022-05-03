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
      Product.belongsTo(models.categories) // many products to one category
      Product.belongsToMany(models.carts,{
        through: 'cartProducts',
        foreignKey: 'ProductId'
    }); // many carts to many products
      Product.belongsToMany(models.orders,{
        through: 'orderProducts',
        // as: 'products',
        foreignKey: 'ProductId'
      }); // many orders to many products
    }
  }
  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    productDetails: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
       type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price:{
      type: DataTypes.DECIMAL
    },
    imageOne:{
      type: DataTypes.TEXT
    },
    imageTwo: {
      type: DataTypes.TEXT
    },
    imageThree:{
      type: DataTypes.TEXT
    },
    imageThumbnail:{
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'products',
  });
  return Product;
};