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
      Cart.belongsTo(models.users) // many carts to one user
      Cart.belongsToMany(models.products, {
        through: 'cartProducts',
        foreignKey: "cartId"
      }) // many carts to many products
      Cart.hasOne(models.orders) // one cart to one order
    }
  }
  Cart.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cartStatus: {
      type: DataTypes.ENUM('checkedout', 'notcheckedout'),  // on checkout subtract the ordered quantity from the product quantity
      allowNull: false,
    },
    price:{
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'carts',
  });
  return Cart;
};