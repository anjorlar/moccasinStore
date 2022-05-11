
module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            "categories",
            [
                {
                    categoryName: 'Adult'
                },
                {
                    categoryName: 'Children'
                },
            ],
            {}
        ),

    down: (queryInterface) => queryInterface.bulkDelete("categories", null, {}),
};
