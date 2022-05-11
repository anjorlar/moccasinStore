
module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            "orderProducts",
            [
                {
                    orderId: 1,
                    productId: 2,
                }, {
                    orderId: 2,
                    productId: 3,
                }, {
                    orderId: 3,
                    productId: 2,
                }, {
                    orderId: 4,
                    productId: 1,
                },
            ],
            {}
        ),

    down: (queryInterface) => queryInterface.bulkDelete("orderProducts", null, {}),
};
