const { expect } = require('chai');
const request = require("supertest");
const { app } = require("./../../app");
const { loginUser } = require("../helpers/helper");


describe("Order", () => {
    let loggedInUser
    beforeEach(async function () {
        loggedInUser = await loginUser('gracejohn@gmail.com', 'graceeee1');
        console.error('>>>>> loggedInUser', loggedInUser.body.data.token);

    });

    describe("get a logged in users order", () => {
        it('should return a 401 if no token', (done) => {
            request(app)
                .get("/api/v1/order/individual-users-order")
                .expect(401)
                .end(done)
        })

        it('should get an order', (done) => {
            request(app)
                .get("/api/v1/order/individual-users-order")
                .set("authorization", `Bearer ${loggedInUser.body.data.token}`)
                .expect(200)
                .end(done)
        })
    })
})