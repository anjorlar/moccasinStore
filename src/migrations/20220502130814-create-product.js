'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      productDetails: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      categoryId:{
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id",
          // as: "category",
        }
      },
      imageOne: {
        type: Sequelize.TEXT
      },
      imageTwo: {
        type: Sequelize.TEXT
      },
      imageThree: {
        type: Sequelize.TEXT
      },
      imageThumbnail: {
        type: Sequelize.TEXT
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};