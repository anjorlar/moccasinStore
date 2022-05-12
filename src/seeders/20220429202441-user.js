// const bcrypt = require("bcryptjs");
const { hashPassword } = require("../utils/utils");

module.exports = {
    up: async (queryInterface) =>
        queryInterface.bulkInsert(
            "users",
            [
                {
                    name: "John Doe",
                    email: "lordsylharx@gmail.com",
                    password: await hashPassword("johndoe"),
                    address: 'awolkin road off chevy estate imokin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Paul Yin",
                    email: "Yin@gmail.com",
                    password: await hashPassword("pauloluyege"),
                    address: '14 kinlt powr estate ilashe',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Adebayo Moshood",
                    email: "mosh@gmail.com",
                    password: await hashPassword("waiver"),
                    address: 'luiow road off drut estate ose',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Jane Doe",
                    email: "janedoe@gmail.com",
                    password: await hashPassword("janedoe"),
                    address: 'drut road off chevy estate pliov',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Grace John",
                    email: "gracejohn@gmail.com",
                    password: await hashPassword("graceeee1"),
                    address: 'qrty road off parka estate yuof',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }, {
                    name: "Masuku Bebes",
                    email: "bebes@gmail.com",
                    password: await hashPassword("masukubebee"),
                    address: 'qrty road off parka estate yuof',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        ),

    down: (queryInterface) => queryInterface.bulkDelete("users", null, {}),
};
