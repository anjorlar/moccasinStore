
module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            "cartProducts",
            [
                {
                    cartId: 1,
                    productId: 2,
                },
                {
                    cartId: 2,
                    productId: 3,
                },
                {
                    cartId: 3,
                    productId: 3,
                },
                {
                    cartId: 4,
                    productId: 1,
                }, {
                    cartId: 5,
                    productId: 3,
                },
                {
                    cartId: 6,
                    productId: 3,
                },
                {
                    cartId: 7,
                    productId: 3,
                },
                {
                    cartId: 8,
                    productId: 3,
                },
            ],
            {}
        ),

    down: (queryInterface) => queryInterface.bulkDelete("cartProducts", null, {}),
};
