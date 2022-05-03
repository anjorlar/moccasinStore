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
      Order.belongsTo(models.users) // one User to many orders
      Order.belongsToMany(models.products, {
        through: 'orderProducts',
        foreignKey: 'orderId'
      }) // many order to many products
      Order.belongsTo(models.carts) // one order to one cart
    }
  }
  Order.init({
    orderStatus: {
      type: DataTypes.ENUM('fulfilled', 'unfulfilled'),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'orders',
  });
  return Order;
};