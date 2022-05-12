
module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            "carts",
            [
                {
                    quantity: 1,
                    pricePerUnit: 4000,
                    totalPrice: 4000,
                    cartStatus: 'checkedout',
                    userId: 1,
                    productId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'checkedout',
                    userId: 1,
                    productId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'checkedout',
                    userId: 2,
                    productId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 3,
                    pricePerUnit: 6000,
                    totalPrice: 18000,
                    cartStatus: 'checkedout',
                    userId: 2,
                    productId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'abandoned',
                    userId: 2,
                    productId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'abandoned',
                    userId: 2,
                    productId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'notcheckedout',
                    userId: 2,
                    productId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'notcheckedout',
                    userId: 2,
                    productId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'notcheckedout',
                    userId: 3,
                    productId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'notcheckedout',
                    userId: 3,
                    productId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'notcheckedout',
                    userId: 4,
                    productId: 3,
                    createdAt: new Date(new Date() - (24 * 60 * 70 * 1000)),
                    updatedAt: new Date(new Date() - (24 * 60 * 60 * 1000)),
                },
                {
                    quantity: 2,
                    pricePerUnit: 6000,
                    totalPrice: 12000,
                    cartStatus: 'notcheckedout',
                    userId: 4,
                    productId: 6,
                    createdAt: new Date(new Date() - (24 * 60 * 80 * 1000)),
                    updatedAt: new Date(new Date() - (24 * 60 * 60 * 1000)),
                },
                {
                    quantity: 1,
                    pricePerUnit: 6000,
                    totalPrice: 6000,
                    cartStatus: 'notcheckedout',
                    userId: 5,
                    productId: 6,
                    createdAt: new Date(new Date() - (24 * 60 * 95 * 1000)),
                    updatedAt: new Date(new Date() - (24 * 60 * 60 * 1000)),
                },
            ],
            {}
        ),

    down: (queryInterface) => queryInterface.bulkDelete("carts", null, {}),
};
