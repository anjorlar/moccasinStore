const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            "orders",
            [
                {
                    transactionId: uuidv4(),
                    userId: 1,
                    cartId: 1,
                    productId: 2,
                    address: 'awolkin road off chevy estate imokin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    transactionId: uuidv4(),
                    userId: 1,
                    cartId: 2,
                    productId: 3,
                    address: 'awolkin road off chevy estate imokin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, {
                    transactionId: uuidv4(),
                    userId: 2,
                    cartId: 3,
                    productId: 3,
                    address: 'awolkin road off chevy estate imokin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, {
                    transactionId: uuidv4(),
                    userId: 2,
                    cartId: 4,
                    productId: 1,
                    address: 'awolkin road off chevy estate imokin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        ),

    down: (queryInterface) => queryInterface.bulkDelete("orders", null, {}),
};
